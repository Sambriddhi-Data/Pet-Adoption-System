'use server';
import prisma from "@/prisma/client";
import { startOfDay, subDays, subMonths, subWeeks } from "date-fns";

export type TimeFrame = "day" | "week" | "month" | "year";
export type ShelterDonationData = {
    shelterId: string;
    shelterName: string;
    totalAmount: number;
    totalCount: number;
    donations: {
        date: string;
        amount: number;
        count: number;
    }[];
};

export async function getDonationsByShelter(
    timeFrame: TimeFrame,
    limit: number = 30
): Promise<ShelterDonationData[]> {
    let startDate: Date;
    const now = new Date();
    
    // Determine the start date based on timeFrame
    switch (timeFrame) {
        case "day":
            startDate = subDays(startOfDay(now), limit);
            break;
        case "week":
            startDate = subWeeks(startOfDay(now), limit / 7);
            break;
        case "month":
            startDate = subMonths(startOfDay(now), limit / 30);
            break;
        case "year":
            startDate = subMonths(startOfDay(now), 12);
            break;
    }
    
    // Fetch donations with shelter information
    const donations = await prisma.donation.findMany({
        where: {
            createdAt: {
                gte: startDate,
            },
            payment_status: "paid"
        },
        include: {
            shelter: {
                include: {
                    user: true
                }
            }
        },
        orderBy: {
            createdAt: "asc"
        }
    });
    
    // Group by shelter
    const shelterMap: Record<string, ShelterDonationData> = {};
    
    donations.forEach(donation => {
        const shelterId = donation.shelterId;
        const shelterName = donation.shelter.user.name;
        
        if (!shelterMap[shelterId]) {
            shelterMap[shelterId] = {
                shelterId,
                shelterName,
                totalAmount: 0,
                totalCount: 0,
                donations: []
            };
        }
        
        shelterMap[shelterId].totalAmount += donation.amount;
        shelterMap[shelterId].totalCount += 1;
        
        // Group donations by date for chart data
        let dateKey: string;
        const date = new Date(donation.createdAt);
        
        switch (timeFrame) {
            case "day":
                dateKey = date.toISOString().split('T')[0];
                break;
            case "week":
                const dayOfWeek = date.getDay();
                const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                const startOfWeek = new Date(date.setDate(diff));
                dateKey = startOfWeek.toISOString().split('T')[0];
                break;
            case "month":
                dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            case "year":
                dateKey = date.getFullYear().toString();
                break;
        }
        
        const existingDonation = shelterMap[shelterId].donations.find(d => d.date === dateKey);
        if (existingDonation) {
            existingDonation.amount += donation.amount;
            existingDonation.count += 1;
        } else {
            shelterMap[shelterId].donations.push({
                date: dateKey,
                amount: donation.amount,
                count: 1
            });
        }
    });
    
    return Object.values(shelterMap).sort((a, b) => b.totalAmount - a.totalAmount);
}