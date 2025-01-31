import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";

const verifySchema = z.object({
  userId: z.string(), 
});

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const data = verifySchema.parse(body);

    const verifyShelter = await prisma.user.update({
      where: { id: data.userId }, 
      data: { isVerifiedUser: true }, 
    });

    return NextResponse.json({
      success: true,
      message: "Shelter verified successfully!",
      user: verifyShelter,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof z.ZodError ? error.errors : "An error occurred",
      },
      { status: 400 }
    );
  }
}
