import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("requestId");
        if (!id) {
            return NextResponse.json({ error: "Request ID is required" }, { status: 400 });
        }

        // Verify the rehome request exists
        const rehomeRequest = await prisma.rehomeRequests.findUnique({
            where: { id: id },
            
        });

        if (!rehomeRequest) {
            return NextResponse.json(
                { message: "Rehome request not found" },
                { status: 404 }
            );
        }

        // Update the rehome request status to "accepted"
        const updatedRequest = await prisma.rehomeRequests.update({
            where: { id: id },
            data: { status: "approved" },
        });

        return NextResponse.json(
            { message: "Rehome request accepted", request: updatedRequest },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error accepting rehome request:", error);
        return NextResponse.json(
            { message: "Failed to accept rehome request" },
            { status: 500 }
        );
    }
}
