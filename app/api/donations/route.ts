import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        
        // Check if user is authenticated
        if (!userId) {
          return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
          );
        }
        const donations = await prisma.donation.findMany({
            where: {
                donatorId: userId
            },
            include: {
                shelter: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(donations);
    } catch (error) {
        console.error('Error fetching donations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}