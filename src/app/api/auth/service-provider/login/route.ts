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

            // Return successful response with tokens
            return NextResponse.json({
                message: 'Login successful',
                accessToken,
                refreshToken,
                status: 200,
            });
        } catch (error) {
            console.error("Login Error:", error);
            return NextResponse.json({ message: 'Server Error', status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'Invalid User Type', status: 400 });
    }
}
