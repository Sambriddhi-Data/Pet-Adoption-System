import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import z from "zod";

export async function getpetcount(status:"available"|"adopted", userId: string) {
  try {
    const count = await prisma.animals.count({
      where:{
      status, 
      shelterId: userId,
      }
    });

    return { success: true, count };
  } catch (error) {
    console.error(error);
    return { success: false, count: 0 };
  }
}
