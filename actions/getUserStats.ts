import prisma from "@/prisma/client";

type UserStatsRow = {
    month: string;
    customer: number;
    shelter_manager: number;
  };
  
  export async function getUserStats(): Promise<UserStatsRow[]> {
    const users = await prisma.user.groupBy({
      by: ["createdAt", "user_role"],
      _count: { id: true },
      orderBy: { createdAt: "asc" },
    });
  
    const grouped: Record<string, UserStatsRow> = {};
  
    for (const user of users) {
      const month = new Date(user.createdAt).toLocaleString("default", {
        year: "numeric",
        month: "long",
      });
  
      if (!grouped[month]) {
        grouped[month] = {
          month,
          customer: 0,
          shelter_manager: 0,
        };
      }
  
      if (user.user_role === "customer" || user.user_role === "shelter_manager") {
        grouped[month][user.user_role] = user._count.id;
      }
    }
  
    return Object.values(grouped);
  }
  