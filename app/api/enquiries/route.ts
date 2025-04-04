import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");
    const statuses = searchParams.getAll("status"); // get all status parameters if any

    // validate Id
    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    try {
        // build the query conditions
        const whereCondition: any = {
            userId: userId,
        };

        // add status filter if provided
        if (statuses && statuses.length > 0) {
            whereCondition.status = {
                in: statuses,
            };
        }

        const adoptionRequests = await prisma.adoptionRequests.findMany({
            where: {
                adoptionprofile: {
                        userId: userId, // include user details
                },
            },
            include: {
                animals: {
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
                    },
                },
            },
        });

        const rehomingRequests = await prisma.rehomeRequests.findMany({
            where: {
                userId: userId
            },
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
            },
        });

        return NextResponse.json({
            data:{ adoptionRequests,rehomingRequests},
        });
    } catch (error) {
        console.error("Error fetching adoption requests:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}