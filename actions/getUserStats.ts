import prisma from "@/prisma/client";

/**
 * Type definition for the statistics data returned by the function
 * Represents user counts by role for each month
 */
type UserStatsRow = {
    month: string;
    customer: number;
    shelter_manager: number;
  };
  
  /**
   * Retrieves user statistics grouped by month and role
   * @returns Promise containing an array of monthly user statistics
   */
  export async function getUserStats(): Promise<UserStatsRow[]> {
    // Query the database to group users by creation date and role
    // Count the number of users in each group
    const users = await prisma.user.groupBy({
      by: ["createdAt", "user_role"],
      _count: { id: true },
      orderBy: { createdAt: "asc" },
    });
  
    // Object to store data grouped by month
    const grouped: Record<string, UserStatsRow> = {};
  
    for (const user of users) {
      // Format the date to show month and year (e.g., "May 2023")
      const month = new Date(user.createdAt).toLocaleString("default", {
        year: "numeric",
        month: "long",
      });
  
      // Initialize the data structure for this month if it doesn't exist
      if (!grouped[month]) {
        grouped[month] = {
          month,
          customer: 0,
          shelter_manager: 0,
        };
      }
  
      // Assign the count to the appropriate user role
      // Bug: This is setting the count directly rather than adding to it
      // Should be: grouped[month][user.user_role] += user._count.id;
      if (user.user_role === "customer" || user.user_role === "shelter_manager") {
        grouped[month][user.user_role] += user._count.id;
      }
    }
  
    // Convert the object to an array and return
    return Object.values(grouped);
  }
