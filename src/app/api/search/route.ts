import { NextRequest, NextResponse } from "next/server";
import ServiceProvider from "@/database/schema/serviceProvider";
import Post from "@/database/schema/post";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const isValidText = /^[a-zA-Z0-9 _-]+$/;

    if (!isValidText.test(query)) {
        return NextResponse.json({ message: "Please enter text only" });
    }

    // Search Service Providers
    const serviceProviders = await ServiceProvider.find({
        $or: [
            { name: { $regex: query, $options: "i" } },
            { service: { $regex: query, $options: "i" } }
        ]
    }).limit(5);

    // Search Posts
    const posts = await Post.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }).limit(5);


    return NextResponse.json({
        serviceProviders,
        posts,
    });
}