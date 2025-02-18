import { NextResponse } from "next/server";
import dbConnect from "@/database/dbConnect/connection";
import Customer from "@/database/schema/customer";
import { generateAccessToken, verifyRefreshToken } from "@/utils/auth";

export async function POST(request: Request) {
    const { refreshToken } = await request.json();
    await dbConnect();

    if (!refreshToken) {
        return NextResponse.json({ message: "No refresh token provided", status: 401 });
    }

    try {
        // Verify Refresh Token
        const decoded: any = verifyRefreshToken(refreshToken);

        // Find user
        const customer = await Customer.findById(decoded.userId);
        if (!customer || customer.refreshToken !== refreshToken) {
            return NextResponse.json({ message: "Invalid refresh token", status: 403 });
        }

        // Generate new Access Token
        const newAccessToken = generateAccessToken(customer._id.toString());

        return NextResponse.json({
            accessToken: newAccessToken,
            status: 200,
        });

    } catch (error) {
        return NextResponse.json({ message: "Invalid Token", status: 403 });
    }
}
