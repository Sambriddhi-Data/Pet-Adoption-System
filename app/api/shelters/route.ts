import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";

// Define the schema for request validation
const verifySchema = z.object({
  userId: z.string(), // Ensure the userId is provided as a string
});

export async function PUT(req: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const data = verifySchema.parse(body);

    // Update the isVerified field in the user table
    const verifyShelter = await prisma.user.update({
      where: { id: data.userId }, // Match user by their ID
      data: { isVerifiedUser: true }, // Update the isVerified field to true
    });

    return NextResponse.json({
      success: true,
      message: "User verified successfully",
      user: verifyShelter,
    });
  } catch (error) {
    // Handle validation errors and Prisma errors
    return NextResponse.json(
      {
        success: false,
        message: error instanceof z.ZodError ? error.errors : "An error occurred",
      },
      { status: 400 }
    );
  }
}
