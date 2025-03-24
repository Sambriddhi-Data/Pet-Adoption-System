'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import LoadingButton from "@/components/loading-button";
import { adopterProfileSchema, TAdopterProfileSchema } from "./customer-form-schema";
import { useSignedCloudinaryWidgetHome } from "./home-images-upload-widget";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "@/auth-client";
import { Combobox } from "../combo-box";
import { Textarea } from "@/components/ui/textarea";

interface AdopterProfile {
    name: string,
    email: string,
    phoneNumber: string,
    location: string,
    adoptionProfile: {
        image: string[]
        age: boolean
        home_situation: string
        outside_space: string
        household_setting: string
        household_typical_activity: string
        flatmate: boolean
        allergy: boolean
        other_animals: boolean
        other_animals_info?: string
        neuter_status?: string
        lifestyle: string
        move_holiday: string
        experience: string
        agreement: boolean
        min_age: string
    }
    userId: string,
}
interface UserWithPhoneNumber {
    id: string;
    phoneNumber: string;
}

const home_situation = [
    { value: "Own", label: "Own" },
    { value: "Rented", label: "Rented" },
    { value: "Other", label: "Other" },
]
const outside_space = [
    { value: "Garden", label: "Garden" },
    { value: "Terrace/Roof", label: "Terrace/roof" },
    { value: "no", label: "No Outside Space" },
]
const household_setting = [
    { value: "City", label: "City" },
    { value: "Suburban", label: "Suburban" },
    { value: "Rural", label: "Rural" },
]
const household_typical_activity = [
    { value: "Busy", label: "Busy/Noisy" },
    { value: "Moderate", label: "Moderate guests visits" },
    { value: "Quiet", label: "Quiet with ocassional guests" },
]
const flatmate = [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
]
const neuter_status = [
    { value: "Neutered", label: "Neutered" },
    { value: "Not neutered", label: "Not neutered" },
    { value: "Pending", label: "Pending" },
]


export default function AdopterProfileForm() {

    const router = useRouter();
    const { data: session } = useSession();
    const { id } = useParams();
    const user = session?.user;
    const [pending, setPending] = useState(false);
    const [loading, setLoading] = useState(true);
    const [adopterProfile, setAdopterProfile] = useState<AdopterProfile>();
    const [isDeleting, setIsDeleting] = useState(false);
    const [checkPhn, setCheckPhn] = useState<UserWithPhoneNumber | null>();

    useEffect(() => {
        const fetchAdopterProfile = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/adoption-profile?id=${id}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setAdopterProfile(data);
            } catch (error) {
                console.error("Error fetching adopter details:", error);
                toast({ title: "Error", description: "Failed to load your adopter profile." });
            } finally {
                setLoading(false);
            }
        };
        fetchAdopterProfile();
    }, [id]);
    console.log(adopterProfile);

    const form = useForm<TAdopterProfileSchema>({
        resolver: zodResolver(adopterProfileSchema),
        defaultValues: {
            name: "",
            email: user?.email,
            phoneNumber: "",
            location: "",
            image: [],
            age: false,
            home_situation: "",
            outside_space: "",
            household_setting: "",
            household_typical_activity: "",
            userId: user?.id || "",
            min_age: "",
            flatmate: false,
            allergy: false,
            other_animals: false,
            other_animals_info: "",
            neuter_status: "",
            lifestyle: "",
            move_holiday: "",
            experience: "",
            agreement: false,
        }
    });
    const phoneNumber = form.watch("phoneNumber");

    useEffect(() => {
        if (!phoneNumber) return; 

        const fetchPhoneNumber = async () => {
            try {
                const response = await fetch(`/api/getPhoneNumbers?phn=${phoneNumber}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setCheckPhn(data);
            } catch (error) {
                console.error("Error fetching user with phone number:", error);
                toast({
                    title: "Error",
                    description: "Failed to check phone number availability.",
                    variant: "destructive",
                });
            }
        };

        fetchPhoneNumber();
    }, [phoneNumber]);

    useEffect(() => {
        if (adopterProfile && user) {
            form.reset({
                name: user.name || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                location: user.location || "",
                image: adopterProfile.adoptionProfile?.image || [],
                age: adopterProfile.adoptionProfile?.age || false,
                userId: user.id,
                home_situation: adopterProfile.adoptionProfile?.home_situation || "",
                outside_space: adopterProfile.adoptionProfile?.outside_space || "",
                household_setting: adopterProfile.adoptionProfile?.household_setting || "",
                household_typical_activity: adopterProfile.adoptionProfile?.household_typical_activity || "",
                min_age: adopterProfile.adoptionProfile?.min_age || "",
                flatmate: adopterProfile.adoptionProfile?.flatmate || false,
                allergy: adopterProfile.adoptionProfile?.allergy || false,
                other_animals: adopterProfile.adoptionProfile?.other_animals || false,
                other_animals_info: adopterProfile.adoptionProfile?.other_animals_info || "",
                neuter_status: adopterProfile.adoptionProfile?.neuter_status || "",
                lifestyle: adopterProfile.adoptionProfile?.lifestyle || "",
                move_holiday: adopterProfile.adoptionProfile?.move_holiday || "",
                experience: adopterProfile.adoptionProfile?.experience || "",
                agreement: adopterProfile.adoptionProfile?.agreement || false,
            });
        }
    }, [adopterProfile, user, form]);

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

    const { openWidget } = useSignedCloudinaryWidgetHome(handleUpload);

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

    async function onsubmit(values: TAdopterProfileSchema) {
        setPending(true);
        console.log("Submitting profile:", values);

        if (checkPhn && checkPhn.id !== id) {
            toast({
                title: "Phone number is already in use",
                description: "Please enter a different phone number.",
                variant: "destructive",
            });
            setPending(false);
            return; // Prevent form submission
        }


        try {
            const response = await fetch('/api/adoption-profile', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })
            console.log("API Response:", response);

            if (!response.ok) {
                throw new Error(`Failed to update adopter profile.`);
            }
            toast({
                title: "Adoption Profile updated!",
                description: "",
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
        }
    }

    return (
        <main className="m-5">
            <div className="max-w-6xl mx-auto">
                <CardHeader className="flex items-center justify-center">
                    <CardTitle>Additional Information</CardTitle>
                    <CardDescription>Please fill out this form carefully to apply for pet adoption. This helps shelters learn about the home you’ll provide and ensures the best match for both you and the pet.
                        Your details will help the shelter decide on your application. Thank you for giving a pet a loving home! <br /><br /> <span style={{ color: 'red' }}>Please fill this form only if you are above 18 years old. If you are below 18, make an adult fill this form.</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-4">
                            <div className=" flex flex-col space-y-4">
                                <h2 className="font-bold">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Full Name:<span style={{ color: 'red' }}> *</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Phone number:<span style={{ color: 'red' }}> *</span></FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Mobile number: 9800000000" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="age"
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
                                <h2 className="font-bold">Home Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <FormField
                                        control={form.control}
                                        name="home_situation"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Please choose your home situation:<span style={{ color: 'red' }}> *</span></FormLabel>
                                                <FormControl>
                                                    <Combobox
                                                        options={home_situation}
                                                        placeholder="Select an option..."
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
                                        name="outside_space"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Please choose any outside space available in your home:<span style={{ color: 'red' }}> *</span></FormLabel>
                                                <FormControl>
                                                    <Combobox
                                                        options={outside_space}
                                                        placeholder="Select an option..."
                                                        selectedValue={field.value}
                                                        onSelect={(value) => field.onChange(value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <FormField
                                        control={form.control}
                                        name="household_setting"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Please choose your household setting:<span style={{ color: 'red' }}> *</span></FormLabel>
                                                <FormControl>
                                                    <Combobox
                                                        options={household_setting}
                                                        placeholder="Select an option..."
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
                                        name="household_typical_activity"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Please choose the usual activity in your home:<span style={{ color: 'red' }}> *</span></FormLabel>
                                                <FormControl>
                                                    <Combobox
                                                        options={household_typical_activity}
                                                        placeholder="Select an option..."
                                                        selectedValue={field.value}
                                                        onSelect={(value) => field.onChange(value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <p className="text-primary font-bold">Please upload 2 to 4 images of your home or any outside space to help the shelter visualize the home you are offering the pet. </p>

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
                                                <h3 className="text-sm font-medium">Add New Images:</h3>
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
                                <h2 className="font-bold">Family Members</h2>
                                <FormField
                                    control={form.control}
                                    name="min_age"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col w-1/2">
                                            <FormLabel>Age of the youngest child:<span style={{ color: 'red' }}> *</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter the age or 'No' if there is no child in home" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                    <FormField
                                        control={form.control}
                                        name="flatmate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Do you have any flatmate/lodgers?<span style={{ color: 'red' }}> *</span></FormLabel>
                                                <FormControl>
                                                    <Combobox
                                                        options={flatmate}
                                                        placeholder="Select an option..."
                                                        selectedValue={field.value?.toString()}
                                                        onSelect={(value) => field.onChange(value === "true")}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="allergy"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Does anyone in your home have any allergies to pets?<span style={{ color: 'red' }}> *</span></FormLabel>
                                                <FormControl>
                                                    <Combobox
                                                        options={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]}
                                                        placeholder="Select an option..."
                                                        selectedValue={field.value?.toString()}
                                                        onSelect={(value) => field.onChange(value === "true")}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="other_animals"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Do you have any other pets?<span style={{ color: 'red' }}> *</span></FormLabel>
                                                <FormControl>
                                                    <Combobox
                                                        options={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]}
                                                        placeholder="Select an option..."
                                                        selectedValue={field.value?.toString()}
                                                        onSelect={(value) => field.onChange(value === "true")}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {form.watch("other_animals") && form.watch("other_animals") === true && (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name="other_animals_info"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col ">
                                                    <FormLabel>Enter details of other pets such as numbers of pets and their species:<span style={{ color: 'red' }}> *</span></FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="e.g. 2 dogs, 1 cat" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="neuter_status"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <FormLabel>Other pets' neuter status? <span style={{ color: 'red' }}> *</span></FormLabel>
                                                    <FormControl>
                                                        <Combobox
                                                            options={neuter_status}
                                                            placeholder="Select an option..."
                                                            selectedValue={field.value?.toString()}
                                                            onSelect={(value) => field.onChange(value)}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}
                                <h2 className="font-bold">Life Style and Commitment</h2>

                                <FormField
                                    control={form.control}
                                    name="lifestyle"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Do you have plenty of time to care for the pet? Please tell us about your lifestyle (work pattern/time at home)<span style={{ color: 'red' }}> *</span></FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Describe your lifestyle..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="move_holiday"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Are you planning to move or go on holiday soon? If so, have you taken this into consideration with adopting your new pet?<span style={{ color: 'red' }}> *</span></FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Describe your plans..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="experience"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Please describe your experience of any previous pet ownership and tell us about the type of home you plan to offer your new pet<span style={{ color: 'red' }}> *</span></FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Describe your experience..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="agreement"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Has everyone in the home agreed to this adoption?<span style={{ color: 'red' }}> *</span></FormLabel>
                                            <FormControl>
                                                <Combobox
                                                    options={[{ label: "Yes", value: "true" }, { label: "No", value: "false" }]}
                                                    placeholder="Select an option..."
                                                    selectedValue={field.value?.toString()}
                                                    onSelect={(value) => field.onChange(value === "true")}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                            <div className="flex justify-center w-1/12">
                                <LoadingButton pending={pending}>
                                    Submit
                                </LoadingButton>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </div>
        </main>
    )
}