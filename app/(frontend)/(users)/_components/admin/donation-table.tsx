'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getDonationsByShelter, TimeFrame, ShelterDonationData } from '@/actions/getDonationsByShelter';

export default function DonationTable() {
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
    
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Donation Summary by Shelter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center">
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
                    <CardTitle>Donation Summary by Shelter</CardTitle>
                    
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Shelter Name</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Total Donations</TableHead>
                            <TableHead>Average Donation</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">
                                    No donation data available for the selected time period
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((shelter) => (
                                <TableRow key={shelter.shelterId}>
                                    <TableCell className="font-medium">{shelter.shelterName}</TableCell>
                                    <TableCell>Rs. {shelter.totalAmount.toLocaleString()}</TableCell>
                                    <TableCell>{shelter.totalCount}</TableCell>
                                    <TableCell>
                                        Rs. {shelter.totalCount > 0 ? 
                                            Math.round(shelter.totalAmount / shelter.totalCount).toLocaleString() : 
                                            0
                                        }
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}