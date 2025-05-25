import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";

export async function getRehomedPetCountByStatus(status:"approved") {
  try {
    const count = await prisma.rehomeRequests.count({
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
