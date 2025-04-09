import { shelterInformationSchema } from "@/app/(frontend)/(users)/(shelter)/shelter-information";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const validation = shelterInformationSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(validation.error.errors, { status: 400 });
        }

        const { userId, name, phoneNumber, location, image, shelterDesc } = body;

        // Check if the shelter exists
        const existingProfile = await prisma.shelter.findUnique({ where: { userId } });

        if (!existingProfile) {
            return NextResponse.json({ error: "Shelter profile not found" }, { status: 404 });
        }

        // Use a transaction to update both user and shelter profile
        const updatedData = await prisma.$transaction(async (prisma) => {
            // Update user details
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { name, phoneNumber, location, image },
            });

            // Update shelter profile
            const updatedProfile = await prisma.shelter.update({
                where: { userId },
                data: { shelterDesc }, 
            });

            return { updatedUser, updatedProfile };
        });

        return NextResponse.json({
            message: "Shelter profile updated successfully!",
            user: updatedData.updatedUser,
            profile: updatedData.updatedProfile
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating shelter profile:", error);
        return NextResponse.json({ message: "An error occurred while updating the shelter profile." }, { status: 500 });
    }
}