import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const petId = searchParams.get("petId");
    const statuses = searchParams.getAll("status"); // Get all status parameters if any

    // Validate Id
    if (!petId) {
        return NextResponse.json({ error: "petId is required" }, { status: 400 });
    }

    try {
        // Build the query conditions
        const whereCondition: any = {
            petId: petId,
        };

        // Add status filter if provided
        if (statuses && statuses.length > 0) {
            whereCondition.status = {
                in: statuses,
            };
        }

        const adoptionRequests = await prisma.adoptionRequests.findMany({
            where: whereCondition,
            include: {
                animals: true, // Include pet details
                adoptionprofile: {
                    include: {
                        user: true, // Include user details
                    },
                },
            },
        });

        return NextResponse.json({
            data: adoptionRequests,
        });
    } catch (error) {
        console.error("Error fetching adoption requests:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}