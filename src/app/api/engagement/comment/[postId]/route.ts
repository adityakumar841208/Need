import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect/connection';
import Post from '@/database/schema/post';
import mongoose from 'mongoose';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = await params;

    // Get data from request body
    const body = await request.json();

    if (!body.userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    await dbConnect();

    // Create a new comment object with mongoose ObjectId
    const commentId = new mongoose.Types.ObjectId();
    const now = new Date();
    
    // Create the comment object to push to post schema
    const newComment = {
      _id: commentId,
      user: {
        _id: new mongoose.Types.ObjectId(body.userId),
        name: body.name || 'User',
        profilePicture: body.image || '/default-avatar.png',
        verified: body.verified || false
      },
      content: body.content,
      timestamp: now,
      reply: body.reply ? new mongoose.Types.ObjectId(body.reply) : null
    };
    
    // Update post with new comment
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { "engagement.comments.users": newComment },
        $inc: { "engagement.comments.count": 1 }
      },
      { new: true }
    );

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Find the newly created comment from the updated post
    const lastComment = post.engagement.comments.users.find(
      (c: any) => c._id.toString() === commentId.toString()
    );

    if (!lastComment) {
      return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }

    // Return the comment in the expected format
    const commentResponse = {
      _id: lastComment._id,
      user: {
        _id: lastComment.user._id,
        name: lastComment.user.name,
        profilePicture: lastComment.user.profilePicture,
        verified: lastComment.user.verified
      },
      content: lastComment.content,
      timestamp: lastComment.timestamp,
      reply: lastComment.reply
    };

    return NextResponse.json({ comment: commentResponse }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}