'use client'

import { useSession } from "@/auth-client"
import { Card } from "@/components/ui/card";
import { useCallback, useEffect, useState } from "react"

interface AdopterProfile {
    name: string,
    email: string,
    phoneNumber: string,
    location: string,
    adoptionProfile: {
        image: string[],
        age: boolean,
        home_situation: string,
        outside_space: string,
        household_setting: string,
        household_typical_activity: string,
        flatmate: boolean,
        allergy: boolean,
        other_animals: boolean,
        other_animals_info?: string,
        neuter_status?: string,
        lifestyle: string,
        move_holiday: string,
        experience: string,
        agreement: boolean,
        min_age: string,
    },
    userId: string,
}

export const MyProfile = () => {
    const { data: session } = useSession();
    const id = session?.user?.id;
    const [adopterProfile, setAdopterProfile] = useState<AdopterProfile>();

    const fetchAdopterProfile = useCallback(async () => {
        if (!id) return;
        try {
            const response = await fetch(`/api/adoption-profile?id=${id}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const profile = await response.json();
            setAdopterProfile(profile);
        } catch (error) {
            console.error("Failed to fetch adopter profile", error);
        }
    }, [id]);

    useEffect(() => {
        fetchAdopterProfile();
    }, [fetchAdopterProfile]);

    return (
        <main className="bg-gray-100 rounded-md p-6">
                <section className="mb-6">
                    <h1 className="font-bold text-xl">Personal Information</h1>
                    <p className="text-center">{adopterProfile?.name}</p>
                    <p className="text-center">{adopterProfile?.phoneNumber} {adopterProfile?.location? <span><span className="text-coral text-2xl">|</span> {adopterProfile?.location} </span>: ""}</p>
                </section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-center text-gray-800">
                    <section className="mb-6 w-full border-3 bg-white p-6 rounded-lg space-y-3">
                        <h1 className="text-xl font-semibold mb-4">Home Details</h1>
                        <p className="font-semibold">Home Situation:</p><p> {adopterProfile?.adoptionProfile.home_situation}</p>
                        <p className="font-semibold">Outside Space:</p><p> {adopterProfile?.adoptionProfile.outside_space}</p>
                        <p className="font-semibold">Household Setting:</p><p> {adopterProfile?.adoptionProfile.household_setting}</p>
                        <p className="font-semibold">Typical Household Activity:</p><p> {adopterProfile?.adoptionProfile.household_typical_activity}</p>
                        <p className="font-semibold">Has Flatmates:</p><p> {adopterProfile?.adoptionProfile.flatmate ? "Yes" : "No"}</p>
                        <p className="font-semibold">Allergy to Pets:</p><p> {adopterProfile?.adoptionProfile.allergy ? "Yes" : "No"}</p>
                        <p className="font-semibold">Other Animals in Home:</p><p> {adopterProfile?.adoptionProfile.other_animals ? `Yes (${adopterProfile?.adoptionProfile.other_animals_info})` : "No"}</p>
                    </section>

                    <section className="mb-6 w-full border-3 bg-white p-6 rounded-lg space-y-3">
                        <h1 className="text-xl font-semibold mb-4">Life Style and Commitment</h1>
                        <p className="font-semibold">Work/Lifestyle:</p> <p>{adopterProfile?.adoptionProfile.lifestyle}</p>
                        <p className="font-semibold">Moving/Holidays Plan:</p> <p>{adopterProfile?.adoptionProfile.move_holiday}</p>
                        <p className="font-semibold">Experience with Pets:</p> <p>{adopterProfile?.adoptionProfile.experience}</p>
                        <p className="font-semibold">Agreement to Terms:</p> <p>{adopterProfile?.adoptionProfile.agreement ? "Yes" : "No"}</p>
                        <p className="font-semibold">Minimum Age Preferred:</p> <p>{adopterProfile?.adoptionProfile.min_age}</p>
                    </section>
                </div>
        </main>
    )
}
