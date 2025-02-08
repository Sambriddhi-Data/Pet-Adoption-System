import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Fetch users from the database
    const users = await prisma.user.findMany();

    // If users are found, return the list
    return NextResponse.json({ data: users });

  } catch (ex) {
    console.error(ex); // log the error for debugging purposes
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
