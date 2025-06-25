import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/User";
import { dbConnect } from "@/app/lib/mongoose";


export async function PUT(req, { params }) {
  await dbConnect();
  const userId = req.headers.get("x-user-id");


  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { traveller_id } = params;
  const { name, age, passport } = await req.json();

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  const traveller = user.travellers.id(traveller_id);
  if (!traveller) return NextResponse.json({ message: "Traveller not found" }, { status: 404 });

  if (name) traveller.name = name;
  if (age) traveller.age = age;
  if (passport) traveller.passport = passport;

  await user.save();

  return NextResponse.json({ message: "Traveller updated", travellers: user.travellers });
}


export async function DELETE(req, { params }) {
  await dbConnect();
  const userId = req.headers.get("x-user-id");


  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { traveller_id } = params;
  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  const index = user.travellers.findIndex(t => t._id.toString() === traveller_id);
  if (index === -1) return NextResponse.json({ message: "Traveller not found" }, { status: 404 });

  user.travellers.splice(index, 1);
  await user.save();

  return NextResponse.json({ message: "Traveller deleted", travellers: user.travellers });
}
