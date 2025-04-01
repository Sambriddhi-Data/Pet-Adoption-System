'use client'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { petPersonalitySchema, TPetPersonalityForm } from "../../../(shelter)/add-pet-form";
import usePetRegistrationStore from "./store";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

const houseTrained = [
    { value: "fully", label: "Fully" },
    { value: "almost", label: "Almost" },
    { value: "not_trained", label: "Not Trained" },
]
interface FormsProps {
    isEditing: boolean;
}

export default function PersonalityDetails({ isEditing }: FormsProps) {

    const session = useSession();
    const { nextStep, prevStep, formData, setPersonalityInfo } = usePetRegistrationStore();
    const form = useForm<TPetPersonalityForm>({
        resolver: zodResolver(petPersonalitySchema),
        defaultValues: {
            ...formData.personalityDetails,
        },
        mode: 'onChange',
    });

    const onSubmit = async (values: TPetPersonalityForm) => {
        try {
            // Update store with form data
            setPersonalityInfo({
                ...values,
            });
            // console.log("Submit, Personality: ", values);
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
            setPersonalityInfo({
                ...values,
            });
        });

        return () => subscription.unsubscribe();
    }, [form, setPersonalityInfo]);

    return (
        <main>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="border-b">Personality Details</div>
                    <Card className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
                            <FormField
                                control={form.control}
                                name="houseTrained"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>House Trained:</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={houseTrained}
                                                placeholder="House Trained?..."
                                                selectedValue={field.value}
                                                onSelect={(value) => field.onChange(value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="social"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Social Media Summary</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="A short paragraph..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="personalitySummary"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Pet Personality Summary</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Likes to play..."
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
