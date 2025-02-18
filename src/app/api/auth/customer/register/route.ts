import { NextResponse } from 'next/server';
import dbConnect from '@/database/dbConnect/connection';
import Customer from '@/database/schema/customer';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '@/utils/auth';

export async function POST(request: Request) {

    // Destructure the request body
    const { credentials, type } = await request.json();

    // console.log(data);
    await dbConnect();

    if (type === 'customer') {
        try {
            // Check if email already exists
            const existingCustomer = await Customer.findOne({ email: credentials.email });
            if (existingCustomer) {
                return NextResponse.json({ message: 'User already exists', status: 400 });
            }

            // Hash Password before storing
            const hashedPassword = await bcrypt.hash(credentials.password, 10);

            // Create new Customer
            const customer = await Customer.create({
                email: credentials.email,
                password: hashedPassword, // Store the hashed password
                auth: 'custom'
            });

            // Generate Tokens
            const accessToken = generateAccessToken(customer._id.toString());
            const refreshToken = generateRefreshToken(customer._id.toString());

            // Save refresh token in DB
            customer.refreshToken = refreshToken;
            await customer.save();

            return NextResponse.json({
                message: "Successfully Registered",
                accessToken,
                refreshToken,
            }, { status: 200 });

        } catch (error) {
            console.error("Registration Error:", error);
            return NextResponse.json({ message: 'Server Error', status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'Invalid User Type', status: 400 });
    }
}
