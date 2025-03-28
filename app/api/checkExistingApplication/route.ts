import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const petId = searchParams.get("petId");

    if (!userId || !petId) {
        return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }
    try {
        const existingApplication = await prisma.adoptionRequests.findFirst({
            where: {
                petId: petId as string,
                adoptionprofile: {
                    userId: userId as string
                }
            }
        });

        return NextResponse.json({ exists: !!existingApplication }, { status: 200 });
        
    } catch (error) {
        console.error('Error checking existing application:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}