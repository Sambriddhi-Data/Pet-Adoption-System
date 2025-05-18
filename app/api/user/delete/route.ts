import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Create a timestamp to make the email suffix unique
    const timestamp = Date.now();
    
    // Use a transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // 1. Get existing user data
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });
      
      if (!user) {
        throw new Error("User not found");
      }

      // 2. Update the user with modified unique fields
      await tx.user.update({
        where: { id: userId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          email: `${user.email.split('@')[0]}-deleted-${timestamp}@deleted.com`,
          phoneNumber: "9800000000", // Generic placeholder
          // name: "Deleted User",
          image: null,
        },
      });
    });

    return NextResponse.json({ 
      success: true, 
      message: "Account marked as deleted" 
    });
  } catch (error) {
    console.error("Error soft deleting user account:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}