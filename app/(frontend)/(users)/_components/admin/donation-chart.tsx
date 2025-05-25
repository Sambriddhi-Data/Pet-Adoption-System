'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDonationsByShelter, TimeFrame, ShelterDonationData } from '@/actions/getDonationsByShelter';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function DonationChart() {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');
    const [data, setData] = useState<ShelterDonationData[]>([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const result = await getDonationsByShelter(timeFrame);
                setData(result);
            } catch (error) {
                console.error('Error fetching donation data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [timeFrame]);
    
    // Prepare chart data - aggregate by date across all shelters
    const chartData = data.length > 0 ? (() => {
        const dateMap: Record<string, any> = {};
        
        data.forEach((shelter, index) => {
            shelter.donations.forEach(donation => {
                if (!dateMap[donation.date]) {
                    dateMap[donation.date] = { date: donation.date };
                }
                dateMap[donation.date][shelter.shelterName] = donation.amount;
            });
        });
        
        return Object.values(dateMap).sort((a: any, b: any) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    })() : [];
    
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Donation Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center">
                        Loading...
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Donation Analytics by Shelter</CardTitle>
                    <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
                        <SelectTrigger className="w-32">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="day">Daily</SelectItem>
                            <SelectItem value="week">Weekly</SelectItem>
                            <SelectItem value="month">Monthly</SelectItem>
                            <SelectItem value="year">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`Rs. ${value}`, 'Amount']} />
                        <Legend />
                        {data.map((shelter, index) => (
                            <Bar 
                                key={shelter.shelterId}
                                dataKey={shelter.shelterName}
                                fill={COLORS[index % COLORS.length]}
                                name={shelter.shelterName}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}