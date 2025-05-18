import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";

export async function getPetCountByStatus(status:"adopted") {
  try {
    const count = await prisma.animals.count({
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
