import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAccessToken } from "@/utils/auth";
import Post from '@/database/schema/post';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload image to Cloudinary
async function uploadToCloudinary(base64Image: string): Promise<string> {
  console.log('[Cloudinary] Uploading image...');
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      base64Image,
      {
        folder: 'posts',
        resource_type: 'image',
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload failed:', error);
          reject(error);
        } else {
          console.log('[Cloudinary] Upload successful:', result?.secure_url);
          resolve(result?.secure_url || '');
        }
      }
    );
  });
}

export async function POST(request: NextRequest) {
  console.log('[API] Incoming post creation request');

  try {
    const formData = await request.formData();
    
    // Get user data from the request instead of fetching from DB
    const userJson = formData.get('user') as string;
    const content = formData.get('content') as string;
    const tagsJson = formData.get('tags') as string;
    const imageFile = formData.get('image') as Blob | null;

    // Parse user data
    let userData;
    try {
      userData = JSON.parse(userJson);
      console.log('[User] Parsed:', userData);
    } catch (error) {
      console.error('[User] Failed to parse user data:', error);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid user data' 
      }, { status: 400 });
    }

    // Validate user data
    if (!userData || !userData._id) {
      return NextResponse.json({ 
        success: false, 
        message: 'User data is required' 
      }, { status: 400 });
    }

    // Parse tags
    let tags = [];
    try {
      tags = tagsJson ? JSON.parse(tagsJson) : [];
      console.log('[Tags] Parsed:', tags);
    } catch (error) {
      console.warn('[Tags] Failed to parse tags JSON:', error);
      tags = [];
    }

    // Handle image upload if present
    let imageUrl = null;
    if (imageFile) {
      // console.log('[Image] Reading image blob...');
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const base64Image = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
      // console.log('[Image] Converted to base64');

      imageUrl = await uploadToCloudinary(base64Image);
    }

    // Create post
    // console.log('[DB] Creating post with user:', userData);
    const post = await Post.create({
      user: {
        _id: userData._id,
        name: userData.name,
        image: userData.profilePicture,
        verified: userData.verified,
        role: userData.role
      },
      content: {
        text: content,
        image: imageUrl
      },
      tags,
      timestamp: new Date()
    });

    // console.log('[DB] Post created:', post.id);

    return NextResponse.json({
      success: true,
      message: 'Post created successfully',
      post: {
        id: post.id,
        content: post.content,
        tags: post.tags,
        createdAt: post.timestamp
      }
    });

  } catch (error) {
    console.error('[Server] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while creating your post'
    }, { status: 500 });
  }
}
