import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { rehomePetSchema } from "@/app/(frontend)/(users)/_components/forms/customer-form-schema";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = rehomePetSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(validation.error.errors, { status: 400 });
        }

        const {
            species,
            isBonded,
            rehomeReason,
            keepDuration,
            isOver18,
            petName,
            shelterId,
            userId,
            image,
        } = body;

        const rehomePet = await prisma.rehomeRequests.create({
            data: {
                species,
                isBonded,
                rehomeReason,
                keepDuration,
                isOver18,
                petName,
                shelterId,
                image,
                userId, 
            },
        });

        return NextResponse.json({ message: "Pet rehome request submitted successfully!", rehomePet }, { status: 201 });
    } catch (error) {
        console.error("Error submitting rehome pet request:", error);
        return NextResponse.json({ message: "An error occurred while submitting the request." }, { status: 500 });
    }
}