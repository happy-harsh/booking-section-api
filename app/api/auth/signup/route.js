import { dbConnect } from "@/app/lib/mongoose";
import User from "@/app/models/User";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: "All fields are required" }), {
        status: 400,
      });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
      });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    return new Response(JSON.stringify({ message: "User created successfully" }), {
      status: 201,
    });
  } catch (error) {
    console.error("User creation error:", error);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}
