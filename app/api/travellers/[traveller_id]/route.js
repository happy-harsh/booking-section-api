import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongoose";
import Traveller from "@/app/models/Traveller";

export async function PUT(req, { params }) {
  await dbConnect();

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { traveller_id } = params;
  const { name, age, passport } = await req.json();

  const updatedTraveller = await Traveller.findOneAndUpdate(
    { _id: traveller_id, userId },              
    { name, age, passport },                    
    { new: true, runValidators: true }          
  );

  if (!updatedTraveller) {
    return NextResponse.json({ message: "Traveller not found or unauthorized" }, { status: 404 });
  }

  return NextResponse.json({ message: "Traveller updated", traveller: updatedTraveller });
}

export async function DELETE(req, { params }) {
  await dbConnect();

  const userId = req.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { traveller_id } = params;

  const traveller = await Traveller.findOneAndDelete({ _id: traveller_id, userId });
  if (!traveller) {
    return NextResponse.json({ message: "Traveller not found or not authorized" }, { status: 404 });
  }

  return NextResponse.json({ message: "Traveller deleted", traveller });
}
