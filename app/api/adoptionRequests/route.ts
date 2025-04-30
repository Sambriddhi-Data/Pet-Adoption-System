import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

enum AdoptionRequestStatus {
    unprocessed = "unprocessed",
    approved = "approved",
    rejected = "rejected",
}
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "3");
    const userId = searchParams.get("userId");
    const statusParam = searchParams.get("status");


    // Validate userId
    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    const validStatuses = ["unprocessed", "approved", "rejected"]; // Valid enum values
    const statuses = statusParam
        ? statusParam.split(",").filter((status) => validStatuses.includes(status))
        : undefined;


    try {
        // Find the shelter associated with the shelter manager
        const shelter = await prisma.shelter.findUnique({
            where: { userId: userId },
        });

        if (!shelter) {
            return NextResponse.json({ error: "Shelter not found" }, { status: 404 });
        }
        const whereFilter = {
            animals: {
                shelterId: shelter.userId,
            },
            ...(statuses && statuses.length > 0 ? { status: { in: statuses as AdoptionRequestStatus[] } } : {}),
        };

        // Count total records for pagination
        const totalCount = await prisma.adoptionRequests.count({ where: whereFilter });
        const totalPages = Math.max(1, Math.ceil(totalCount / limit)); // Ensure at least 1 page
        const skip = (page - 1) * limit;

        const adoptionRequests = await prisma.adoptionRequests.findMany({
            where: whereFilter,
            include: {
                animals: true, // Include pet details
                adoptionprofile: {
                    include: {
                        user: true, // Include user details
                    },
                },
            },
            skip,
            take: limit,
        });

        return NextResponse.json({
            data: adoptionRequests,
            pagination: {
                currentPage: page,
                totalPages,
                totalRequests: totalCount,
            },
        });
    } catch (error) {
        console.error("Error fetching adoption requests:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}