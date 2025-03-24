import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {

        const phoneNumber = request.nextUrl.searchParams.get("phn");

        if (!phoneNumber) {
            return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
          }
        const existingUser = await prisma.user.findUnique({
            where: { phoneNumber},
        });

        return NextResponse.json(existingUser);
    } catch (error) {
        console.error("Error fetching user details:", error);
        if (error === "NotFoundError") {
            return NextResponse.json({ error: "Error " }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
