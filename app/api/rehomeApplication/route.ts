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
            name,
            phoneNumber,
            location,
            rehomeReason,
            keepDuration,
            isOver18,
            petName,
            shelterId,
            userId,
            image,
        } = body;
        const updatedData = await prisma.$transaction(async (prisma) => {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { name, phoneNumber, location }
            });
            const rehomePetApplication = await prisma.rehomeRequests.create({
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
            return { updatedUser, rehomePetApplication };
        });

        return NextResponse.json({
            message: "Pet rehome request submitted successfully!",
            user: updatedData.updatedUser,
            rehomePetApplication: updatedData.rehomePetApplication,
        }, { status: 200 });
    } catch (error) {
        console.error("Error submitting rehome pet request:", error);
        return NextResponse.json({ message: "An error occurred while submitting the request." }, { status: 500 });
    }
}