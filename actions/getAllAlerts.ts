"use server";

import prisma from "@/prisma/client";
import { LostPets } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getAllLostPetAlerts(): Promise<LostPets[]> {
  try {
    const alerts = await prisma.lostPets.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return alerts;
  } catch (error) {
    console.error("Error fetching lost pet alerts:", error);
    return [];
  }
}

export async function updateLostPetStatus(
  id: string,
  status: string
): Promise<{ success: boolean; data?: LostPets; error?: string }> {
  try {
    const updatedAlert = await prisma.lostPets.update({
      where: { id },
      data: { status },
    });
    // Adjust the path if your admin alerts page is different
    revalidatePath("/(frontend)/(users)/(admin)/pet-alerts"); 
    return { success: true, data: updatedAlert };
  } catch (error) {
    console.error("Error updating lost pet status:", error);
    return { success: false, error: "Failed to update status." };
  }
}