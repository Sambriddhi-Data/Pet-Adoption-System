import { adopterProfileSchema, applyToAdoptSchema } from "@/app/(frontend)/(users)/_components/forms/customer-form-schema";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = adopterProfileSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(validation.error.errors, { status: 400 });
        }

        const {
            userId, name, email, phoneNumber, location, image, home_situation,
            outside_space, household_setting, household_typical_activity, min_age, age,
            flatmate, allergy, other_animals, other_animals_info, neuter_status,
            lifestyle, move_holiday, experience, agreement
        } = body;

        // Use a transaction to update both user and adoptionProfile
        const updatedData = await prisma.$transaction(async (prisma) => {
            // Update user details
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { name, email, phoneNumber, location }
            });

            // Check if adoptionProfile exists
            const existingProfile = await prisma.adoptionProfile.findUnique({
                where: { userId }
            });

            let updatedProfile;
            if (existingProfile) {
                // Update existing adoption profile
                updatedProfile = await prisma.adoptionProfile.update({
                    where: { userId },
                    data: {
                        image, home_situation, outside_space, household_setting,
                        household_typical_activity, min_age, age, flatmate, allergy,
                        other_animals, other_animals_info, neuter_status, lifestyle,
                        move_holiday, experience, agreement
                    }
                });
            } else {
                // Create new adoption profile
                updatedProfile = await prisma.adoptionProfile.create({
                    data: {
                        image, age, home_situation, outside_space, household_setting,
                        household_typical_activity, min_age, flatmate, allergy,
                        other_animals, other_animals_info, neuter_status, lifestyle,
                        move_holiday, experience, agreement,
                        user: { connect: { id: userId } }
                    }
                });
            }

            return { updatedUser, updatedProfile };
        });

        return NextResponse.json({
            message: "User and adoption profile updated successfully!",
            user: updatedData.updatedUser,
            profile: updatedData.updatedProfile
        }, { status: 200 });

    } catch (error) {
        console.error("Error updating user and adoption profile:", error);
        return NextResponse.json({ message: "An error occurred while updating the profile." }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("id");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const userWithAdoptionProfile = await prisma.user.findUnique({
            where: { id: userId },
            include: { adoptionProfile: true },
        });

        if (!userWithAdoptionProfile) {
            return NextResponse.json({ error: "Adoption profile not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: userWithAdoptionProfile.id,
            email: userWithAdoptionProfile.email,
            name: userWithAdoptionProfile.name,
            phoneNumber: userWithAdoptionProfile.phoneNumber,
            location: userWithAdoptionProfile.location,
            adoptionProfile: {
                id: userWithAdoptionProfile.adoptionProfile?.id,
                image: userWithAdoptionProfile.adoptionProfile?.image,
                home_situation: userWithAdoptionProfile.adoptionProfile?.home_situation,
                outside_space: userWithAdoptionProfile.adoptionProfile?.outside_space,
                household_setting: userWithAdoptionProfile.adoptionProfile?.household_setting,
                household_typical_activity: userWithAdoptionProfile.adoptionProfile?.household_typical_activity,
                min_age: userWithAdoptionProfile.adoptionProfile?.min_age,
                age: userWithAdoptionProfile.adoptionProfile?.age,
                flatmate: userWithAdoptionProfile.adoptionProfile?.flatmate,
                allergy: userWithAdoptionProfile.adoptionProfile?.allergy,
                other_animals: userWithAdoptionProfile.adoptionProfile?.other_animals,
                other_animals_info: userWithAdoptionProfile.adoptionProfile?.other_animals_info,
                neuter_status: userWithAdoptionProfile.adoptionProfile?.neuter_status,
                lifestyle: userWithAdoptionProfile.adoptionProfile?.lifestyle,
                move_holiday: userWithAdoptionProfile.adoptionProfile?.move_holiday,
                experience: userWithAdoptionProfile.adoptionProfile?.experience,
                agreement: userWithAdoptionProfile.adoptionProfile?.agreement,
            }
        });

    } catch (error) {
        console.error("Error fetching user and adoption profile:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
