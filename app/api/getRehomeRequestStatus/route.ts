import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("requestId");
        if (!id) {
            return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
        }

        // Verify the rehome request exists
        const rehomeRequest = await prisma.rehomeRequests.findUnique({
            where: { id: id },
            select: {
                status: true,
              },
        });

        return NextResponse.json(
            { message: "Rehome request status", request: rehomeRequest },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error finding rehome request:", error);
        return NextResponse.json(
            { message: "Failed to find rehome request" },
            { status: 500 }
        );
    }
}