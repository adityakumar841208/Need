import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';

const encoder = new TextEncoder();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'ADITYA';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'ADITYA';

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error('Secrets are not defined in environment variables');
}

// Utility to verify tokens
async function verifyToken(token: string, secret: string) {
    return await jwtVerify(token, encoder.encode(secret));
}

// Utility to issue new access token
async function issueAccessToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h') // 24 hours
        .sign(encoder.encode(ACCESS_TOKEN_SECRET!));
}

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;

    try {
        if (!accessToken) throw new Error('No access token');
        await verifyToken(accessToken, ACCESS_TOKEN_SECRET!);
        return NextResponse.next(); // Valid access token
    } catch (err) {
        if (!refreshToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const { payload } = await verifyToken(refreshToken, REFRESH_TOKEN_SECRET!);

            // Issue new access token
            const newAccessToken = await issueAccessToken({
                userId: payload.userId,
                role: payload.role,
            });

            const response = NextResponse.next();
            response.cookies.set('accessToken', newAccessToken, ({
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                maxAge: 60 * 60 * 24 // 1 day in seconds
            }));

            return response;
        } catch (refreshErr) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/settings/:path*',
        '/home',
        '/api/me',
        '/api/fetchposts',
    ],
};
