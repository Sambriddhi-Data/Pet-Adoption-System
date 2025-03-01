import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { formDataSchema } from "@/app/(frontend)/(users)/(shelter)/add-pet-form";

export async function PUT(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Pet ID is required" }, { status: 400 });
        }

        const updatedData = await req.json();
        const validation = formDataSchema.safeParse(updatedData);
        if (!validation.success) {
            return NextResponse.json(validation.error.errors, { status: 400 });
        }
        const {
            basicDetails: { name, species, description, age, status, sex, dominantBreed, arrivedAtShelter, shelterId, size },
            healthDetails: { vaccinationStatus, neuteredStatus, dateDewormed, healthIssues, otherHealthIssues, notes },
            personalityDetails: { social, personalitySummary, houseTrained }
        } = updatedData;

        const updatedPet = await prisma.animals.update({
            where: { id },
            data: {
                name,
                species,
                description,
                age,
                status,
                sex,
                dominantBreed,
                arrivedAtShelter,
                shelterId,
                size,
                vaccinationStatus,
                neuteredStatus,
                dateDewormed,
                healthIssues,
                otherHealthIssues,
                notes,
                social,
                personalitySummary,
                houseTrained
            }
        });

        return NextResponse.json(updatedPet, { status: 200 });
    } catch (error) {
        console.error("Error updating pet:", error);
        return NextResponse.json({ error: "Failed to update pet" }, { status: 500 });
    }
}
