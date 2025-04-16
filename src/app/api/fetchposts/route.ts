import Post from "@/database/schema/post";
import dbConnect from "@/database/dbConnect/connection";
import { NextResponse } from "next/server";

export async function GET(request: Request){
    await dbConnect();
    // .sort({createdAt: -1}).limit(10);
    const posts = await Post.find({})
    console.log(posts);
    if(!posts) return NextResponse.json({message: "No posts found"}, {status: 404});
    
    return NextResponse.json(posts, {status: 200});

}