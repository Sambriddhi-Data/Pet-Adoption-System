import { NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    try {
        const adoptionProfile = await prisma.adoptionProfile.findUnique({
            where: { userId },
        });

        return NextResponse.json({ adoptionProfile });
    } catch (error) {
        console.error("Error fetching adoption profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}