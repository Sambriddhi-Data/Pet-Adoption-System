import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "3");
    const userId = searchParams.get("userId");

    // Validate userId
    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    try {
        // Find the shelter associated with the shelter manager
        const shelter = await prisma.shelter.findUnique({
            where: { userId : userId },
        });

        if (!shelter) {
            return NextResponse.json({ error: "Shelter not found" }, { status: 404 });
        }

        // Fetch adoption requests for pets in the shelter
        const adoptionRequests = await prisma.adoptionRequests.findMany({
            where: {
                animals: {
                    shelterId: shelter.userId,
                },
            },
            include: {
                animals: true, // Include pet details
                adoptionprofile: {
                    include: {
                        user: true, // Include user details
                    },
                },
            },
            skip: (page - 1) * limit,
            take: limit,
        });

        // Count total adoption requests for pagination
        const totalRequests = await prisma.adoptionRequests.count({
            where: {
                animals: {
                    shelterId: shelter.id,
                },
            },
        });

        return NextResponse.json({
            data: adoptionRequests,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalRequests / limit),
                totalRequests,
            },
        });
    } catch (error) {
        console.error("Error fetching adoption requests:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}