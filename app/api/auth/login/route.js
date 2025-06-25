import { signAccessToken, signRefreshToken } from "@/app/lib/jwt";
import { dbConnect } from "@/app/lib/mongoose";
import User from "@/app/models/User";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Email and password are required" }), {
        status: 400,
      });
    }
    await dbConnect();
    
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return new Response(JSON.stringify({ message: "Invalid email or password" }), {
        status: 401,
      });
    }

    const payload = { userId: user._id.toString(), email: user.email };
    const accessToken = await signAccessToken(payload);
    const refreshToken = await signRefreshToken(payload);

    return new Response(JSON.stringify({ accessToken, refreshToken }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Server error", error }), {
      status: 500,
    });
  }
}
