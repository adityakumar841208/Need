import { NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect/connection';
import ServiceProvider from '@/database/schema/serviceProvider';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '@/utils/auth';
import Customer from '@/database/schema/customer';

export async function POST(request: Request) {
    // Destructure the request body
    const { credentials, type } = await request.json();

    // Connect to database
    await dbConnect();

    if (type === 'customer') {
        try {
            // Find the service provider by email
            const customer = await Customer.findOne({ email: credentials.email });
            if (!customer) {
                return NextResponse.json({ message: 'Service provider not found', status: 404 });
            }

            // Compare the hashed password with the provided password
            const isPasswordValid = await bcrypt.compare(credentials.password, customer.password);
            if (!isPasswordValid) {
                return NextResponse.json({ message: 'Invalid password', status: 400 });
            }

            // Generate tokens
            const accessToken = generateAccessToken(customer._id.toString());
            const refreshToken = generateRefreshToken(customer._id.toString());

            // Save refresh token in DB (optional)
            customer.refreshToken = refreshToken;
            await customer.save();


            // // Return successful response with tokens
            // return
            // NextResponse.json({
            // message: 'Login successful',
            // accessToken,
            // refreshToken,
            // status: 200,
            // })

            const response = NextResponse.json({
                message: 'Login successful',
                accessToken,
                refreshToken,
                status: 200,
            });

            // ṣetting both access token and refresh token in the cookie
            response.cookies.set('accessToken', accessToken, {
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24, // 1 day
            });

            response.cookies.set('refreshToken', refreshToken, {

                httpOnly: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 15, // 15 days
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
