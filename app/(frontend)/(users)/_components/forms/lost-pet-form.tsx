'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { lostPetFormSchema, TLostPetFormSchema } from "../../(customer)/lost-pet-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CldUploadButton } from "next-cloudinary";
import { useState } from "react";
import LoadingButton from "@/components/loading-button";
import { Combobox } from "../combo-box";


const status = [
    { value: "lost", label: "Lost" },
    { value: "found", label: "Found" },
];

export default function LostPetForm() {

    const [pending, setPending] = useState(false);


    const form = useForm<TLostPetFormSchema>({
        resolver: zodResolver(lostPetFormSchema),
        defaultValues: {
            name: "",
            phoneNumber: "",
            location: "",
            description: "",
            image: [],
            status: ""
        }
    })
    const handleUpload = (result: any) => {
        if (result.event === "success") {
            const currentImages = form.getValues("image") || [];
            form.setValue("image", [...currentImages, result.info.secure_url], { shouldValidate: true });
            toast({
                title: "Image Uploaded",
                description: "Your image has been uploaded successfully!",
                variant: "success",
            });
            {
                'use server';
                console.log("Image uploaded successfully");
            }
        }
    };

    async function onsubmit(values: TLostPetFormSchema) {
        setPending(true);

        try {
            const { data } = await axios.post('api/addLostPet', values)
            toast({
                title: "Lost pet added for alert successfully!",
                description: `${data.name} has been added to the alert carousel`,
                variant: "success"
            });
            form.reset();
        }
        catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            toast({
                title: "Error",
                description: error.response?.data?.message || "An error occurred. Please try again later.",
            });
        }
        setPending(false);

    }
    return (
        <main className="px-5 bg-white">
            <div className="max-w-3xl mx-auto">
                <CardHeader className="flex items-center justify-center">
                    <CardDescription>Fill in the following form to request the site to add a lost pet alert for your pet.
                        We hope you reunite with your furry one as soon as possible.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-4">
                            <div className=" flex flex-col space-y-4 max-w-2xl">
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
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Location where the pet was lost:<span style={{ color: 'red' }}> *</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter location name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Did you lose this pet or find this pet?:<span style={{ color: 'red' }}> *</span></FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    options={status}
                                                    placeholder="Select option..."
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
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Enter your phone number for contact:<span style={{ color: 'red' }}> *</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="9800000000" {...field} />
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
                                            <FormLabel>Lost/Found pet's description:<span style={{ color: 'red' }}> *</span></FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Describe the pet(gender, color, size)" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Upload Pet Image:<span style={{ color: 'red' }}> *</span></FormLabel>
                                            <CldUploadButton
                                                uploadPreset="ffe_upload"
                                                onSuccess={handleUpload}
                                                className="z-9999 w-40 border rounded-md p-2 bg-gray-100 hover:bg-gray-200"
                                                options={{
                                                    maxFiles: 5,
                                                    maxFileSize: 5000000,
                                                    clientAllowedFormats: ["jpg", "jpeg", "png"],
                                                    sources: ["local", "camera", "url", "google_drive"],
                                                    resourceType: "image",
                                                    styles: {
                                                        palette: {
                                                            window: "#FFFFFF",
                                                            windowBorder: "#90A0B3",
                                                            tabIcon: "#0078FF",
                                                            menuIcons: "#5A616A",
                                                            textDark: "#000000",
                                                            textLight: "#FFFFFF",
                                                            link: "#0078FF",
                                                            action: "#FF620C",
                                                            inactiveTabIcon: "#0E2F5A",
                                                            error: "#F44235",
                                                            inProgress: "#0078FF",
                                                            complete: "#20B832",
                                                            sourceBg: "#E4EBF1"
                                                        },
                                                        fonts: {
                                                            default: null,
                                                            "'Fira Sans', sans-serif": {
                                                                url: "https://fonts.googleapis.com/css?family=Fira+Sans",
                                                                active: true
                                                            }
                                                        }
                                                    },
                                                }}
                                            >Choose images</CldUploadButton>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Max size: 5MB.
                                            </p>

                                            {field.value && field.value.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {field.value.map((img, index) => (
                                                        <img key={index} src={img} alt={`Uploaded Pet ${index + 1}`} className="w-40 h-40 object-cover" />
                                                    ))}
                                                </div>
                                            )}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <LoadingButton pending={pending}>
                                Submit
                            </LoadingButton>
                        </form>
                    </Form>
                </CardContent>
            </div>
        </main>
    )
}