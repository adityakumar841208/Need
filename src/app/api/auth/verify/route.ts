import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from "@/utils/auth";
import { JwtPayload } from "jsonwebtoken";

// Explicitly set the runtime to Node.js
export const runtime = 'nodejs'; 

export async function GET(request: NextRequest) {
  // Get the URL to extract search params
  const { searchParams } = new URL(request.url);
  const destination = searchParams.get('destination') || '/';
  // Get tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value || 
                      request.headers.get("Authorization")?.split(" ")[1];
  
  // If no access token, check for refresh token
  if (!accessToken) {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      // Verify refresh token and generate new access token
      const refreshDecoded = verifyRefreshToken(refreshToken) as JwtPayload;
      console.log(refreshDecoded, 'refreshDecoded from verify route');
      const userId = refreshDecoded.userId || refreshDecoded.sub;
      const newAccessToken = generateAccessToken(userId);
      
      // Create response to redirect to the destination
      const response = NextResponse.redirect(new URL(destination, request.url));
      
      // Set new access token in cookies
      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 // 15 minutes
      });
      
      return response;
    } catch (error) {
      console.log('Refresh token invalid', error);
      // Ensure environment variables are loaded correctly for JWT secrets
      console.log('JWT_SECRET used:', process.env.JWT_SECRET ? 'Loaded' : 'Missing'); 
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Access token exists, try to verify it
  try {
    const decoded = verifyAccessToken(accessToken);
    // Continue to the requested page
    return NextResponse.redirect(new URL(destination, request.url));
  } catch (error) {
    // Access token invalid/expired, try refresh token
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    try {
      // Verify refresh token and generate new access token
      const refreshDecoded = verifyRefreshToken(refreshToken) as JwtPayload;
      const userId = refreshDecoded.userId || refreshDecoded.sub;
      const newAccessToken = generateAccessToken(userId);
      
      // Create response to redirect to the destination
      const response = NextResponse.redirect(new URL(destination, request.url));
      
      // Set new access token in cookies
      response.cookies.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 // 15 minutes
      });
      
      return response;
    } catch (refreshError) {
      // Refresh token invalid
      console.log('Refresh token invalid on second attempt', refreshError);
      // Ensure environment variables are loaded correctly for JWT secrets
      console.log('JWT_SECRET used:', process.env.JWT_SECRET ? 'Loaded' : 'Missing');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}