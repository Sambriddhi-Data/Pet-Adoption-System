"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import BasicDetails from "../../../_components/shelters/(form)/basic-details";
import HealthDetails from "../../../_components/shelters/(form)/health-details";
import PersonalityDetails from "../../../_components/shelters/(form)/personality-details";
import ReviewSubmit from "../../../_components/shelters/(form)/review";
import usePetRegistrationStore from "../../../_components/shelters/(form)/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import CancelFormButton from "../../../_components/cancel-form-button";

export default function EditPet() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("basic_details");
    const { 
        setBasicInfo, 
        setHealthInfo, 
        setPersonalityInfo, 
        resetForm,
        formData 
    } = usePetRegistrationStore();

    useEffect(() => {
        if (id) {
            const fetchPetDetails = async () => {
                setLoading(true);
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

    // Save changes for the current active tab
    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`/api/updatePet?id=${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Failed to update pet details");
            }

            toast({
                title: "Success",
                description: "Pet details updated successfully",
                variant: "success"
            });
            router.push("/shelter-homepage");
            resetForm();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save changes"
            });
        }
    }

    if (loading) return <p>Loading pet details...</p>;
    return (
        <main className="p-6 space-y-4 flex flex-col">
            <div className="mx-auto w-full max-w-4xl">
                <h2 className="text-lg font-bold mb-4">Edit Pet Details</h2>
                
                <Tabs 
                    value={activeTab} 
                    onValueChange={setActiveTab}
                    defaultValue="basic_details"
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="basic_details">Basic Details</TabsTrigger>
                        <TabsTrigger value="health_details">Health Details</TabsTrigger>
                        <TabsTrigger value="personality_details">Personality Details</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic_details">
                        <BasicDetails isEditing={true} />
                    </TabsContent>
                    <TabsContent value="health_details">
                        <HealthDetails isEditing={true} />
                    </TabsContent>
                    <TabsContent value="personality_details">
                        <PersonalityDetails isEditing={true} />
                    </TabsContent>
                </Tabs>

                <div className="flex gap-2 justify-end mt-4">
                    <div>
                    <CancelFormButton route="/shelter-homepage"/>
                    </div>
                    <Button onClick={handleSaveChanges}>Save All Changes</Button>
                </div>
            </div>
        </main>
    );
}