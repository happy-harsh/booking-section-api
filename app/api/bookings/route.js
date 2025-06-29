
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongoose";
import Order from "@/app/models/Order";
import Traveller from "@/app/models/Traveller";

export async function GET(req) {
  await dbConnect();

  const userId = req.headers.get("x-user-id"); 
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  if (!["upcoming", "completed"].includes(status || "")) {
    return NextResponse.json({ message: "Invalid status" }, { status: 400 });
  }

  const today = new Date();

  const dateFilter =
    status === "upcoming"
      ? { $gte: today }
      : { $lt: today };

  const bookings = await Order.find({
    userId,
    last_travel_date: dateFilter,
  }).sort({ last_travel_date: 1 });

  return NextResponse.json({ bookings });
}



export async function POST(req) {
  await dbConnect();

  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { destination, origin, last_travel_date, flights, hotel, travellers } = body;

  if (!destination || !origin || !last_travel_date) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  const travelDate = new Date(last_travel_date);
  const now = new Date();
  const status = travelDate >= now ? "upcoming" : "completed";

  let travellerIds = [];

  if (travellers && Array.isArray(travellers)) {
    
    const createdTravellers = await Promise.all(
      travellers.map(async (traveller) => {
        const { name, age, passport } = traveller;


        const newTraveller = await Traveller.create({
          userId,
          name,
          age,
          passport,
        });

        return newTraveller._id;
      })
    );

    travellerIds = createdTravellers;
  }
  console.log(travellerIds)

  const newBooking = await Order.create({
    userId,
    status,
    destination,
    origin,
    last_travel_date: travelDate,
    flights: !!flights,
    hotel: !!hotel,
    travellers: travellerIds, 
  });

  console.log(newBooking)

  return NextResponse.json({ message: "Booking created", booking: newBooking }, { status: 201 });
}