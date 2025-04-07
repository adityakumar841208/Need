import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/utils/auth';
import dbConnect from '@/database/dbConnect/connection';
import Customer from '@/database/schema/customer';
import ServiceProvider from '@/database/schema/serviceProvider';

interface jwtPayload {
    userId: string;
    iat: number;
    exp: number;
}

export async function GET(request: NextRequest) {
    try {
        // Connect to database
        await dbConnect();

        // Get the access token from cookies
        const accessToken = request.cookies.get('accessToken')?.value;

        if (!accessToken) {
            return NextResponse.json(
                { message: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        // Verify the token and extract user ID
        try {
            const decoded = verifyAccessToken(accessToken) as jwtPayload;
            // console.log(decoded, 'decoded token');
            const userId: any = decoded.userId;

            // Try to find user in both collections
            let user = await Customer.findById(userId).select('-password -refreshToken');
            let userType = 'customer';

            // If not found in Customer collection, try ServiceProvider
            if (!user) {
                user = await ServiceProvider.findById(userId).select('-password -refreshToken');
                userType = 'serviceprovider';
            }

            // If user not found in either collection
            if (!user) {
                return NextResponse.json(
                    { message: 'User not found' },
                    { status: 404 }
                );
            }

            // Return user data
            return NextResponse.json({
                user,
                userType
            }, { status: 200 });

        } catch (tokenError) {
            console.error('Token verification error:', tokenError);
            return NextResponse.json(
                { message: 'Unauthorized - Invalid token' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}