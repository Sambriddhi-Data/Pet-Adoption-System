import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest) {
  try {
    console.log("Request URL:", req.nextUrl);  // Log the full URL to verify its structure



    // Query the database to fetch pets based on the shelterId
    const allPets = await prisma.animals.findMany();

    return NextResponse.json(allPets, { status: 200 });
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json({ error: "Failed to fetch pet details" }, { status: 500 });
  }
}
