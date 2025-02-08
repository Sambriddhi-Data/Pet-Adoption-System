import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";

export async function getPets(shelterId: string) {
  try {
    // Fetch all pets for the given shelter ID
    const pets = await prisma.animals.findMany({
      where: {
        shelterId: shelterId
      },
    });

    // Return the pet details with success status
    return { success: true, pets };
  } catch (error) {
    console.error(error);
    return { success: false, pets: [] };
  }
}
