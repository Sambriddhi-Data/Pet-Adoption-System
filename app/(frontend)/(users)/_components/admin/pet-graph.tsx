"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AnimalLineChart() {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const res = await fetch(`/api/animal-stats?year=${year}&month=${month}`);
        const result = await res.json();
        setData(result);
    };

    useEffect(() => {
        fetchData();
    }, [month, year]);

    const prevMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear((y) => y - 1);
        } else {
            setMonth((m) => m - 1);
        }
    };

    const nextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear((y) => y + 1);
        } else {
            setMonth((m) => m + 1);
        }
    };

    const monthName = new Date(year, month - 1).toLocaleString("default", { month: "long" });

    return (
        <div className="w-full ">
            <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="px-4 py-2 bg-gray-200 rounded">&larr;</button>
                <h2 className="text-xl font-semibold">{monthName} {year}</h2>
                <button onClick={nextMonth} className="px-4 py-2 bg-gray-200 rounded">&rarr;</button>
            </div>
            <figure>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="date"
                            tickFormatter={(dateStr) => new Date(dateStr).getDate().toString()}
                            label={{ value: "Day", position: "insideBottomRight", offset: -5 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />

                    </LineChart>
                </ResponsiveContainer>
                <figcaption className="text-center mt-2 text-gray-500">
                    Figure: Daily animal registrations for {monthName} {year}
                </figcaption>
            </figure>
        </div>
    );
}
