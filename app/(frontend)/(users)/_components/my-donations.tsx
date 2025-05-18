'use client'

import { useEffect, useState } from "react";
import { useSession } from "@/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyDonations() {
    const [donations, setDonations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        async function fetchDonations() {
            if (!session?.user?.id) return;
            
            try {
                const response = await fetch(`/api/donations?userId=${session.user.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch donations');
                }
                const data = await response.json();
                setDonations(data);
            } catch (error) {
                console.error('Error fetching donations:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchDonations();
    }, [session]);

    return (
        <>
            <main>
                <div className="flex flex-col items-center justify-center mb-10">
                    <h1 className="text-2xl font-bold">My Donations</h1>
                </div>
                
                {loading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : donations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-lg">No donations found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Shelter</th>
                                    <th scope="col" className="px-6 py-3">Amount (NPR)</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.map((donation) => (
                                    <tr key={donation.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4">{donation.shelter?.user?.name || "Unknown Shelter"}</td>
                                        <td className="px-6 py-4">{donation.amount}</td>
                                        <td className="px-6 py-4">{new Date(donation.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium 
                                                ${donation.payment_status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                                  donation.payment_status === 'Failed' ? 'bg-red-100 text-red-800' : 
                                                  'bg-yellow-100 text-yellow-800'}`}>
                                                {donation.payment_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </>
    );
}