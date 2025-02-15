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

const vaccinationStatus = [
    { value: "vaccinated", label: "Vaccinated" },
    { value: "needsSecondVaccination", label: "Needs Second Vaccination" },
    { value: "notVaccinated", label: "Not Vaccinated" },
    { value: "unknown", label: "Unknown" },
]
export default function HealthDetails() {

    const session = useSession();
    const { nextStep, prevStep, formData, setHealthInfo } = usePetRegistrationStore();
    const form = useForm<TAddPetHealthForm>({
        resolver: zodResolver(petHealthSchema),
        defaultValues: {
            ...formData.healthDetails,
        },
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

    return (
        <main>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="border-b">Health Details</div>
                    <Card className="p-6">
                        <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
                            <FormField
                                control={form.control}
                                name="vaccinationStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vaccination Status:<span style={{ color: 'red' }}> *</span></FormLabel>
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
                        </div>
                    </Card>

                    <div className="flex gap-2">
                        <CancelFormButton route="/shelter-homepage" />
                        <Button onClick={prevStep} >Previous</Button>
                        <Button type="submit">
                            Next
                        </Button>
                    </div>
                </form>
            </Form>
        </main>
    );
}
