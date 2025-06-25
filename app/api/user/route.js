import { dbConnect } from "@/app/lib/mongoose";
import User from "@/app/models/User";


export async function GET() {
  try {
    await dbConnect()
    const users = await User.find({});

    return Response.json(users);
  } catch (error) {
    console.error("DB error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
