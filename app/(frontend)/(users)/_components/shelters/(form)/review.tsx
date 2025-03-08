"use client";

import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import usePetRegistrationStore from "./store";
import { Button } from "@/components/ui/button";
import CancelFormButton from "../../cancel-form-button";

interface ReviewSubmitProps {
    isEditing: boolean;
}

export default function ReviewSubmit({ isEditing }: ReviewSubmitProps) {
    const router = useRouter();
    const { prevStep, resetForm, formData } = usePetRegistrationStore();

    const handleSubmit = async () => {
        try {
            let response;
            response = await fetch("/api/addPet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`Failed to add pet details.`);
            }

            // Show success message
            toast({
                title: "Success",
                description: "Pet added successfully.",
                variant: "success",
            });

            router.push("/shelter-homepage");
            resetForm();
        } catch (error) {
            console.error(`Error adding pet details:`, error);
            toast({
                title: "Error",
                description: `Failed to add pet details. Please try again.`,
            });
        }
    };

    return (
        <main className="max-w-3xl justify-center items-center mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4 text-center">Review Pet Details</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Basic Details */}
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 border-b pb-1">Basic Details</h2>
                    <ul className="space-y-2">
                        <li><strong>Name:</strong> {formData.basicDetails.name}</li>
                        <li><strong>Species:</strong> {formData.basicDetails.species}</li>
                        <li><strong>Age:</strong> {formData.basicDetails.age}</li>
                        <li><strong>Sex:</strong> {formData.basicDetails.sex}</li>
                        <li><strong>Size:</strong> {formData.basicDetails.size}</li>
                    </ul>
                </section>

                {/* Health Details */}
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 border-b pb-1">Health Details</h2>
                    <ul className="space-y-2">
                        <li><strong>Vaccination Status:</strong> {formData.healthDetails.vaccinationStatus}</li>
                        <li><strong>Neutered Status:</strong> {formData.healthDetails.neuteredStatus}</li>
                        <li><strong>Health Issues:</strong> {formData.healthDetails.healthIssues}</li>
                    </ul>
                </section>

                {/* Personality Details */}
                <section className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 border-b pb-1">Personality Details</h2>
                    <ul className="space-y-2">
                        <li><strong>House Trained:</strong> {formData.personalityDetails.houseTrained}</li>
                        <li><strong>Social Media Summary:</strong> {formData.personalityDetails.social}</li>
                        <li><strong>Personality Summary:</strong> {formData.personalityDetails.personalitySummary}</li>
                    </ul>
                </section>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-4">
                <CancelFormButton route="/shelter-homepage" />
                <div>
                    <Button onClick={prevStep} className="mr-2">Previous</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
        </main>
    );
}