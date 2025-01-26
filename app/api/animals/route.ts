import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";

const addPetSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, { message: 'Pet name must be at least 2 characters long' })
        .max(50, { message: 'Pet name cannot exceed 50 characters' }),

    species: z
        .string()
        .trim()
        .min(3, { message: "Species of the animal must be atleast 3 characters long" }),

    description: z
        .string()
        .trim()
        .min(3, { message: "Species of the animal must be atleast 3 characters long" }),

})
export async function POST(req: NextRequest) {
    const body = await req.json();
    const validation = addPetSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.errors, { status: 400 });

    const newPet = await prisma.animals.create({
        data: { name: body.name, species: body.species, description: body.description }
    });

    return NextResponse.json(newPet, { status: 201 });
}