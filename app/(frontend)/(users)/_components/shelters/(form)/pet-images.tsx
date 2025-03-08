'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CancelFormButton from "../../cancel-form-button";
import { toast } from "@/hooks/use-toast";
import { petImagesForm, TPetImagesForm } from "../../../(shelter)/add-pet-form";
import usePetRegistrationStore from "./store";
import { CldUploadButton } from "next-cloudinary";


interface FormsProps {
    isEditing: boolean;
}

export default function AddPetImages({ isEditing }: FormsProps) {

    const { nextStep, prevStep, formData, setPetImages } = usePetRegistrationStore();
    const form = useForm<TPetImagesForm>({
        resolver: zodResolver(petImagesForm),
        defaultValues: {
            ...formData.petImages,
        },
        mode: 'onChange',
    });
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

    const onSubmit = async (values: TPetImagesForm) => {
        try {
            // Update store with form data
            setPetImages({
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

    return (
        <main>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="border-b">Personality Details</div>
                    <Card className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:w-[56rem] max-w-4xl">
                        <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Upload Pet Image:<span style={{ color: 'red' }}> *</span></FormLabel>
                                            <CldUploadButton
                                                uploadPreset="ffe_upload"
                                                onSuccess={handleUpload}
                                                className="z-9999 border border-gray-300 rounded-md p-2"
                                                options={{
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
                                            >Choose image</CldUploadButton>
                                            {field.value && field.value.length > 0 && (
                                                <div className="flex flex-row gap-2 mt-2">
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
