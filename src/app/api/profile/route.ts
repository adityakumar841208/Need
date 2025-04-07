import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/utils/auth';
import mongoose from 'mongoose';
import ServiceProvider from '@/database/schema/serviceProvider';
import Customer from '@/database/schema/customer';
import dbConnect from '@/database/dbConnect/connection';
import { JwtPayload } from 'jsonwebtoken';

export async function PUT(request: NextRequest) {
    try {
        // 1. Connect to database
        await dbConnect();
        
        // 2. Get access token from cookies
        const token = request.cookies.get('accessToken')?.value;
        
        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }
        
        // 3. Verify token and get user ID
        const verifiedToken = verifyAccessToken(token) as JwtPayload;
        
        if (!verifiedToken || !verifiedToken.userId) {
            return NextResponse.json(
                { error: 'Invalid authentication token' },
                { status: 401 }
            );
        }
        
        const userId = verifiedToken.userId;
        
        // 4. Parse request body with updated user data
        const updatedData = await request.json();
        
        // 5. Fetch the user to determine user type
        const user = await ServiceProvider.findById({'_id':userId}) || await Customer.findById({'_id':userId}) ;
        
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
        
        const userType = user.role;
        
        // 6. Filter out sensitive fields that should not be directly updated
        const { _id, id, email, role, ...safeUpdateFields } = updatedData;
        
        // 7. Update user's name if provided
        if (updatedData.name) {
            user.name = updatedData.name;
            await user.save();
        }
        
        let updatedProfile;
        
        // 8. Update profile based on user type
        if (userType === 'serviceprovider') {
            // Find and update service provider profile
            updatedProfile = await ServiceProvider.findOneAndUpdate(
                { userId: new mongoose.Types.ObjectId(userId) },
                { $set: safeUpdateFields },
                { new: true } // Return the updated document
            ).lean();
            
            if (!updatedProfile) {
                // Create profile if it doesn't exist
                updatedProfile = await ServiceProvider.create({
                    userId: new mongoose.Types.ObjectId(userId),
                    ...safeUpdateFields
                });
            }
            
        } else if (userType === 'customer') {
            // Find and update customer profile
            updatedProfile = await Customer.findOneAndUpdate(
                { userId:new mongoose.Types.ObjectId(userId) },
                { $set: safeUpdateFields },
                { new: true } // Return the updated document
            ).lean();
            
            if (!updatedProfile) {
                // Create profile if it doesn't exist
                updatedProfile = await Customer.create({
                    userId:new mongoose.Types.ObjectId(userId),
                    ...safeUpdateFields
                });
            }
            
        } else {
            return NextResponse.json(
                { error: 'Invalid user type' },
                { status: 400 }
            );
        }
        
        // 9. Combine user and profile data
        const formattedUser = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            // Add profile data
            ...updatedProfile,
            // Make sure we don't duplicate the userId field
            userId: undefined
        };
        
        // 10. Return formatted response
        return NextResponse.json({
            user: formattedUser,
            userType: userType
        }, { status: 200 });
        
    } catch (error) {
        console.error('Profile update error:', error);
        
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to update profile' },
            { status: 500 }
        );
    }
}