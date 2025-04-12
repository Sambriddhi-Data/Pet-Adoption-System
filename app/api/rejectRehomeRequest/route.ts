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
            include: {
                shelter: {
                    include: {
                        user: true
                    }
                },
                user: true,
            }
        });

        if (!rehomeRequest) {
            return NextResponse.json(
                { message: "Rehome request not found" },
                { status: 404 }
            );
        }

        // Update the rehome request status to "rejected"
        const updatedRequest = await prisma.rehomeRequests.update({
            where: { id: id },
            data: { status: "rejected" },
        });

        // 1. Send approval email to the successful applicant
        const rejectededApplicantData = {
            applicantName: rehomeRequest.user.name,
            applicantEmail: rehomeRequest.user.email,
            petName: rehomeRequest.petName,
            requestId: rehomeRequest.id,
            userId: rehomeRequest.user.id,
            shelterName: rehomeRequest.shelter.user.name,
            shelterPhoneNumber: rehomeRequest.shelter.user.phoneNumber || "Contact the shelter through the platform"
        };
        console.log('rejectededApplicantData', rejectededApplicantData);

        // Send approval email
        await fetch('http://localhost:3000/api/rehomeRejectedEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rejectededApplicantData)
        });

        return NextResponse.json(
            { message: "Rehome request rejected", request: updatedRequest },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error rejecting rehome request:", error);
        return NextResponse.json(
            { message: "Failed to reject rehome request" },
            { status: 500 }
        );
    }
}
