"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function UserGrowthChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/user-stats");
      const result = await response.json();
      setData(result);
    }
    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="customer" fill="#8884d8" name="Customers" />
        <Bar dataKey="shelter_manager" fill="#82ca9d" name="Shelter Managers" />
      </BarChart>
    </ResponsiveContainer>
  );
}
