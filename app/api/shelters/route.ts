import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";
import { formSchema } from "@/app/(frontend)/(auth)/auth-schema";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const validation = formSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.errors, { status: 400 });

    const newPet = await prisma.shelter.create({
        data: { shelterName: body.name, location: body.species, userId: body.description }
    });

    return NextResponse.json(newPet, { status: 201 });
}