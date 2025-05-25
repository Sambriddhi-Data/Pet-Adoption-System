import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest) {
  try {
    console.log("Request URL:", req.nextUrl);  // Log the full URL to verify its structure
    const shelterId = req.nextUrl.searchParams.get("shelterId");
    const statusParams = req.nextUrl.searchParams.getAll("status"); // Get all status parameters

    if (!shelterId) {
      return NextResponse.json({ error: "Shelter ID is required" }, { status: 400 });
    }

    console.log("Shelter ID:", shelterId); // Log the shelterId to verify
    console.log("Status filters:", statusParams);

    const whereClause: any = { shelterId };
    
    if (statusParams && statusParams.length > 0) {
      whereClause.status = {
        in: statusParams
      };
    }

    // Query the database with the filters
    const pets = await prisma.animals.findMany({
      where: whereClause,
    });

    return NextResponse.json(pets, { status: 200 });
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json({ error: "Failed to fetch pet details" }, { status: 500 });
  }
}
