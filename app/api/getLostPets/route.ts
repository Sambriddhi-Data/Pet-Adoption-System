import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const allPets = await prisma.lostPets.findMany({
      where: {
       OR: [
          { status: "lost" },
          { status: "found" }
        ]
      }
    });

    return NextResponse.json(allPets, { status: 200 });
  } catch (error) {
    console.error("Error fetching pets:", error);
    return NextResponse.json({ error: "Failed to fetch pet details" }, { status: 500 });
  }
}
