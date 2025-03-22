import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const petId = url.searchParams.get("id");

        if (!petId) {
            return NextResponse.json({ error: "Pet ID is required" }, { status: 400 });
        }

        const pet = await prisma.animals.findUniqueOrThrow({
            where: { id: petId },
            include: {
                shelter: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                location: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(pet);
    } catch (error) {
        console.error("Error fetching pet details:", error);
        if (error === "NotFoundError") {
            return NextResponse.json({ error: "Pet not found" }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
