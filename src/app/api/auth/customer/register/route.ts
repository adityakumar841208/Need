import { NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect/connection';
import Customer from '@/database/schema/customer';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '@/utils/auth';

export async function POST(request: Request) {
    // Destructure the request body
    const { credentials, type } = await request.json();

    await dbConnect();

    if (type === 'customer') {
        try {
            // Check if email already exists
            const existingCustomer = await Customer.findOne({ email: credentials.email });
            if (existingCustomer) {
                return NextResponse.json(
                    { message: 'User already exists' }, 
                    { status: 400 }
                );
            }

            // Hash Password before storing
            const hashedPassword = await bcrypt.hash(credentials.password, 10);

            // Create new Customer
            const customer = await Customer.create({
                email: credentials.email,
                password: hashedPassword,
                auth: 'custom',
                role: 'customer'
            });

            // Generate Tokens
            const accessToken = generateAccessToken(customer._id.toString());
            const refreshToken = generateRefreshToken(customer._id.toString());

            // Save refresh token in DB
            customer.refreshToken = refreshToken;
            await customer.save();

            // Create the response with proper headers for cookies
            const response = NextResponse.json(
                {
                    message: "Successfully Registered",
                    accessToken,
                    refreshToken,
                    user: {
                        id: customer._id,
                        email: customer.email
                    }
                },
                { status: 200 }
            );

            // Set cookies properly
            // Access token cookie (short-lived)
            response.cookies.set({
                name: 'accessToken',
                value: accessToken,
                httpOnly: true,
                // Secure should be true in production, false in development
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 // 1 day in seconds
            });

            // Refresh token cookie (long-lived)
            response.cookies.set({
                name: 'refreshToken',
                value: refreshToken, // Use the actual refresh token, not 'hello'
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 * 30 // 30 days in seconds
            });

            console.log('Access Token:', accessToken);
            console.log('Refresh Token:', refreshToken);

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