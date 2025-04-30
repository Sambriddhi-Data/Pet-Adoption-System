'use server';
import prisma from "@/prisma/client";
import { startOfDay, subDays, subMonths, subWeeks } from "date-fns";

export type TimeFrame = "day" | "week" | "month" | "year";
export type DonationDataPoint = {
    date: string;
    amount: number;
    count: number;
};

export async function getDonationsByTimePeriod(
    shelterId: string, 
    timeFrame: TimeFrame,
    limit: number = 30
): Promise<DonationDataPoint[]> {
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
    
    // Fetch donations after the start date
    const donations = await prisma.donation.findMany({
        where: {
            shelterId: shelterId,  // Using the renamed parameter
            createdAt: {
                gte: startDate,
            },
            // Based on your schema, payment_status is a String field
            // I'm using "paid" as that's what was in your original code
            payment_status: "paid"
        },
        orderBy: {
            createdAt: "asc"
        }
    });
    
    // Group and format data based on timeFrame
    const groupedData: Record<string, { amount: number, count: number }> = {};
    
    donations.forEach(donation => {
        let dateKey: string;
        const date = new Date(donation.createdAt);
        
        switch (timeFrame) {
            case "day":
                dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
                break;
            case "week":
                // Get the first day of the week
                const dayOfWeek = date.getDay();
                const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust for Sunday
                const startOfWeek = new Date(date.setDate(diff));
                dateKey = startOfWeek.toISOString().split('T')[0]; // Start of week as key
                break;
            case "month":
                dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                break;
            case "year":
                dateKey = date.getFullYear().toString();
                break;
        }
        
        if (!groupedData[dateKey]) {
            groupedData[dateKey] = { amount: 0, count: 0 };
        }
        
        groupedData[dateKey].amount += donation.amount;
        groupedData[dateKey].count += 1;
    });
    
    // Convert to array format for recharts
    const result: DonationDataPoint[] = Object.keys(groupedData).map(date => ({
        date,
        amount: groupedData[date].amount,
        count: groupedData[date].count
    }));
    
    return result;
}