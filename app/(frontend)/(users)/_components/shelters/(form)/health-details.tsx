'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "@/auth-client";
import CancelFormButton from "../../cancel-form-button";
import { toast } from "@/hooks/use-toast";
import { Combobox } from "@/app/(frontend)/(users)/_components/combo-box";
import { petHealthSchema, TAddPetHealthForm } from "../../../(shelter)/add-pet-form";
import usePetRegistrationStore from "./store";
import { useEffect } from "react";

const vaccinationStatus = [
    { value: "vaccinated", label: "Vaccinated" },
    { value: "needsSecondVaccination", label: "Needs Second Vaccination" },
    { value: "notVaccinated", label: "Not Vaccinated" },
    { value: "unknown", label: "Unknown" },
]
const neuteredStatus = [
    { value: "neutered", label: "Neutered" },
    { value: "notNeutered", label: "Not Neutered" },
    { value: "pending", label: "Pending" },
]
const healthIssues = [
    { value: "none", label: "None" },
    { value: "blind", label: "Blind" },
    { value: "deaf", label: "Deaf" },
    { value: "missing_limbs", label: "Missing Limbs" },
    { value: "medication_required", label: "Medication required" },
    { value: "other_issues", label: "Others" },
]

interface FormsProps {
    isEditing: boolean;
}

export default function HealthDetails({ isEditing }: FormsProps) {

    const session = useSession();
    const { nextStep, prevStep, formData, setHealthInfo } = usePetRegistrationStore();
    const form = useForm<TAddPetHealthForm>({
        resolver: zodResolver(petHealthSchema),
        defaultValues: {
            ...formData.healthDetails,
        },
        mode: 'onChange',
    });
    // console.log("Form", form.getValues());
    // console.log(form.formState.errors);

    const onSubmit = async (values: TAddPetHealthForm) => {

        try {
            // Update store with form data
            setHealthInfo({
                ...values,
            });
            console.log("Submit, Health", values);
            // Move to next step
            nextStep();
        }
        catch (error: any) {
            console.error("Validation error:", error);
            toast({
                title: "Error",
                description: "Please check all required fields.",
            });
        }
    }
    useEffect(() => {
        const subscription = form.watch((values) => {
            setHealthInfo({
                ...values,
            });
        });

        return () => subscription.unsubscribe();
    }, [form, setHealthInfo]);


    return (
        <main>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="border-b">Health Details</div>
                    <Card className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
                            <FormField
                                control={form.control}
                                name="vaccinationStatus"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Vaccination Status:</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={vaccinationStatus}
                                                placeholder="Select Vaccination Status..."
                                                selectedValue={field.value}
                                                onSelect={(value) => field.onChange(value)} // Update form state
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="neuteredStatus"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Neutered Status:</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={neuteredStatus}
                                                placeholder="Select Neutered Status..."
                                                selectedValue={field.value}
                                                onSelect={(value) => field.onChange(value)} // Update form state
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="healthIssues"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Health Issues:</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={healthIssues}
                                                placeholder="Select Health Issue..."
                                                selectedValue={field.value}
                                                onSelect={(value) => field.onChange(value)} // Update form state
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="otherHealthIssues"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Other Health Issues (if any):</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Health issues..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Card>

                    {!isEditing &&
                    <div className="flex gap-2 justify-end">
                        <CancelFormButton route="/shelter-homepage" />
                        <Button onClick={prevStep} >Previous</Button>
                        <Button type="submit">
                            Next
                        </Button>
                    </div>
                    }

                </form>
            </Form>
        </main>
    );
}
