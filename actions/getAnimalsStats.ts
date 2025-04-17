import prisma from "@/prisma/client";

export async function getAnimalStatsByMonth(year: number, month: number) {
  const start = new Date(year, month - 1, 1); 
  const end = new Date(year, month, 0, 23, 59, 59);

  const animals = await prisma.animals.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });


  const dailyCounts: Record<string, number> = {};

  for (let day = 1; day <= end.getDate(); day++) {
    const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    dailyCounts[dateKey] = 0;
  }

  for (const animal of animals) {
    const date = animal.createdAt.toISOString().slice(0, 10);
    if (dailyCounts[date] !== undefined) {
      dailyCounts[date]++;
    }
  }

  return Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count,
  }));
}
