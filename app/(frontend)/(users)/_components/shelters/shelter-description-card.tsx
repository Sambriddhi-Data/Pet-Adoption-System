'use client'

import { useSession } from "@/auth-client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ShelterInfo {
    shelterDesc?: string;
    user: {
        name: string;
        location?: string;
        image?: string;
        phoneNumber?: string;
        email?: string;
    };
}

export function ShelterInfoCard() {
    const{id} = useParams();
    const [shelterInfo, setShelterInfo] = useState<ShelterInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return; 

        const fetchShelterInfo = async () => {
            try {
                const response = await fetch(`/api/getShelterInfo?shelterId=${id}`);
                const data: ShelterInfo = await response.json();
                setShelterInfo(data);
            } catch (error) {
                console.error("Error fetching shelter info:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShelterInfo();
    }, [id]);

    return (
        <Card className="p-6 w-10/12 text-left">
            <div className="space-x-4 flex flex-row items-center">
                <div className="p-2 border-4 rounded-sm">
                    <Image
                        src={ shelterInfo?.user?.image|| "/images/paw-black.svg"}
                        height={200}
                        width={200}
                        alt="shelter logo"
                    />
                </div>
                <div>
                    <div className="text-4xl font-fondamento font-bold">
                        {shelterInfo?.user?.name || "Unknown Shelter"}
                    </div>
                    <div className="mt-4 text-md flex flex-col space-y-2">
                        <span>📍 <strong>Location:</strong> {shelterInfo?.user?.location || "Not provided"}</span>
                        <span>📞 <strong>Contact:</strong> {shelterInfo?.user?.phoneNumber || "Not provided"}</span>
                        
                        <span>📍 <strong>Email:</strong> {shelterInfo?.user?.email || "Not provided"}</span>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                {shelterInfo?.shelterDesc || "No description available"}
            </div>
        </Card>
    );
}
