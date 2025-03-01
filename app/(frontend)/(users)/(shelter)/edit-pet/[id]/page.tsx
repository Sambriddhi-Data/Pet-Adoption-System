"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import BasicDetails from "../../../_components/shelters/(form)/basic-details";
import HealthDetails from "../../../_components/shelters/(form)/health-details";
import PersonalityDetails from "../../../_components/shelters/(form)/personality-details";
import ReviewSubmit from "../../../_components/shelters/(form)/review";
import usePetRegistrationStore from "../../../_components/shelters/(form)/store";

export default function EditPet() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const { step, nextStep, prevStep, formData, setBasicInfo, setHealthInfo, setPersonalityInfo, resetForm } = usePetRegistrationStore();

    // Fetch pet details when the component mounts
    useEffect(() => {
        if (id) {
            const fetchPetDetails = async () => {
                try {
                    const response = await fetch(`/api/getPetById?id=${id}`);
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status} ${response.statusText}`);
                    }
                    const petData = await response.json();

                    // Populate the store with the fetched data
                    setBasicInfo({
                        name: petData.name,
                        species: petData.species,
                        description: petData.description,
                        age: petData.age,
                        dominantBreed: petData.dominantBreed || "",
                        sex: petData.sex,
                        size: petData.size,
                        status: petData.status,
                        arrivedAtShelter: petData.arrivedAtShelter || "",
                        shelterId: petData.shelterId,
                    });

                    setHealthInfo({
                        vaccinationStatus: petData.vaccinationStatus || "unknown",
                        neuteredStatus: petData.neuteredStatus || "pending",
                        dateDewormed: petData.dateDewormed || "",
                        healthIssues: petData.healthIssues || "none",
                        otherHealthIssues: petData.otherHealthIssues || "",
                        notes: petData.notes || "",
                    });

                    setPersonalityInfo({
                        social: petData.social || "",
                        personalitySummary: petData.personalitySummary || "",
                        houseTrained: petData.houseTrained || "not_trained",
                    });
                    console.log("Pet data", petData);


                } catch (error) {
                    console.error("Error fetching pet details:", error);
                    toast({ title: "Error", description: "Failed to load pet details." });
                } finally {
                    setLoading(false);
                }
            };
            fetchPetDetails();
        }
    }, [id, setBasicInfo, setHealthInfo, setPersonalityInfo]);

    // Render the current step
    const renderStep = () => {
        switch (step) {
            case 1:
                return <BasicDetails isEditing={true} />;
            case 2:
                return <HealthDetails isEditing={true} />;
            case 3:
                return <PersonalityDetails isEditing={true} />;
            case 4:
                return <ReviewSubmit isEditing={true} />;
            default:
                return null;
        }
    };
    if (loading) return <p>Loading pet details...</p>;
    return (
        <main className="p-6 space-y-4 flex flex-col">
            <div className="mx-auto w-full max-w-4xl">
                <div className="p-6 space-y-4">
                    <h2 className="text-lg font-bold">Edit Pet Details</h2>
                    {renderStep()}
                </div>
            </div>
        </main>
    );
}