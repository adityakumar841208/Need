import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from "@/utils/auth";
import { JwtPayload } from "jsonwebtoken";

export function authMiddleware(handler: Function) {
    return async (req: NextRequest) => {
        console.log('Auth Middleware Triggered');
        // Check token in cookies first
        const accessToken = req.cookies.get("accessToken")?.value || req.headers.get("Authorization")?.split(" ")[1];
        
        // If no access token, check for refresh token
        if (!accessToken) {
            const refreshToken = req.cookies.get("refreshToken")?.value;
            if (!refreshToken) {
                return NextResponse.redirect(new URL("/login", req.url));
            }
            
            try {
                // Verify refresh token and generate new access token
                const refreshDecoded = verifyRefreshToken(refreshToken) as JwtPayload;
                const newAccessToken = generateAccessToken(refreshDecoded?.userId);
                
                // Create response to continue with handler
                const response = await handler(req);
                
                // Set new access token in cookies
                response.cookies.set("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 15 * 60 // 15 minutes
                });
                
                return response;
            } catch (error) {
                // Refresh token invalid
                return NextResponse.redirect(new URL("/login", req.url));
            }
        }

        // Access token exists, try to verify it
        try {
            const decoded = verifyAccessToken(accessToken);
            (req as any).user = decoded; // Attach user to request
            return handler(req);    
        } catch (error) {
            // Access token invalid/expired, try refresh token
            const refreshToken = req.cookies.get("refreshToken")?.value;
            if (!refreshToken) {
                return NextResponse.redirect(new URL("/login", req.url));
            }
            
            try {
                // Verify refresh token and generate new access token
                const refreshDecoded = verifyRefreshToken(refreshToken) as JwtPayload;
                const newAccessToken = generateAccessToken(refreshDecoded?.userId)
                
                // Set user on request with new token data
                const decoded = verifyAccessToken(newAccessToken);
                (req as any).user = decoded;
                
                // Create response by calling handler
                const response = await handler(req);
                
                // Set new access token in cookies
                response.cookies.set("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                    maxAge: 15 * 60 // 15 minutes
                });
                
                return response;
            } catch (refreshError) {
                // Refresh token invalid
                return NextResponse.redirect(new URL("/login", req.url));
            }
        }
    };
}
