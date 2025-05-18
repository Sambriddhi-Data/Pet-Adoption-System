"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Define a type for the data structure
interface UserStatsData {
  month: string;
  customer: number;
  shelter_manager: number;
}

export default function UserGrowthChart() {
  const [data, setData] = useState<UserStatsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/user-stats");
        
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("User stats data:", result); // Debug the received data
        setData(result);
      } catch (err) {
        console.error("Error fetching user stats:", err);
        setError("Failed to load user statistics");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <div>Loading user statistics...</div>;
  if (error) return <div>Error: {error}</div>;
  if (data.length === 0) return <div>No user data available</div>;

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}`, 'Count']} />
          <Legend />
          <Bar dataKey="customer" fill="#8884d8" name="Customers" />
          <Bar dataKey="shelter_manager" fill="#82ca9d" name="Shelter Managers" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
