import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const shelterId = searchParams.get("shelterId");
    const statuses = searchParams.getAll("status"); 
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");
    // Validate Id
    if (!shelterId) {
        return NextResponse.json({ error: "shelterId is required" }, { status: 400 });
    }

    try {
        // Build the query conditions
        const whereCondition: any = {
            shelterId: shelterId,
        };

        // Add status filter if provided
        if (statuses && statuses.length > 0) {
            whereCondition.status = {
                in: statuses,
            };
        }

        const rehomingRequests = await prisma.rehomeRequests.findMany({
            where: whereCondition,
            include: {
                shelter: {
                    select: {
                        user: {
                            select: {
                                name: true,  
                                location: true, 
                                phoneNumber: true,
                                email: true,
                            },
                        },
                    },
                },
                user: true,
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc', 
            },
        });
        // Count total filtered requests
        const totalCount = await prisma.rehomeRequests.count({
            where: whereCondition,
        });

        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json({
            data: rehomingRequests,
            pagination: {
                totalCount,
                totalPages,
                currentPage: page,
            },
        });
    } catch (error) {
        console.error("Error fetching adoption requests:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}