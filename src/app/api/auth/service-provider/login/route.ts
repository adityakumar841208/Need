import { NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect/connection';
import ServiceProvider from '@/database/schema/serviceProvider';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '@/utils/auth';

export async function POST(request: Request) {
    // Destructure the request body
    const { credentials, type } = await request.json();

    // Connect to database
    await dbConnect();

    if (type === 'service-provider') {
        try {
            // Find the service provider by email
            const serviceProvider = await ServiceProvider.findOne({ email: credentials.email });
            if (!serviceProvider) {
                return NextResponse.json({ message: 'Service provider not found', status: 404 });
            }

            // Compare the hashed password with the provided password
            const isPasswordValid = await bcrypt.compare(credentials.password, serviceProvider.password);
            if (!isPasswordValid) {
                return NextResponse.json({ message: 'Invalid password', status: 400 });
            }

            // Generate tokens
            const accessToken = generateAccessToken(serviceProvider._id.toString());
            const refreshToken = generateRefreshToken(serviceProvider._id.toString());

            // Save refresh token in DB (optional)
            serviceProvider.refreshToken = refreshToken;
            await serviceProvider.save();

            const response = NextResponse.json({
                message: "Successfully Login",
                accessToken,
                refreshToken,
                user: {
                    id: serviceProvider._id,
                    email: serviceProvider.email
                }
            },
            { status: 200 });

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
            console.error("Login Error:", error);
            return NextResponse.json({ message: 'Server Error', status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'Invalid User Type', status: 400 });
    }
}
