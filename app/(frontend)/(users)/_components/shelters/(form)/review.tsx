'use client'

import { toast } from "@/hooks/use-toast";
import { useSession } from "@/auth-client";
import { useRouter } from "next/navigation";
import usePetRegistrationStore from "./store";
import axios from "axios";
import { Button } from "@/components/ui/button";
import CancelFormButton from "../../cancel-form-button";

export default function ReviewSubmit() {
    const session = useSession();
    const router = useRouter();
    const { prevStep, formData } = usePetRegistrationStore();

    async function onSubmit() {
        const { formData } = usePetRegistrationStore.getState();

        if (!session?.data?.user?.id) {
            toast({
                title: "Error",
                description: "Shelter ID not found. Please try again.",
            });
            return;
        }

        // Attach the shelterId inside basicDetails
        const completeFormData = {
            basicDetails: {
                ...formData.basicDetails,
                shelterId: session.data.user.id,  // Ensure shelterId is set here
            },
            healthDetails: formData.healthDetails,
            personalityDetails: formData.personalityDetails,
        };

        console.log("Submitting Form Data:", completeFormData);

        try {
            const { data } = await axios.post('/api/addPet', completeFormData);

            toast({
                title: "Pet added successfully!",
                description: `${formData.basicDetails.name} has been added to the family`,
            });

            router.push('/shelter-homepage');
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            toast({
                title: "Error",
                description: error.response?.data?.message || "An error occurred. Please try again later.",
            });
        }
    }

    return (
        <main className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Review Pet Details</h1>

            {/* Basic Details */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2 border-b pb-1">Basic Details</h2>
                <ul className="space-y-2">
                    <li><strong>Name:</strong> {formData.basicDetails.name}</li>
                    <li><strong>Species:</strong> {formData.basicDetails.species}</li>
                    <li><strong>Breed:</strong> {formData.basicDetails.dominantBreed}</li>
                    <li><strong>Age:</strong> {formData.basicDetails.age} years</li>
                    <li><strong>Sex:</strong> {formData.basicDetails.sex}</li>
                    <li><strong>Status:</strong> {formData.basicDetails.status}</li>
                    <li><strong>Arrived At Shelter:</strong> {formData.basicDetails.arrivedAtShelter}</li>
                    <li><strong>Size:</strong> {formData.basicDetails.size}</li>
                </ul>
            </section>

            {/* Health Details */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2 border-b pb-1">Health Details</h2>
                <ul className="space-y-2">
                    <li><strong>Vaccination Status:</strong> {formData.healthDetails.vaccinationStatus}</li>
                    <li><strong>Neutered Status:</strong> {formData.healthDetails.neuteredStatus}</li>
                    <li><strong>Date Dewormed:</strong> {formData.healthDetails.dateDewormed}</li>
                    <li>
                        <strong>Health Issues:</strong>
                        {Array.isArray(formData.healthDetails?.healthIssues)
                            ? formData.healthDetails.healthIssues.join(", ")
                            : formData.healthDetails?.healthIssues || "None"}
                    </li>
                    <li><strong>Other Health Issues:</strong> {formData.healthDetails.otherHealthIssues || "None"}</li>
                    <li><strong>Notes:</strong> {formData.healthDetails.notes || "N/A"}</li>
                </ul>
            </section>

            {/* Personality Details */}
            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2 border-b pb-1">Personality Details</h2>
                <ul className="space-y-2">
                    <li><strong>Social:</strong> {formData.personalityDetails.social}</li>
                    <li><strong>House Trained:</strong> {formData.personalityDetails.houseTrained ? "Yes" : "No"}</li>
                    <li><strong>Personality Summary:</strong> {formData.personalityDetails.personalitySummary}</li>
                </ul>
            </section>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
                <CancelFormButton route="/shelter-homepage" />
                <div>
                    <Button onClick={prevStep} className="mr-2">Previous</Button>
                    <Button onClick={onSubmit}>Submit</Button>
                </div>
            </div>
        </main>
    );
}