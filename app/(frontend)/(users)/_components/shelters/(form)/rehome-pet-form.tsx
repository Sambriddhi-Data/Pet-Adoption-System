'use client'
import { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "../../combo-box";
import { rehomePetSchema, TRehomePetSchema } from "../../forms/customer-form-schema";
import { useSession } from "@/auth-client";
import { toast } from "@/hooks/use-toast";
import { useSignedCloudinaryWidgetRehome } from "./custom-widget";
import { useRouter } from "next/navigation";

const species = [
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Rabbit", label: "Rabbit" },
    { value: "Parrot", label: "Parrot" },
    { value: "Others", label: "Others" },
];
const duration = [
    { value: "Less than 1 month", label: "Less than 1 month" },
    { value: "1 month", label: "1 month" },
    { value: "2 months", label: "2 months" },
    { value: "Until a home is found", label: "Until a home is found" },
];

interface RehomeRequestByShelterId {
    shelterId: string;
}
export default function RehomePet({ shelterId }:RehomeRequestByShelterId){
    const [step, setStep] = useState(1);
    const {data: session} = useSession();
    const user = session?.user;
    const [isDeleting, setIsDeleting] = useState(false);
    const [pending, setPending] = useState(false);
    const router = useRouter();
    console.log(shelterId);


    const form = useForm<TRehomePetSchema>({
        resolver: zodResolver(rehomePetSchema),
        defaultValues: {
            species: "",
            isBonded: false,
            rehomeReason: [],
            keepDuration: "1 month",
            email: user?.email,
            name: user?.name || "",
            phoneNumber: user?.phoneNumber || "",
            petName:"",
            location: user?.location || "",
            isOver18: false,
            shelterId: shelterId,
            image: [],
            userId: user?.id,
        },
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
        }
    };

    const { openWidget } = useSignedCloudinaryWidgetRehome(handleUpload);

    // Function to get public ID from Cloudinary URL
    const getPublicIdFromUrl = useCallback((url: string) => {
        try {
            // Extract the part of the URL after '/upload/'
            const uploadIndex = url.indexOf('/upload/');
            if (uploadIndex === -1) return '';

            // Get everything after /upload/
            let path = url.slice(uploadIndex + 8);

            // Remove any transformation parameters
            if (path.includes('/')) {
                const transformEnd = path.indexOf('/');
                path = path.slice(transformEnd + 1);
            }

            // Remove file extension
            const extensionIndex = path.lastIndexOf('.');
            if (extensionIndex !== -1) {
                path = path.slice(0, extensionIndex);
            }

            // Return the complete public ID including the folder
            return path;
        } catch (error) {
            console.error("Error extracting public ID:", error);
            return '';
        }
    }, []);

    // Function to delete image from Cloudinary
    const deleteImageFromCloudinary = useCallback(async (imageUrl: string) => {
        setIsDeleting(true);
        try {
            const publicId = getPublicIdFromUrl(imageUrl);

            const response = await fetch('/api/cloudinary/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ publicId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete image');
            }

            toast({
                title: "Image Deleted",
                description: "Image has been removed from cloud storage.",
                variant: "success",
            });

            return true;
        } catch (error) {
            console.error("Error deleting image:", error);
            toast({
                title: "Error",
                description: "Failed to delete image from cloud storage.",
                variant: "destructive",
            });
            return false;
        } finally {
            setIsDeleting(false);
        }
    }, [getPublicIdFromUrl]);

    // Function to handle image removal
    const handleRemoveImage = async (imageUrl: string, index: number) => {
        if (!imageUrl.includes('blob:')) {
            await deleteImageFromCloudinary(imageUrl);
        }

        // Remove from form state
        const currentImages = form.getValues("image") || [];
        const newImages = [...currentImages];
        newImages.splice(index, 1);

        // Update form and store
        form.setValue("image", newImages, { shouldValidate: true });
    };
    console.log("Form", form.getValues())
    console.log(form.formState.errors)

    const onSubmit = async (data: TRehomePetSchema) => {
        setPending(true);
        try {
            const response = await fetch("/api/rehomeApplication", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            console.log("API Response:", response);

            if (!response.ok) {
                throw new Error(`Failed to make rehoming request.`);
            }
            toast({
                title: "Rehoming Request sent!",
                description: "You request has been sent to the shelter. They will review your application and get back to you.",
                variant: "success"
            });

        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            toast({
                title: "Error",
                description: error.response?.data?.message || "An error occurred. Please try again.",
                variant: "destructive"
            });
        } finally {
            setPending(false);
            router.push(`/customer-profile/${user?.id}`)
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <>
            {/* First Dialog */}
            <Dialog open={step === 1}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Before you start...</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <p><strong>We are NOT a rescue centre.</strong> The shelters will view the application <strong>and inform you if they will accept your pet</strong>.</p>
                        <p><strong>You won’t get paid</strong> for your pet but it is free to list them with our platform.</p>
                        <p><strong>We can't help with emergency rehoming.</strong> You will need to be able to keep your pet for <strong>at least 4-6 weeks minimum</strong>.</p>
                        <p><strong>All listings are subject to approval</strong> by the PetRehomer team.</p>
                        <p>Ensure you are submitting a <strong>detailed description of your pet</strong> with <strong>4 good quality photos</strong>.</p>
                    </div>
                    <Button onClick={() => setStep(2)}>Continue</Button>
                </DialogContent>
            </Dialog>

            {/* Second Dialog */}
            <Dialog open={step === 2}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Listing Guidelines</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <p><strong>Adding photos takes a few seconds</strong> for each, so wait for each one to upload.</p>
                        <p>If you are listing a <strong>bonded pets</strong>, ensure the <strong>main(first) photo</strong> is an image of <strong>all pets together</strong>.</p>
                        <p><strong>You cannot edit</strong> your pet’s profile after submitting, so add all required details beforehand.</p>
                        <p>Click the <strong>"Submit" button</strong> to submit the application.</p>
                    </div>
                    <Button onClick={() => setStep(3)}>Understood</Button>
                </DialogContent>
            </Dialog>

            <div className="mt-10 max-w-3xl mx-auto">
                <h1 className="text-center text-4xl mb-5">Rehome Your Pet</h1>
                <p className="text-center mb-10">You need to fill all the fields to apply for rehoming your pet.</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                            control={form.control}
                            name="petName"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Pet's name:<span style={{ color: 'red' }}> *</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter pet's name" {...field} />
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
                                    <FormLabel>What type of pet are you rehoming?<span style={{ color: 'red' }}> *</span></FormLabel>
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
                            name="isBonded"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Are you rehoming a bonded pets?<span style={{ color: 'red' }}> *</span></FormLabel>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rehomeReason"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Why do you need to rehome your pet?<span style={{ color: 'red' }}> *</span></FormLabel>
                                    <FormControl>
                                        <div className="space-y-2">
                                            {["Behavioural Issues", "Busy Schedule", "Change in Family Circumstances", "My Pet's Offspring", "Does not get along with another Pet"].map((reason) => (
                                                <label key={reason} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        checked={field.value.includes(reason)}
                                                        onCheckedChange={(checked) => {
                                                            const newReasons = checked
                                                                ? [...field.value, reason]
                                                                : field.value.filter((r) => r !== reason);
                                                            field.onChange(newReasons);
                                                        }}
                                                    />
                                                    <span>{reason}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="keepDuration"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">

                                    <FormLabel>How long are you able to keep your pet/s while we help find a suitable new home?<span style={{ color: 'red' }}> *</span></FormLabel>
                                    <FormControl>
                                        <Combobox
                                            options={duration}
                                            placeholder="Select duration..."
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
                            name="image"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Pet Images:<span style={{ color: 'red' }}> *</span></FormLabel>

                                    {/* Current Images Gallery */}
                                    {field.value && field.value.length > 0 ? (
                                        <div className="mb-4">
                                            <h3 className="text-sm font-medium mb-2">Current Images</h3>
                                            <div className="flex flex-wrap gap-3">
                                                {field.value.map((img, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={img}
                                                            alt={`Pet ${index + 1}`}
                                                            className="w-32 h-32 object-cover rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            disabled={isDeleting}
                                                            onClick={() => handleRemoveImage(img, index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                                                            aria-label="Remove image"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>   
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-sm mb-4">No images uploaded yet.</p>
                                    )}

                                    {/* Upload Options */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-medium">Add Four Good Quality Images of the pet:</h3>
                                        <div>
                                            <Button
                                                type="button"
                                                onClick={openWidget}
                                                className=" mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md px-3 py-2 text-sm inline-block"
                                            >
                                                Choose Image
                                            </Button>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Max size: 5MB.
                                            </p>
                                        </div>
                                    </div>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Current address:<span style={{ color: 'red' }}> *</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Town / City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">

                                    <FormLabel>Email<span style={{ color: 'red' }}> *</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">

                                    <FormLabel>Full Name<span style={{ color: 'red' }}> *</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number<span style={{ color: 'red' }}> *</span></FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isOver18"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 text-gray-500">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            I am above 18 years old.
                                        </FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </>
    );
}