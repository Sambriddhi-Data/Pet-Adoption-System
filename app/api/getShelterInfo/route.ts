import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const shelterId = req.nextUrl.searchParams.get("shelterId");

    if (!shelterId) {
      return NextResponse.json({ error: "Shelter ID is required" }, { status: 400 });
    }

    console.log("Shelter ID:", shelterId);

    const shelter = await prisma.shelter.findUnique({
      where: {
        userId:shelterId,
      },
      include: {
        user: {
          select: {
            name: true,
            location: true,
            phoneNumber: true, 
          },
        },
      },
    });

    return NextResponse.json(shelter, { status: 200 });
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json({ error: "Failed to fetch pet details" }, { status: 500 });
  }
}
