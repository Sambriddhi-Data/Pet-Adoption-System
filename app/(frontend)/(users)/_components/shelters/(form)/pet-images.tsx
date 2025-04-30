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

import { useCallback, useState } from 'react';
import { useSignedCloudinaryWidget } from "./custom-widget";

interface FormsProps {
    isEditing: boolean;
}

export default function AddPetImages({ isEditing }: FormsProps) {
    const { nextStep, prevStep, formData, setPetImages } = usePetRegistrationStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const form = useForm<TPetImagesForm>({
        resolver: zodResolver(petImagesForm),
        defaultValues: {
            ...formData.petImages,
        },
        mode: 'onChange',
    });


    // Function to resize image before upload
    const resizeImage = (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            setIsResizing(true);

            // Max dimensions
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 1200;
            const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

            if (file.size <= MAX_FILE_SIZE) {
                setIsResizing(false);
                return resolve(file);
            }

            const image = new Image();
            const reader = new FileReader();

            reader.onload = (readerEvent) => {
                image.onload = () => {
                    let width = image.width;
                    let height = image.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = Math.round(height * (MAX_WIDTH / width));
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = Math.round(width * (MAX_HEIGHT / height));
                            height = MAX_HEIGHT;
                        }
                    }

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');

                    if (!ctx) {
                        setIsResizing(false);
                        return reject(new Error('Could not get canvas context'));
                    }

                    ctx.drawImage(image, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (!blob) {
                            setIsResizing(false);
                            return reject(new Error('Could not create blob'));
                        }

                        const resizedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });

                        setIsResizing(false);
                        resolve(resizedFile);
                    }, 'image/jpeg', 0.75);
                };

                image.src = readerEvent.target?.result as string;
            };

            reader.onerror = (error) => {
                setIsResizing(false);
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    };

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

    // CloudinaryUpload success handler
    const handleUpload = async (result: any) => {
        if (result.event === "success") {
            // Add the new image URL to the form
            const currentImages = form.getValues("image") || [];
            form.setValue("image", [...currentImages, result.info.secure_url], { shouldValidate: true });

            // Update the store with the new image list
            setPetImages({
                image: [...currentImages, result.info.secure_url]
            });

            toast({
                title: "Image Uploaded",
                description: `Image uploaded successfully (${Math.round(result.info.bytes / 1024)} KB)!`,
                variant: "success",
            });
        }
    };
    const { openWidget } = useSignedCloudinaryWidget(handleUpload);

    // Custom file input handler with resize capability
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        try {
            const file = e.target.files[0];

            // Check file type
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                toast({
                    title: "Invalid File Type",
                    description: "Please upload only JPG or PNG images.",
                    variant: "destructive",
                });
                return;
            }

            // Check initial size
            const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
            if (file.size > MAX_UPLOAD_SIZE) {
                toast({
                    title: "File Too Large",
                    description: `Image exceeds 5MB limit. Attempting to resize...`,
                    variant: "default",
                });
            }

            // Resize if needed
            const processedFile = file.size > 1 * 1024 * 1024 ? await resizeImage(file) : file;

            // Get signed upload params
            const signResponse = await fetch('/api/cloudinary/sign');
            const { signature, timestamp, api_key } = await signResponse.json();

            // Create FormData for upload
            const formData = new FormData();
            formData.append('file', processedFile);
            formData.append('api_key', api_key);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);
            formData.append('folder', 'pet_images');

            toast({
                title: "Uploading",
                description: "Uploading image to server...",
                variant: "default",
            });

            const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/dasa1mcpz/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await uploadResponse.json();

            if (data.secure_url) {
                const currentImages = form.getValues("image") || [];
                const newImages = [...currentImages, data.secure_url];

                form.setValue("image", newImages, { shouldValidate: true });
                setPetImages({ image: newImages });

                toast({
                    title: "Image Uploaded",
                    description: `Image uploaded successfully (${Math.round(data.bytes / 1024)} KB)!`,
                    variant: "success",
                });
            } else {
                throw new Error(data.error?.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast({
                title: "Upload Failed",
                description: "There was an error uploading your image.",
                variant: "destructive",
            });
        }

        e.target.value = '';
    };

    const onSubmit = async (values: TPetImagesForm) => {
        try {
            // Update store with form data
            setPetImages({
                ...values,
            });

            if (!isEditing) {
                nextStep();
            } else {
                toast({
                    title: "Images Updated",
                    description: "Image list has been updated.",
                    variant: "success",
                });
            }
        }
        catch (error: any) {
            console.error("Validation error:", error);
            toast({
                title: "Error",
                description: "Please check all required fields.",
                variant: "destructive",
            });
        }
    }

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
        setPetImages({ image: newImages });
    };

    return (
        <main>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="border-b">Pet Images</div>
                    <Card className="p-6">
                        <div className="grid grid-cols-1 gap-4 lg:w-[56rem] max-w-4xl">
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
                                            <h3 className="text-sm font-medium">Add New Images</h3>

                                            {/* Option 1: Custom Signed Upload
                                            <div>
                                                <p className="text-sm text-gray-500 mb-2">
                                                    Upload and auto-resize (recommended):
                                                </p>
                                                <label
                                                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-md px-3 py-2 text-sm inline-block"
                                                >
                                                    {isResizing ? "Processing..." : "Browse Files"}
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg,image/png"
                                                        onChange={handleFileSelect}
                                                        className="hidden"
                                                        disabled={isResizing || isDeleting}
                                                    />
                                                </label>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Max size: 5MB. Large images will be automatically resized.
                                                </p>
                                            </div> */}

                                            {/* Option 2: Cloudinary Widget */}
                                            <div>
                                                {/* <p className="text-sm text-gray-500 mb-2">
                                                    Or use Cloudinary widget:
                                                </p>
                                                <CldUploadButton
                                                    uploadPreset="ffe_upload"
                                                    onSuccess={handleUpload}
                                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md px-3 py-2 text-sm inline-block"
                                                    options={{
                                                        maxFiles: 5,
                                                        maxFileSize: 5000000, // 5MB
                                                        clientAllowedFormats: ["jpg", "jpeg", "png"],
                                                        sources: ["local", "camera", "url", "google_drive"],
                                                        resourceType: "image",
                                                    }}
                                                >
                                                    Upload with Cloudinary
                                                </CldUploadButton> */}

                                                {/* Option 3: Custom Cloudinary Widget */}
                                                <Button
                                                    type="button"
                                                    onClick={openWidget}
                                                    className=" mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md px-3 py-2 text-sm inline-block"
                                                >
                                                    {isDeleting ? "Removing..." : "Choose Images"}
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
                        </div>
                    </Card>

                    <div className="flex gap-2 justify-end">
                        {!isEditing && (
                            <>
                                <CancelFormButton route="/shelter-homepage" />
                                <Button onClick={prevStep} disabled={isResizing || isDeleting}>
                                    Previous
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isResizing || isDeleting}
                                >
                                    Next
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </Form>
        </main>
    );
}