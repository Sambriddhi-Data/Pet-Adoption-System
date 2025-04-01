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
            where: { id: applicationId },
            include: {
                animals: true,
                adoptionprofile: {
                    include: {
                        user: true,
                    },
                },
            }
        });

        if (!application) {
            return NextResponse.json(
                { message: "Adoption application not found" },
                { status: 404 }
            );
        }

        // Verify the pet exists and include shelter with its user data
        const pet = await prisma.animals.findUnique({
            where: { id: petId },
            include: {
                shelter: {
                    include: {
                        user: true  
                    }
                }
            }
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

        // Get all other applications for this pet that will be rejected
        const rejectedApplications = await prisma.adoptionRequests.findMany({
            where: {
                petId: petId,
                id: { not: applicationId },
                status: 'unprocessed' // Only reject unprocessed applications
            },
            include: {
                adoptionprofile: {
                    include: {
                        user: true
                    }
                }
            }
        });

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

        // Send email notifications
        // 1. Send approval email to the successful applicant
        const approvedApplicantData = {
            applicantName: application.adoptionprofile.user.name,
            applicantEmail: application.adoptionprofile.user.email,
            petName: pet.name,
            shelterName: pet.shelter.user.name, 
            shelterPhoneNumber: pet.shelter.user.phoneNumber || "Contact the shelter through the platform"
        };

        // Send approval email
        await fetch('http://localhost:3000/api/applicationApprovedEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(approvedApplicantData)
        });

        // 2. Send rejection emails to all other applicants
        for (const rejectedApp of rejectedApplications) {
            const rejectedApplicantData = {
                applicantName: rejectedApp.adoptionprofile.user.name,
                applicantEmail: rejectedApp.adoptionprofile.user.email,
                petName: pet.name,
                shelterName: pet.shelter.user.name  
            };
            
            // Send rejection email
            await fetch('http://localhost:3000/api/applicationRejectedEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rejectedApplicantData)
            });
        }

        return NextResponse.json({ 
            result, 
            emailsSent: {
                approved: 1,
                rejected: rejectedApplications.length
            }
        }, { status: 200 });

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