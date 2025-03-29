import prisma from '@/prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const validation = z.object({
    applicationId: z.string(),
    petId: z.string()
});

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { applicationId, petId } = validation.parse(body);

        // Verify the application exists
        const application = await prisma.adoptionRequests.findUnique({
            where: { id: applicationId }
        });

        if (!application) {
            return NextResponse.json(
                { message: "Adoption application not found" },
                { status: 404 }
            );
        }

        // Verify the pet exists
        const pet = await prisma.animals.findUnique({
            where: { id: petId }
        });

        if (!pet) {
            return NextResponse.json(
                { message: "Pet not found" },
                { status: 404 }
            );
        }

        // Verify the application is for this pet
        if (application.petId !== petId) {
            return NextResponse.json(
                { message: "This application is not for the specified pet" },
                { status: 400 }
            );
        }

        // Execute transaction
        const result = await prisma.$transaction([
            prisma.adoptionRequests.update({
                where: { id: applicationId },
                data: { status: 'approved' }
            }),
            prisma.adoptionRequests.updateMany({
                where: {
                    petId: petId,
                    id: { not: applicationId },
                    status: 'unprocessed' // Only reject unprocessed applications
                },
                data: { status: 'rejected' }
            }),
            prisma.animals.update({
                where: { id: petId },
                data: { status: 'adopted' }
            })
        ]);

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Invalid request data", errors: error.errors },
                { status: 400 }
            );
        }

        console.error('Error confirming adoption:', error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}