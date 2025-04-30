import { decrypt } from "@/lib/encryption";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const shelterId = req.nextUrl.searchParams.get("shelterId");

    if (!shelterId) {
      return NextResponse.json({ error: "Shelter ID is required" }, { status: 400 });
    }

    const shelter = await prisma.shelter.findUnique({
      where: { userId: shelterId },
      select: { khaltiSecret: true }
    });

    if (!shelter?.khaltiSecret) {
      return NextResponse.json({ maskedSecret: null }, { status: 200 });
    }

    // Decrypt and mask the secret
    const decryptedSecret = decrypt(shelter.khaltiSecret);
    const visibleChars = 4; // Show last 4 characters
    const maskedSecret = 
      '*'.repeat(Math.max(0, decryptedSecret.length - visibleChars)) + 
      decryptedSecret.slice(-visibleChars);

    return NextResponse.json({ maskedSecret }, { status: 200 });
  } catch (error) {
    console.error("Error fetching masked Khalti secret:", error);
    return NextResponse.json({ error: "Failed to fetch masked secret" }, { status: 500 });
  }
}