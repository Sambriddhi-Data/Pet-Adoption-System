import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { formDataSchema } from "@/app/(frontend)/(users)/(shelter)/add-pet-form";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const validation = formDataSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.errors, { status: 400 });
        }

        const {
            basicDetails: { name, species, age, status, sex, dominantBreed, shelterId, size },
            healthDetails: { vaccinationStatus, neuteredStatus, dateDewormed, healthIssues, otherHealthIssues, notes },
            personalityDetails: { social, personalitySummary, houseTrained },
            petImages: {image}
        } = body;

        const newPet = await prisma.animals.create({
            data: {
                name,
                species,
                age,
                status,
                sex,
                size,
                dominantBreed,
                vaccinationStatus,
                neuteredStatus,
                dateDewormed,
                healthIssues,
                otherHealthIssues,
                notes,
                social,
                personalitySummary,
                houseTrained,
                image,
                shelter: {
                    connect: { userId: shelterId } 
                }
            }
        });

        return NextResponse.json(newPet, { status: 201 });
    } catch (error) {
        console.error("Error creating pet:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
