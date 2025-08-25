import { NextRequest, NextResponse } from "next/server";
import ServiceProvider from "@/database/schema/serviceProvider";
import Post from "@/database/schema/post";
import Customer from "@/database/schema/customer";
import dbConnect from "@/database/dbConnect/connection";

// Default radius in meters (5 km)
const DEFAULT_RADIUS_METERS = 5000;
const PAGE_LIMIT = 20; // results per page
const HARD_CAP = 100; // hard cap for total results

// Escape regex safely (to prevent ReDoS / invalid regex input)
function escapeRegex(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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
      return NextResponse.json(
        { message: "lat and lng query params are required and must be numbers" },
        { status: 400 }
      );
    }

    const radiusMeters = radiusParam ? Number(radiusParam) : DEFAULT_RADIUS_METERS;
    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
    const skip = (page - 1) * PAGE_LIMIT;

    // Base filters
    const filters: Record<string, unknown> = {};
    if (category) filters.category = category;

    if (verifiedParam !== null && verifiedParam !== undefined) {
      filters.verified = verifiedParam === "true";
    }

    if (maxPriceParam && !isNaN(Number(maxPriceParam))) {
      filters.price = { $lte: Number(maxPriceParam) };
    }

    // Text search
    if (q && q.trim()) {
      const escaped = escapeRegex(q.trim());
      const re = new RegExp(escaped.split(/\s+/).join("|"), "i");
      filters.$or = [
        { name: { $regex: re } },
        { "services.name": { $regex: re } },
      ];
    }

    const type = typeParam; // 'provider' | 'post' | 'customer' | 'all'
    const results: Record<string, unknown> = {};
    let combinedCount = 0;

    // Helper to cap totals
    const capTotal = (n: number) => (n > HARD_CAP ? `${HARD_CAP}+` : n);

    // ---------------- Providers ----------------
    if (type === "provider" || type === "all") {
      if (!isNaN(lat) && !isNaN(lng)) {
        const matchFilters: any = { ...filters };

        const geoNearStage = {
          $geoNear: {
            near: { type: "Point", coordinates: [lng, lat] }, // MUST be [lng, lat]
            distanceField: "distance",
            maxDistance: radiusMeters,
            spherical: true,
          },
        };

        // Use $facet to get docs + count in one run
        const pipeline: any[] = [
          geoNearStage,
          { $match: matchFilters },
          {
            $facet: {
              docs: [{ $skip: skip }, { $limit: PAGE_LIMIT }],
              totalCount: [{ $count: "count" }],
            },
          },
        ];

        const [aggResult] = await ServiceProvider.aggregate(pipeline).exec();
        const providers = aggResult.docs || [];
        const providerCount =
          aggResult.totalCount.length > 0 ? aggResult.totalCount[0].count : 0;

        results.providers = providers;
        combinedCount += providerCount;
        results["providersMeta"] = {
          count: providerCount,
          hasMore: skip + providers.length < providerCount,
        };
      } else {
        // No geo: simple find
        const [providers, providerCount] = await Promise.all([
          ServiceProvider.find(filters)
            .skip(skip)
            .limit(PAGE_LIMIT)
            .lean(),
          ServiceProvider.countDocuments(filters),
        ]);

        results.providers = providers;
        combinedCount += providerCount;
        results["providersMeta"] = {
          count: providerCount,
          hasMore: skip + providers.length < providerCount,
        };
      }
    }

    // ---------------- Posts ----------------
    if (type === "post" || type === "all") {
      if (q && q.trim()) {
        const escaped = escapeRegex(q.trim());
        const re = new RegExp(escaped, "i");

        const postFilter: any = {
          $or: [
            { "content.text": { $regex: re } },
            { tags: { $regex: re } },
            { "user.name": { $regex: re } },
          ],
        };

        const [posts, postCount] = await Promise.all([
          Post.find(postFilter)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(PAGE_LIMIT)
            .lean(),
          Post.countDocuments(postFilter),
        ]);

        results.posts = posts;
        combinedCount += postCount;
        results["postsMeta"] = {
          count: postCount,
          hasMore: skip + posts.length < postCount,
        };
      } else {
        results.posts = [];
        results["postsMeta"] = { count: 0, hasMore: false };
      }
    }

    // ---------------- Customers ----------------
    if (type === "customer" || type === "all") {
      if (q && q.trim()) {
        const escaped = escapeRegex(q.trim());
        const re = new RegExp(escaped.split(/\s+/).join("|"), "i");

        const customerFilter: any = {
          $or: [{ name: { $regex: re } }, { email: { $regex: re } }],
        };

        const [customers, customerCount] = await Promise.all([
          Customer.find(customerFilter).skip(skip).limit(PAGE_LIMIT).lean(),
          Customer.countDocuments(customerFilter),
        ]);

        results.customers = customers;
        combinedCount += customerCount;
        results["customersMeta"] = {
          count: customerCount,
          hasMore: skip + customers.length < customerCount,
        };
      } else {
        results.customers = [];
        results["customersMeta"] = { count: 0, hasMore: false };
      }
    }

    // ---------------- Final Response ----------------
    const total = capTotal(combinedCount);

    return NextResponse.json({
      ...results,
      total,
      page,
      perPage: PAGE_LIMIT,
    });
  } catch (err) {
    console.error("Nearby search error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
