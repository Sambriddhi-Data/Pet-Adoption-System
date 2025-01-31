import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";

const verifySchema = z.object({
  userId: z.string(), 
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = verifySchema.parse(body);

    const existingShelter = await prisma.shelter.findUnique({
      where: { userId: data.userId },
    });

    if (existingShelter) {
      return NextResponse.json({
        success: false,
        message: "Shelter already exists for this user.",
      });
    }

    // Add the user as a shelter
    const newShelter = await prisma.shelter.create({
      data: { userId: data.userId }, 
    });

    return NextResponse.json({
      success: true,
      message: "Shelter added successfully.",
      shelter: newShelter,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof z.ZodError ? error.errors : "An error occurred.",
      },
      { status: 400 }
    );
  }
}
