import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";

export async function getClaimedPetCount(status:"claimed") {
  try {
    const count = await prisma.lostPets.count({
      where:{
      status, 
      }
    });

    return { success: true, count };
  } catch (error) {
    console.error(error);
    return { success: false, count: 0 };
  }
}
