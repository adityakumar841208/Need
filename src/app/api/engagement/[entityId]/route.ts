import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/database/dbConnect/connection";
import Post from "@/database/schema/post";
import { Types } from "mongoose";

export async function GET(
    request: NextRequest,
    context: { params: { entityId: string } }  // Changed to context parameter
) {
    try {
        const { entityId } = context.params;  // Extract entityId this way
        await dbConnect();

        const post = await Post.findById(entityId).select('engagement');

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(post.engagement);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch engagement data" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: { entityId: string } }  // Changed to context parameter
) {
    try {
        const { entityId } = await context.params;  // Extract entityId this way
        const { type, action, userId } = await request.json();
        // console.log("Request body:", { type, action, userId });
        if (!userId) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 401 }
            );
        }

        await dbConnect();

        // Check if post exists before updating
        const existingPost = await Post.findById(entityId);  // Use extracted entityId
        if (!existingPost) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        let updateQuery = {};
        console.log('Query Type', type)
        switch (type) {
            case 'like':
                const hasLiked = existingPost.engagement.likes.users.some(
                    (like: any) => like.user._id.toString() === userId
                );
                // console.log(hasLiked, "hasLiked")

                if (action === 'add' && !hasLiked) {
                    updateQuery = {
                        $inc: { 'engagement.likes.count': 1 },
                        $push: {
                            'engagement.likes.users': {
                                user: { _id: new Types.ObjectId(userId) },
                                timestamp: new Date()
                            }
                        }
                    };
                } else if (action === 'remove' && hasLiked) {
                    updateQuery = {
                        $inc: { 'engagement.likes.count': -1 },
                        $pull: {
                            'engagement.likes.users': {
                                user: { _id: new Types.ObjectId(userId) },
                            }
                        }
                    };
                }
                break;

            case 'save':
            case 'share':
                updateQuery = {
                    $inc: { [`engagement.${type}s`]: action === 'add' ? 1 : -1 }
                };
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid engagement type" },
                    { status: 400 }
                );
        }

        // Only update if there's a valid operation
        if (Object.keys(updateQuery).length === 0) {
            return NextResponse.json({ message: "No update required" });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            entityId,  // Use extracted entityId here too
            updateQuery,
            {
                new: true,
            }
        ).select('engagement');

        return NextResponse.json({
            engagement: {
                likes: updatedPost.engagement.likes || { count: 0, users: [] },
                saves: updatedPost.engagement.saves || 0,
                shares: updatedPost.engagement.shares || 0,
                comments: updatedPost.engagement.comments || { count: 0, users: [] },
            }
        });

    } catch (error) {
        console.error('Engagement update error:', error);
        return NextResponse.json(
            { error: "Failed to update engagement" },
            { status: 500 }
        );
    }
}
