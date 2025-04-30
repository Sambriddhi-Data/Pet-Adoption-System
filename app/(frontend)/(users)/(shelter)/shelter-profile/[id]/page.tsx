'use client';

import { useSession } from "@/auth-client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { shelterInformationSchema, TShelterInformation } from "../../shelter-information";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSignedCloudinaryWidgetLogo } from "../../../_components/shelters/(form)/custom-widget";
import { API_ROUTES } from "@/lib/apiRoutes";

interface ShelterInfo {
  shelterDesc?: string;
  khaltiSecret?: string | null;
  user: {
    name: string;
    location?: string;
    phoneNumber?: string;
    email?: string;
    image?: string;
  };
}

interface UserWithPhoneNumber {
  id: string;
  phoneNumber: string;
}

export default function ShelterProfile() {
  const { id } = useParams();
  const [shelterInfo, setShelterInfo] = useState<ShelterInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [checkPhn, setCheckPhn] = useState<UserWithPhoneNumber | null>();
  const [maskedKhaltiSecret, setMaskedKhaltiSecret] = useState<string | null>(null);

  const fetchShelterInfo = async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/getShelterInfo?shelterId=${id}`);
      const data: ShelterInfo = await response.json();
      setShelterInfo(data);

      // Fetch the masked khalti secret
      if (data.khaltiSecret) {
        const secretResponse = await fetch(`/api/getMaskedKhaltiSecret?shelterId=${id}`);
        const secretData = await secretResponse.json();
        setMaskedKhaltiSecret(secretData.maskedSecret);
      }
    } catch (error) {
      console.error("Error fetching shelter info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelterInfo();
  }, [id]);

  const form = useForm<TShelterInformation>({
    resolver: zodResolver(shelterInformationSchema),
    defaultValues: {
      userId: id as string || "",
      name: shelterInfo?.user.name || "",
      location: shelterInfo?.user.location || "",
      phoneNumber: shelterInfo?.user.phoneNumber || "",
      email: shelterInfo?.user.email || "",
      image: shelterInfo?.user.image || "",
      shelterDesc: shelterInfo?.shelterDesc || "",
      khaltiSecret: ""
    },
  })

  useEffect(() => {
    if (shelterInfo) {
      form.reset({
        userId: id as string || "",
        name: shelterInfo.user.name || "",
        location: shelterInfo.user.location || "",
        phoneNumber: shelterInfo.user.phoneNumber || "",
        email: shelterInfo.user.email || "",
        image: shelterInfo.user.image || "",
        shelterDesc: shelterInfo.shelterDesc || "",
        khaltiSecret: ""
      });
    }
  }, [shelterInfo, form]);

  const phoneNumber = form.watch("phoneNumber");

  useEffect(() => {
    if (!phoneNumber) return;

    const fetchPhoneNumber = async () => {
      try {
        const response = await fetch(API_ROUTES.getPhoneNumbers(phoneNumber));
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

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      const uploadedUrl = result.info.secure_url;
      form.setValue("image", uploadedUrl, { shouldValidate: true });

      toast({
        title: "Image Uploaded",
        description: "Your image has been uploaded successfully!",
        variant: "success",
      });
    }
  };


  const { openWidget } = useSignedCloudinaryWidgetLogo(handleUpload);

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
  const handleRemoveImage = async (imageUrl: string) => {
    if (!imageUrl.includes('blob:')) {
      await deleteImageFromCloudinary(imageUrl);
    }

    // Clear the image from the form
    form.setValue("image", "", { shouldValidate: true });
  };

  console.log("Form", form.getValues())
  console.log(form.formState.errors)



  async function onsubmit(values: TShelterInformation) {
    setPending(true);
    if (checkPhn && checkPhn.id !== id) {
      form.setError("phoneNumber", {
        type: "manual",
        message: "This phone number is already in use. Please enter a different one.",
      });

      toast({
        title: "Phone number is already in use",
        description: "Please enter a different phone number.",
        variant: "destructive",
      });
      setPending(false);
      return; // Prevent form submission
    }
    try {
      const response = await fetch('/api/updateShelterInformation', {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      console.log("API Response:", response);

      if (!response.ok) {
        throw new Error(`Failed to update shelter information.`);
      }
      await fetchShelterInfo();
      toast({
        title: "Shelter Information Updated!",
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

    console.log("Submitted ", values);
    setPending(false);
  }

  return (
    <div className=' p-6 space-y-4'>
      <h1 className='text-2xl font-bold underline'> Shelter Information </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex items-center justify-left gap-10 border-b">
                <FormLabel className="text-md w-20 pb-1">Name</FormLabel>
                <FormControl>
                  <Input className="border-none shadow-none my-4" placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex items-center justify-left gap-10 border-b">
                <FormLabel className="text-md w-20">Email</FormLabel>
                <FormControl>
                  <p className="py-1 text-base disabled:opacity-50 md:text-sm border-none shadow-none my-4">{shelterInfo?.user.email}</p>
                  {/* <Input className="border-none shadow-none my-4" placeholder="Email" {...field} /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="flex items-center justify-left gap-10 border-b">
                <FormLabel className="text-md w-20">Address</FormLabel>
                <FormControl>
                  <Input className="border-none shadow-none my-4" placeholder="Town / City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex items-center justify-left gap-10 border-b">
                <FormLabel className="text-md w-20">Contact</FormLabel>
                <FormControl>
                  <Input className="border-none shadow-none my-4" placeholder="Mobile number: 9800000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shelterDesc"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Shelter Description:</FormLabel>
                <FormControl>
                  <Textarea className="w-[50rem]" placeholder="describe the shelter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="khaltiSecret"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Khalti secret:</FormLabel>
                <div className="space-y-2">
                  {maskedKhaltiSecret && (
                    <div className="flex items-center">
                      <span className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                        Current key: {maskedKhaltiSecret}
                      </span>
                    </div>
                  )}
                  <FormControl>
                    <Input 
                      type="password" 
                      className="w-[50rem]" 
                      placeholder={maskedKhaltiSecret ? "Enter new key to update" : "No key set - enter a key"} 
                      {...field} 
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500">
                    {maskedKhaltiSecret 
                      ? "Leave blank to keep current key, or enter a new key to update" 
                      : "Enter your Khalti secret key"}
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Logo
                </FormLabel>

                {field.value ? (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Current Logo</h3>
                    <div className="relative group w-32 h-32">
                      {field.value && (
                        <img
                          src={field.value}
                          alt="Shelter Logo"
                          className="w-32 h-32 object-cover rounded-md"
                        />
                      )}

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleRemoveImage(field.value ?? "")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-80 hover:opacity-100"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-4">No logo uploaded yet.</p>
                )}

                {/* Upload Options */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Update Logo:</h3>
                  <div>
                    <Button
                      type="button"
                      onClick={openWidget}
                      disabled={isDeleting}
                      className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md px-3 py-2 text-sm inline-block"
                    >
                      {isDeleting ? "Removing..." : "Choose Image"}
                    </Button>

                    <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center w-64">
            <LoadingButton pending={pending}>
              Update
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
