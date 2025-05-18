"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import BasicDetails from "../../../_components/shelters/(form)/basic-details";
import HealthDetails from "../../../_components/shelters/(form)/health-details";
import PersonalityDetails from "../../../_components/shelters/(form)/personality-details";
import usePetRegistrationStore from "../../../_components/shelters/(form)/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import CancelFormButton from "../../../_components/cancel-form-button";
import AddPetImages from "../../../_components/shelters/(form)/pet-images";
import AdoptionRequestsByPet from "../../../_components/shelters/adoption-requests-by-pet";
import { MoveLeft } from "lucide-react";

export default function EditPet() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("basic_details");
    const [actTab, setActTab] = useState("details");
    const [petName, setPetName] = useState("");
    const {
        setBasicInfo,
        setHealthInfo,
        setPersonalityInfo,
        setPetImages,
        resetForm,
        formData
    } = usePetRegistrationStore();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const initialFormData = useRef(formData);

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

                    setPetName(petData.name);
                    // Populate the store with the fetched data
                    setBasicInfo({
                        name: petData.name,
                        species: petData.species,
                        age: petData.age,
                        dominantBreed: petData.dominantBreed || "unknown",
                        sex: petData.sex,
                        size: petData.size,
                        status: petData.status,
                        // arrivedAtShelter: petData.arrivedAtShelter || new Date(),
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
                    setPetImages({
                        image: petData.image || ""
                    })


                } catch (error) {
                    console.error("Error fetching pet details:", error);
                    toast({ title: "Error", description: "Failed to load pet details." });
                } finally {
                    setLoading(false);
                }
            };
            fetchPetDetails();
        }
    }, [id, setBasicInfo, setHealthInfo, setPersonalityInfo, setPetImages]);

    // Save changes for the current active tab
    const handleSaveChanges = async () => {
        try {
            const response = await fetch(`/api/updatePet?id=${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                // Try to get detailed error information
                const errorData = await response.json().catch(() => null);
                
                // Log full technical error for debugging
                console.error("Update failed:", errorData);
                
                // Create user-friendly error message
                let userMessage = "Unable to update pet information.";
                
                if (errorData) {
                    if (Array.isArray(errorData)) {
                        // Create simplified list of field errors
                        userMessage = "Please check the following fields:";
                        const errorFields = new Set();
                        
                        errorData.forEach(err => {
                            if (err.path && err.path.length > 0) {
                                // Get the last part of the path for field name
                                const fieldName = err.path[err.path.length - 1];
                                errorFields.add(fieldName);
                            }
                        });
                        
                        errorFields.forEach(field => {
                            userMessage += `\n• ${field}`;
                        });
                    } else if (typeof errorData === 'object' && errorData.error) {
                        userMessage = errorData.error;
                    }
                }
                
                throw new Error(userMessage);
            }
    

            toast({
                title: "Success",
                description: "Pet details updated successfully",
                variant: "success"
            });
            resetForm();
        } catch (error: any) {
            toast({
                title: "Update failed",
                description: error.message || "Failed to save changes",
                variant: "destructive"
            });
        }
    }
    // Track form changes
    useEffect(() => {
        const isFormChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData.current);
        setHasUnsavedChanges(isFormChanged);
    }, [formData]);

    // Warn before leaving if there are unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    // Handle tab change with warning
    const handleTabChange = (tab: string) => {
        if (hasUnsavedChanges && actTab === "details") {
            const confirmLeave = window.confirm(
                "You have unsaved changes. Are you sure you want to switch tabs without saving?"
            );
            if (!confirmLeave) return;
        }
        setActTab(tab);
    };
    // Handle back navigation
    const handleBackClick = () => {
        if (hasUnsavedChanges) {
            const confirmLeave = window.confirm(
                "You may have unsaved changes. Are you sure you want to leave?"
            );
            if (!confirmLeave) return;
        }
        router.back();
    };
    if (loading) return <p>Loading pet details...</p>;
    return (
        <>
            <main className="p-6 space-y-4">
                <div className="flex gap-2 items-center">
                    <Button
                        variant="ghost"
                        className="h-10 w-10 rounded-full"
                        onClick={handleBackClick}>
                        <MoveLeft />
                    </Button>
                    <h1 className="text-2xl font-bold">{petName}</h1>
                </div>
                <div className="mx-auto w-full max-w-4xl">
                    <Tabs
                        value={actTab}
                        onValueChange={setActTab}
                        defaultValue="details"
                        className="w-full"
                    >
                        <TabsList className="grid w-[30rem] grid-cols-2 h-24">
                            <TabsTrigger value="details" className="h-20 text-lg">Details</TabsTrigger>
                            <TabsTrigger value="applications" className="h-20 text-lg">Applications</TabsTrigger>
                        </TabsList> 

                        <TabsContent value="details">
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                defaultValue="basic_details"
                            >
                                <h2 className="text-lg font-bold mt-6 mb-4">Edit Pet Details</h2>

                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="basic_details">Basic Details</TabsTrigger>
                                    <TabsTrigger value="health_details">Health Details</TabsTrigger>
                                    <TabsTrigger value="personality_details">Personality Details</TabsTrigger>
                                    <TabsTrigger value="images">Images</TabsTrigger>
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
                                <TabsContent value="images">
                                    <AddPetImages isEditing={true} />
                                </TabsContent>

                            </Tabs>

                            <div className="flex gap-2 justify-end mt-4">
                                <div>
                                    <CancelFormButton route="/shelter-homepage" />
                                </div>
                                <Button onClick={handleSaveChanges}>Save All Changes</Button>
                            </div>
                        </TabsContent>
                        <TabsContent value="applications">
                            <AdoptionRequestsByPet petId={id as string} />
                        </TabsContent>

                    </Tabs>

                </div>
            </main>
        </>
    );
}