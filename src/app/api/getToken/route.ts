import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import { NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const token = req.cookies.get('accessToken')?.value || req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return new Response('Token not found', { status: 401 });
    }

    try {
        // Fix the type assertion to match the property you're accessing
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ADITYA') as { userId: string };
        const userId = decoded.userId;

        return NextResponse.json({ userId, token }, { status: 200 });
    } catch (error) {
        console.error('Token verification error:', error);
        return new Response('Invalid token', { status: 401 });
    }
}