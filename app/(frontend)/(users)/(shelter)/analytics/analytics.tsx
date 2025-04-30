'use client';

import { useState, useEffect } from 'react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { getDonationsByTimePeriod, TimeFrame, DonationDataPoint } from '@/actions/getDonationsByTimePeriod';

interface AnalyticsDashboardProps {
    userId: string;
}

export default function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('month');
    const [donationData, setDonationData] = useState<DonationDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalDonationAmount, setTotalDonationAmount] = useState(0);
    const [averageDonationAmount, setAverageDonationAmount] = useState(0);
    
    useEffect(() => {
        async function fetchDonationData() {
            setIsLoading(true);
            try {
                const data = await getDonationsByTimePeriod(userId, timeFrame);
                setDonationData(data);
                
                // Calculate total and average
                let total = 0;
                data.forEach(item => total += item.amount);
                setTotalDonationAmount(total);
                setAverageDonationAmount(total / data.length || 0);
            } catch (error) {
                console.error("Failed to fetch donation data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchDonationData();
    }, [userId, timeFrame]);
    
    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Donation Analytics</h2>
                    <div className="flex space-x-2">
                        <TimeFrameSelector 
                            currentTimeFrame={timeFrame} 
                            onTimeFrameChange={setTimeFrame} 
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <MetricCard 
                        title="Total Donations" 
                        value={`NPR ${totalDonationAmount.toLocaleString()}`} 
                        subtext="Total amount received" 
                    />
                    <MetricCard 
                        title="Average Donation" 
                        value={`NPR ${averageDonationAmount.toLocaleString()}`} 
                        subtext="Average per period" 
                    />
                    <MetricCard 
                        title="Donation Count" 
                        value={donationData.reduce((acc, item) => acc + item.count, 0)} 
                        subtext="Number of donations" 
                    />
                </div>
                
                {isLoading ? (
                    <div className="h-80 flex items-center justify-center">
                        <p>Loading donation data...</p>
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-medium mb-4">Donation Amount Over Time</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={donationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`NPR ${value}`, 'Amount']} />
                                <Legend />
                                <Area type="monotone" dataKey="amount" name="Donation Amount" fill="#8884d8" stroke="#8884d8" />
                            </AreaChart>
                        </ResponsiveContainer>
                        
                        <h3 className="text-lg font-medium mb-4 mt-8">Number of Donations</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={donationData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" name="Number of Donations" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                )}
            </div>
        </div>
    );
}

interface MetricCardProps {
    title: string;
    value: string | number;
    subtext: string;
}

function MetricCard({ title, value, subtext }: MetricCardProps) {
    return (
        <div className="bg-gray-50 p-4 rounded-md border">
            <h3 className="text-sm text-gray-500">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-gray-400">{subtext}</p>
        </div>
    );
}

interface TimeFrameSelectorProps {
    currentTimeFrame: TimeFrame;
    onTimeFrameChange: (timeFrame: TimeFrame) => void;
}

function TimeFrameSelector({ currentTimeFrame, onTimeFrameChange }: TimeFrameSelectorProps) {
    const options: { label: string; value: TimeFrame }[] = [
        { label: 'Daily', value: 'day' },
        { label: 'Weekly', value: 'week' },
        { label: 'Monthly', value: 'month' },
        { label: 'Yearly', value: 'year' },
    ];
    
    return (
        <div className="flex items-center space-x-2 bg-gray-100 rounded-md p-1">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onTimeFrameChange(option.value)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        currentTimeFrame === option.value
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-200'
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}
