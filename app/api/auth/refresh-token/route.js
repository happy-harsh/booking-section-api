import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/app/lib/jwt";

export async function POST(req) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json({ message: "Refresh token missing" }, { status: 400 });
    }

    const payload = await verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json({ message: "Invalid or expired refresh token" }, { status: 401 });
    }

    const newAccessToken = await signAccessToken({ userId: payload.userId, email: payload.email });
    const newRefreshToken = await signRefreshToken({ userId: payload.userId, email: payload.email });

    return NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, 
    }, { status: 200 });
  } catch (error) {
    console.error("Error in refresh-token endpoint:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
