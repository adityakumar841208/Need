import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/utils/auth';
import dbConnect from '@/database/dbConnect/connection';
import Customer from '@/database/schema/customer';
import ServiceProvider from '@/database/schema/serviceProvider';
import { getJson, setJson } from '@/lib/redis';

interface jwtPayload {
    userId: string;
    iat: number;
    exp: number;
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const accessToken = request.cookies.get('accessToken')?.value;

        if (!accessToken) {
            return NextResponse.json(
                { message: 'Unauthorized - No token provided' },
                { status: 401 }
            );
        }

        try {
            const decoded = verifyAccessToken(accessToken) as jwtPayload;
            const userId: any = decoded.userId;

            // Try cache first (20s TTL policy)
            const cacheKey = `user:${userId}`;
            try {
                const cached = await getJson<{ user: any; userType: 'customer' | 'serviceprovider' }>(cacheKey);
                if (cached) {
                    return NextResponse.json(cached, { status: 200 });
                }
            } catch (e) {
                console.error('Redis read error:', e);
            }

            // Fallback to DB
            let user = await Customer.findById(userId).select('-password -refreshToken');
            let userType: 'customer' | 'serviceprovider' = 'customer';

            if (!user) {
                user = await ServiceProvider.findById(userId).select('-password -refreshToken');
                userType = 'serviceprovider';
            }

            if (!user) {
                return NextResponse.json(
                    { message: 'User not found' },
                    { status: 404 }
                );
            }

            const payload = { user, userType };

            // Store in cache for 20 seconds
            try {
                await setJson(cacheKey, payload, 20);
            } catch (e) {
                console.error('Redis write error:', e);
            }

            return NextResponse.json(payload, { status: 200 });

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