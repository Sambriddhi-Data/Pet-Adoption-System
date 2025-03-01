'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "@/auth-client";
import CancelFormButton from "../../cancel-form-button";
import { toast } from "@/hooks/use-toast";
import { Combobox } from "@/app/(frontend)/(users)/_components/combo-box";
import { petBasicDetailsSchema, TPetBasicDetailsForm } from "../../../(shelter)/add-pet-form";
import usePetRegistrationStore from "./store";
import { Textarea } from "@/components/ui/textarea";

const species = [
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "rabbit", label: "Rabbit" },
    { value: "parrot", label: "Parrot" },
    { value: "others", label: "Others" },
];

const sex = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "unknown", label: "Unknown" },
];

const size = [
    { value: "small", label: "Small (0-5 kg)" },
    { value: "medium", label: "Medium (5-15 kg)" },
    { value: "large", label: "Large (15+ kg)" },
];

interface FormsProps {
    isEditing: boolean;
}

export default function BasicDetails({ isEditing }: FormsProps) {
    const session = useSession();
    const { nextStep, formData, setBasicInfo } = usePetRegistrationStore();

    // Using pet data for editing
    const shelter_id = session?.data?.user?.id;

    const form = useForm<TPetBasicDetailsForm>({
        resolver: zodResolver(petBasicDetailsSchema),
        defaultValues: {
            ...formData.basicDetails,
            shelterId: shelter_id, 
        },
    });

    const onSubmit = async (values: TPetBasicDetailsForm) => {
        if (!session?.data?.user?.id) {
            toast({
                title: "Error",
                description: "Shelter ID not found. Please try again.",
            });
            return;
        }
        try {
            // Update store with form data
            setBasicInfo({
                ...values,
                shelterId: session.data.user.id,
            });
            console.log("Submit Basic Details: ", values);

                nextStep();
        } catch (error: any) {
            console.error("Validation error:", error);
            toast({
                title: "Error",
                description: "Please check all required fields.",
            });
        }
    };

    return (
        <main>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="border-b">Basic Details</div>
                    <Card className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Pet Name:<span style={{ color: 'red' }}> *</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter pet name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="species"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Species<span style={{ color: 'red' }}> *</span></FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={species}
                                                placeholder="Select species..."
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
                                name="age"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Age</FormLabel>
                                        <FormControl>
                                            <Input placeholder="3 months" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sex"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Gender<span style={{ color: 'red' }}> *</span></FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={sex}
                                                placeholder="Select gender..."
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
                                name="size"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Size (when adult)<span style={{ color: 'red' }}> *</span></FormLabel>
                                        <FormControl>
                                            <Combobox
                                                options={size}
                                                placeholder="Select size..."
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Description<span style={{ color: 'red' }}>*</span></FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="resize-none"
                                                placeholder="ABC is a good boy."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Card>
                        <div className="flex gap-2 justify-end">
                            <div>
                            <CancelFormButton route="/shelter-homepage" />
                            </div>
                            <Button type="submit">Next</Button>
                        </div>
                </form>
            </Form>
        </main>
    );
}