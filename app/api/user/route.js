import { dbConnect } from "@/app/lib/mongoose";
import Order from "@/app/models/Order";
import Traveller from "@/app/models/Traveller";
import User from "@/app/models/User";
import { NextResponse } from "next/server";





export async function GET(req) {
  await dbConnect();

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId).select("-password");
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }


  const bookings = await Order.find({ userId })
    .populate("travellers")
    .sort({ createdAt: -1 });


  const travellers = await Traveller.find({ userId });

  return NextResponse.json({
    user,
    bookings,
    travellers,
  });
}

export async function PUT(req) {
  await dbConnect();

  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (name) user.name = name;
    await user.save();

    return NextResponse.json(user); 
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}