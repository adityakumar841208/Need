import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect/connection';
import Customer from '@/database/schema/customer';
import ServiceProvider from '@/database/schema/serviceProvider';
import mongoose from 'mongoose';
import Post from '@/database/schema/post';

export async function PATCH(request: NextRequest) {
    try {
        await dbConnect();

        const { userId, postId, action, role } = await request.json();
        console.log('Request body:', { userId, postId, action, role });

        if (!userId || !postId) {
            return NextResponse.json(
                { error: 'User ID and Post ID are required' },
                { status: 400 }
            );
        }

        if (!['add', 'remove'].includes(action)) {
            return NextResponse.json(
                { error: 'Action must be either "add" or "remove"' },
                { status: 400 }
            );
        }

        let updateOperation;

        if (action === 'add') {
            // Add postId to user's bookmarks if it doesn't exist
            updateOperation = {
                $addToSet: { bookmarks: new mongoose.Types.ObjectId(postId) }
            };
        } else {
            // Remove postId from user's bookmarks
            updateOperation = {
                $pull: { bookmarks: new mongoose.Types.ObjectId(postId) }
            };
        }

        let updatedUser;
        // Update the user document
        if (role === 'serviceprovider') {
            updatedUser = await ServiceProvider.findByIdAndUpdate(
                userId,
                updateOperation,
                { new: true, select: 'bookmarks' } // Return updated document with just the bookmarks field
            );
        } else if (role === 'customer') {
            updatedUser = await Customer.findByIdAndUpdate(
                userId,
                updateOperation,
                { new: true, select: 'bookmarks' } // Return updated document with just the bookmarks field
            );
        }

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Also update the post's saves count
        await Post.findByIdAndUpdate(
            postId,
            {
                $inc: { 'engagement.saves': action === 'add' ? 1 : -1 }
            }
        );

        return NextResponse.json(
            {
                message: `Bookmark ${action === 'add' ? 'added' : 'removed'} successfully`,
                bookmarks: updatedUser.bookmarks
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating bookmarks:', error);

        return NextResponse.json(
            { error: 'Failed to update bookmarks' },
            { status: 500 }
        );
    }
}

//to POST all bookmark posts
export async function POST(request: NextRequest) {
    try {
        dbConnect();

        // get posts array from user's bookmarks as body data
        const postArray = await request.json();
        console.log('Request body:', postArray);

        const res = await Post.find({
            _id: { $in: postArray.bookmarks }
        }).sort({ createdAt: -1 });

        console.log('Response:', res);
        return NextResponse.json({ posts: res }, { status: 200 });

    } catch (error) {

    }
}

// to DELETE a bookmark post
export async function DELETE(request: NextRequest) {
    try {
        dbConnect();

        const { postId, userId, bookmarks } = await request.json();

        //decrease the save count of the post
        //remove the bookmark id from the user's profile

        // Update the user's bookmarks
        const updatedUser = await Customer.findByIdAndUpdate(
            userId,
            {
                $pull: { bookmarks: postId }
            },
            { new: true, select: 'bookmarks' } // Return updated document with just the bookmarks field
        );
        console.log('User bookmarks updated:', updatedUser);
        if (!updatedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
        // Also update the post's saves count
        const res = await Post.findByIdAndUpdate(
            postId,
            {
                $inc: { 'engagement.saves': -1 }
            }
        );
        console.log('Post save count updated:', res);


        console.log('Response:', res);
        return NextResponse.json({ posts: res }, { status: 200 });

    } catch (error) {
        console.error('Error deleting bookmark:', error);
        return NextResponse.json(
            { error: 'Failed to delete bookmark' },
            { status: 500 }
        );
    }
}


