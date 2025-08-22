import { NextRequest, NextResponse } from "next/server";
import ServiceProvider from "@/database/schema/serviceProvider";
import Post from "@/database/schema/post";
import Customer from "@/database/schema/customer";
import dbConnect from "@/database/dbConnect/connection";

// Default radius in meters (5 km)
const DEFAULT_RADIUS_METERS = 5000;
const PAGE_LIMIT = 20; // results per page
const HARD_CAP = 100; // hard cap for total results

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        console.log("Connected to DB for search");
        const { searchParams } = new URL(req.url);

        const latParam = searchParams.get("lat");
        const lngParam = searchParams.get("lng");
        const category = searchParams.get("category");
        const verifiedParam = searchParams.get("verified");
        const maxPriceParam = searchParams.get("maxPrice");
        const q = searchParams.get("q");
        const typeParam = (searchParams.get("type") || "all").toLowerCase();
        const pageParam = parseInt(searchParams.get("page") || "1", 10);
        const radiusParam = searchParams.get("radius");

        // Validate coords
        const lat = latParam ? Number(latParam) : NaN;
        const lng = lngParam ? Number(lngParam) : NaN;
        if (isNaN(lat) || isNaN(lng)) {
            return NextResponse.json({ message: "lat and lng query params are required and must be numbers" }, { status: 400 });
        }

        const radiusMeters = radiusParam ? Number(radiusParam) : DEFAULT_RADIUS_METERS;
        const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
        const skip = (page - 1) * PAGE_LIMIT;

        // Build base filters
        const filters: Record<string, unknown> = {};
        if (category) filters.category = category;
        if (verifiedParam !== null) filters.verified = verifiedParam === "true";
            if (maxPriceParam && !isNaN(Number(maxPriceParam))) filters.price = { $lte: Number(maxPriceParam) };
                // Optional text search - loose matching on name or services' name
                if (q && q.trim()) {
                    const re = new RegExp(q.trim().split(/\s+/).join('|'), 'i');
                    // we'll use this for providers and customers
                    filters.$or = [
                        { name: { $regex: re } },
                        { 'services.name': { $regex: re } }
                    ];
                }

                // Decide which types to search
                const type = typeParam; // 'provider' | 'post' | 'customer' | 'all'

                const results: Record<string, unknown> = {};
                let combinedCount = 0;

                // Helper to cap counts
                const capTotal = (n: number) => (n > HARD_CAP ? `${HARD_CAP}+` : n);

                // Providers search (geo if lat/lng provided)
                if (type === 'provider' || type === 'all') {
                    // If coordinates provided use aggregation with $geoNear (required for geospatial sorting/count).
                    if (!isNaN(lat) && !isNaN(lng)) {
                        // Build match stage from filters but ensure location is not duplicated in match
                        const matchFilters: any = { ...filters };
                        delete matchFilters.location;

                        const geoNearStage: any = {
                            $geoNear: {
                                near: { type: 'Point', coordinates: [lng, lat] },
                                distanceField: "distance",
                                maxDistance: radiusMeters,
                                spherical: true
                            }
                        };

                        // Pipeline to fetch paged docs
                        const docsPipeline: any[] = [
                            geoNearStage,
                            { $match: matchFilters },
                            { $skip: skip },
                            { $limit: PAGE_LIMIT }
                        ];

                        // Pipeline to compute total count (must also start with $geoNear)
                        const countPipeline: any[] = [
                            geoNearStage,
                            { $match: matchFilters },
                            { $count: "count" }
                        ];

                        const [providers, countResult] = await Promise.all([
                            ServiceProvider.aggregate(docsPipeline).exec(),
                            ServiceProvider.aggregate(countPipeline).exec()
                        ]);

                        const providerCount = (countResult && countResult[0] && countResult[0].count) ? countResult[0].count : 0;
                        results.providers = providers;
                        combinedCount += providerCount;
                        results['providersMeta'] = { count: providerCount, hasMore: providerCount > page * PAGE_LIMIT };
                    } else {
                        // No geo: plain find + countDocuments
                        const providerFilter = { ...filters };
                        const [providers, providerCount] = await Promise.all([
                            ServiceProvider.find(providerFilter).skip(skip).limit(PAGE_LIMIT).lean(),
                            ServiceProvider.countDocuments(providerFilter),
                        ]);
                        results.providers = providers;
                        combinedCount += providerCount;
                        results['providersMeta'] = { count: providerCount, hasMore: providerCount > page * PAGE_LIMIT };
                    }
                }

                // Posts search (text-based)
                if (type === 'post' || type === 'all') {
                    if (q && q.trim()) {
                        const terms = q.trim().split(/\s+/).map(t => new RegExp(t, 'i'));
                        const postFilter: any = {
                            $or: [
                                { 'content.text': { $regex: q, $options: 'i' } },
                                { 'content.text': { $in: terms } },
                                { tags: { $in: terms } },
                                { 'user.name': { $regex: q, $options: 'i' } },
                            ]
                        };

                        const [posts, postCount] = await Promise.all([
                            Post.find(postFilter).sort({ timestamp: -1 }).skip(skip).limit(PAGE_LIMIT).lean(),
                            Post.countDocuments(postFilter),
                        ]);
                        results.posts = posts;
                        combinedCount += postCount;
                        results['postsMeta'] = { count: postCount, hasMore: postCount > page * PAGE_LIMIT };
                    } else {
                        results.posts = [];
                        results['postsMeta'] = { count: 0, hasMore: false };
                    }
                }

                // Customers search (by name or other fields)
                if (type === 'customer' || type === 'all') {
                    if (q && q.trim()) {
                        const re = new RegExp(q.trim().split(/\s+/).join('|'), 'i');
                        const customerFilter: any = { $or: [ { name: { $regex: re } }, { email: { $regex: re } } ] };
                        const [customers, customerCount] = await Promise.all([
                            Customer.find(customerFilter).skip(skip).limit(PAGE_LIMIT).lean(),
                            Customer.countDocuments(customerFilter),
                        ]);
                        results.customers = customers;
                        combinedCount += customerCount;
                        results['customersMeta'] = { count: customerCount, hasMore: customerCount > page * PAGE_LIMIT };
                    } else {
                        results.customers = [];
                        results['customersMeta'] = { count: 0, hasMore: false };
                    }
                }

                const total = capTotal(combinedCount);

                return NextResponse.json({
                    ...results,
                    total,
                    page,
                    perPage: PAGE_LIMIT,
                });
    } catch (err) {
        console.error("Nearby search error:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}