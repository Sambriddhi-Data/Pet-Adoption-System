'use client'
import { toast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ApplytoAdoptButton from '../../../_components/apply-to-adopt-button';

interface PetData {
    id: string;
    name: string;
    breed: string;
    age: string;
}

function PetInfoPage() {
    const { petId } = useParams();
    const [pet, setPet] = useState<PetData[]>([]);
    useEffect(() => {
        if (petId) {
            const fetchPetDetails = async () => {
                try {
                    const response = await fetch(`/api/getPetById?id=${petId}`);
                    if (!response.ok) {
                        throw new Error();
                    }
                    const petData = await response.json();
                    setPet(petData);
                } catch (error) {
                    console.error("Error fetching pet details:", error);
                    toast({ title: "Error", description: "Failed to load pet details." });
                }
            };
            fetchPetDetails();
        }
    }, [petId]);
    return (
        <div>
            PetInfoPage
                <div>{pet.id}</div>
                <ApplytoAdoptButton/>
        </div>

    )
}
[]
export default PetInfoPage;