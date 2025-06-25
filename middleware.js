import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken } from "./app/lib/jwt";

export default async function middleware(req) {
  console.log("middleware working");

  // return NextResponse.next();

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ message: "Authorization header missing" }, { status: 401 });
  }

  // TO Check refresh token
  // const payloadRef = await verifyRefreshToken(token);
  // console.log("Refresh Decoded Payload:", payloadRef);

  const payload = await verifyAccessToken(token);
  console.log("Decoded Payload:", payload);

  if (!payload) {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", payload.userId);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  return response;
}

export const config = {
  matcher: ["/api/user/:path*", "/api/bookings/:path*", "/api/travellers/:path*"],
  // matcher: ["/api/user/:path*"],
};
