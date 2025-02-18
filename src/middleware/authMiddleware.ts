// import { NextRequest, NextResponse } from "next/server";
// import { verifyAccessToken } from "@/utils/auth";

// export function authMiddleware(handler: Function) {
//     return async (req: NextRequest) => {
//         // Check token in cookies first
//         const token = req.cookies.get("access_token")?.value || req.headers.get("Authorization")?.split(" ")[1];

//         if (!token) {
//             return NextResponse.redirect(new URL("/login", req.url));
//         }

//         try {
//             const decoded: any = verifyAccessToken(token);
//             (req as any).user = decoded; // Attach user to request
//             return handler(req);
//         } catch (error) {
//             return NextResponse.redirect(new URL("/login", req.url));
//         }
//     };
// }
