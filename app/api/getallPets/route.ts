import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const species = searchParams.get("species");
        const sex = searchParams.get("sex");
        const size = searchParams.get("size");
        const dominantBreed = searchParams.get("dominantBreed");

        const allPets = await prisma.animals.findMany();

        const filteredPets = allPets.filter((pet) => {
            const matchesSpecies = species ? pet.species === species : true;
            const matchesSex = sex ? pet.sex === sex : true;
            const matchesSize = size ? pet.size === size : true;
            const matchesBreed = dominantBreed ? pet.dominantBreed === dominantBreed : true;

            return matchesSpecies && matchesSex && matchesSize && matchesBreed;
        });

        return NextResponse.json(filteredPets, { status: 200 });
    } catch (error) {
        console.error("Error fetching pets:", error);
        return NextResponse.json(
            { error: "Failed to fetch pet details" },
            { status: 500 }
        );
    }
}