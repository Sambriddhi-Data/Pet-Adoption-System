'use client'

import LoadingButton from "@/components/loading-button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ShelterInfo {
    shelterDesc?: string;
    khaltiSecret?: string;
    user: {
        name: string;
        location?: string;
        image?: string;
        phoneNumber?: string;
        email?: string;
    };
}

export function ShelterInfoCard() {
    const { id } = useParams();
    const [shelterInfo, setShelterInfo] = useState<ShelterInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [pending, setPending] = useState(false);
    const router = useRouter();
    const shelter = shelterInfo?.user

    useEffect(() => {
        if (!id) return;
        setLoading(true);

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
            <div className="flex flex-row items-center justify-between">
                <div className="space-x-4 flex flex-row items-center">
                    <div className="p-2 border-4 rounded-sm">
                        <Image
                            src={shelterInfo?.user?.image || "/images/paw-black.svg"}
                            height={200}
                            width={200}
                            alt="shelter logo"
                        />
                    </div>
                    <div>
                        <div className="text-4xl font-fondamento font-bold">
                            {shelter?.name || "Unknown Shelter"}
                        </div>
                        <div className="mt-4 text-md flex flex-col space-y-2">
                            <span>📍 <strong>Location:</strong> {shelter?.location || "Not provided"}</span>
                            <span>📞 <strong>Contact:</strong> {shelter?.phoneNumber || "Not provided"}</span>

                            <span>📍 <strong>Email:</strong> {shelter?.email || "Not provided"}</span>
                        </div>
                    </div>
                </div>
                <div className="w-24 mr-16">
                    {shelterInfo?.khaltiSecret ? (
                        <LoadingButton pending={pending} onClick={() => router.push(`/donate/${id}`)}>Donate</LoadingButton>
                    ) :
                        (<div>
                        </div>

                        )}
                </div>
            </div>
            <div className="mt-4">
                {shelterInfo?.shelterDesc || "No description available"}
            </div>
        </Card>
    );
}
