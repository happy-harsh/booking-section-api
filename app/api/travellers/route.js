import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongoose";
import Traveller from "@/app/models/Traveller";
import User from "@/app/models/User";



export async function POST(req) {
    await dbConnect();
    const userId = req.headers.get("x-user-id");


    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, age, passport } = await req.json();
    if (!name || !age || !passport) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const newTraveller = new Traveller({ userId: userId, name, age, passport });
    await newTraveller.save();


    return NextResponse.json({ message: "Traveller added", travellers: user.travellers });
}
