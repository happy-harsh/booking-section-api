import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { dbConnect } from "@/app/lib/mongoose";
import Order from "@/app/models/Order";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(
  req,
  { params }
) {
  try {
    await dbConnect();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const booking = await Order.findOne({ _id: params.id, userId });
    if (!booking) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    const { origin, destination, last_travel_date, flights, hotel } = booking;

    const prompt = `Generate a friendly 2-sentence summary for this travel booking:
The user is traveling from ${origin} to ${destination} on ${new Date(last_travel_date).toDateString()}.
The booking ${flights ? "includes round-trip flights" : "does not include flights"} and ${hotel ? "includes hotel stay" : "does not include hotel stay"}.`;

    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Gemini summary error:", error);
    return NextResponse.json(
      {
        message: "Failed to generate summary",
        error: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}
