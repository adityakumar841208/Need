import { NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect/connection';
import ServiceProvider from '@/database/schema/serviceProvider';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '@/utils/auth';

export async function POST(request: Request) {
    // Destructure the request body
    const { credentials, type } = await request.json();

    await dbConnect();

    if (type === 'service-provider') {
        try {
            // Check if email already exists
            const existingServiceProvider = await ServiceProvider.findOne({ email: credentials.email });
            if (existingServiceProvider) {
                return NextResponse.json(
                    { message: 'User already exists' }, 
                    { status: 400 }
                );
            }

            // Hash Password before storing
            const hashedPassword = await bcrypt.hash(credentials.password, 10);

            // Create new ServiceProvider
            const serviceProvider = await ServiceProvider.create({
                email: credentials.email,
                password: hashedPassword, // Store the hashed password
                auth: 'custom',
                role: 'serviceprovider',
            });

            // Generate Tokens
            const accessToken = generateAccessToken(serviceProvider._id.toString());
            const refreshToken = generateRefreshToken(serviceProvider._id.toString());

            // Save refresh token in DB
            serviceProvider.refreshToken = refreshToken;
            await serviceProvider.save();

            // Create the response with proper status and body
            const response = NextResponse.json(
                {
                    message: "Successfully Registered",
                    accessToken,
                    refreshToken,
                    user: {
                        id: serviceProvider._id,
                        email: serviceProvider.email
                    }
                },
                { status: 200 }
            );

            // Set access token cookie (short-lived)
            response.cookies.set({
                name: 'accessToken',
                value: accessToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 // 1 day in seconds
            });

            // Set refresh token cookie (long-lived)
            response.cookies.set({
                name: 'refreshToken',
                value: refreshToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 30 // 30 days in seconds
            });

            return response;

        } catch (error) {
            console.error("Registration Error:", error);
            return NextResponse.json(
                { message: 'Server Error' }, 
                { status: 500 }
            );
        }
    } else {
        return NextResponse.json(
            { message: 'Invalid User Type' }, 
            { status: 400 }
        );
    }
}
