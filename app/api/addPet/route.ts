import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { addPetSchema } from "@/app/(frontend)/(users)/(shelter)/add-pet-form";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const validation = addPetSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.errors, { status: 400 });

    const newPet = await prisma.animals.create({
        data: { name: body.name, species: body.species, age:body.age , status:body.status, description: body.description, shelterId: body.shelterId }
    });

    return NextResponse.json(newPet, { status: 201 });
}