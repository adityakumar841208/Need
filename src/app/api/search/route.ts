import { NextRequest, NextResponse } from "next/server";
import ServiceProvider from "@/database/schema/serviceProvider";
import Post from "@/database/schema/post";
import dbConnect from "@/database/dbConnect/connection";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        
        const { searchParams } = new URL(req.url);
        console.log("Search Params:", searchParams.toString());
        const query = searchParams.get("q") || "";
        
        // More relaxed validation - allow spaces, punctuation, and special characters
        const isValidText = /^[a-zA-Z0-9\s\-_.,!@#$%^&*()+=\[\]{}|;':"<>?\/\\`~]+$/;

        if (!query.trim()) {
            return NextResponse.json({ message: "Please enter a search query" });
        }

        if (!isValidText.test(query)) {
            return NextResponse.json({ message: "Invalid characters in search query" });
        }

        // Search Service Providers with increased limit
        const serviceProviders = await ServiceProvider.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { service: { $regex: query, $options: "i" } }
            ]
        }).limit(10);

        // Search Posts - enhanced search with multiple criteria and increased limit
        const searchTerms = query.trim().split(/\s+/); // Split query into individual terms
        const regexPatterns = searchTerms.map(term => new RegExp(term, "i"));
        
        const posts = await Post.find({
            $or: [
                // Search in post content text
                { "content.text": { $regex: query, $options: "i" } },
                // Search individual words in content
                { "content.text": { $in: regexPatterns } },
                // Search in tags array
                { tags: { $in: regexPatterns } },
                // Search in user name (for posts by specific service providers)
                { "user.name": { $regex: query, $options: "i" } },
                // Search in user role
                { "user.role": { $regex: query, $options: "i" } },
                // Match any of the search terms in tags
                { tags: { $elemMatch: { $regex: query, $options: "i" } } }
            ]
        })
        .sort({ timestamp: -1 }) // Sort by most recent first
        .limit(20); // Increased limit for more results

        console.log(`Search completed: Found ${serviceProviders.length} service providers and ${posts.length} posts for query: "${query}"`);

        return NextResponse.json({
            serviceProviders,
            posts,
            searchQuery: query,
            totalResults: serviceProviders.length + posts.length
        });
    } catch (error) {
        console.error("Search API error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}