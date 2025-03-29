import { applyToAdoptSchema } from '@/app/(frontend)/(users)/_components/forms/customer-form-schema';
import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

    const body = await req.json();
    const validation = applyToAdoptSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 });
    }
    const { message, userId } = body;
    const petId = req.nextUrl.searchParams.get("petId");

    // Validate petId
    if (!petId) {
        return NextResponse.json({ error: 'petId is required' }, { status: 400 });
    }

    try {
        const adoptionProfile = await prisma.adoptionProfile.findUnique({
            where: { userId },
        });

        if (!adoptionProfile) {
            return NextResponse.json({ error: 'Adoption profile not found' }, { status: 404 });
        }

        // Create the adoption request
        const adoptionRequest = await prisma.adoptionRequests.create({
            data: {
                petId: petId, 
                adoptionProfileId: adoptionProfile.id,
                message: message,
            },
        });

        return NextResponse.json(adoptionRequest, { status: 201 });
    } catch (error) {
        console.error('Error creating adoption request:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}