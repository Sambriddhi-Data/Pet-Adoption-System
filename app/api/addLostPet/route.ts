import { lostPetFormSchema } from "@/app/(frontend)/(users)/(customer)/lost-pet-form";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try{
        const body = await req.json();
        const petData = lostPetFormSchema.parse(body);

        const lostPet = await prisma.lostPets.create({
            data:{
                name: petData.name,
                phoneNumber: petData.phoneNumber,
                location: petData.location,
                description: petData.description,
                image: petData.image,
                status: petData.status
            }
        })
        return NextResponse.json(lostPet, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
          {
            success: false,
          },
          { status: 400 }
        );
    }

}