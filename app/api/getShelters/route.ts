import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest) {
  try {

    const shelter = await prisma.shelter.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            location: true,
            phoneNumber:true 
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
