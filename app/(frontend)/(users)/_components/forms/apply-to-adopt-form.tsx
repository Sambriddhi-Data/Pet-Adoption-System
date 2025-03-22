'use client';

import { useSession } from "@/auth-client";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { applyToAdoptSchema, TApplyToAdoptFormSchema } from "./customer-form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/loading-button";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export const ApplyToAdoptForm = ({ closeForm }: { closeForm: () => void })=> {
    const { data: session } = useSession();
    const {petId}  = useParams()
    const [pending, setPending] = useState(false);
    const router = useRouter();

    const form = useForm<TApplyToAdoptFormSchema>({
        resolver: zodResolver(applyToAdoptSchema),
        defaultValues: {
            message: "",
            userId: session?.user?.id,
        }
    })
    console.log(petId);

    async function onsubmit(values: TApplyToAdoptFormSchema) {
        setPending(true);
        try {
            const response = await fetch(`/api/adoptionApplication?petId=${petId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })
            console.log("API Response:", response);

            if (!response.ok) {
                throw new Error(`Failed to apply for adoption.`);
            }
            toast({
                title: "Adoption Application Sent!",
                description: `You have successfully applied for adoption`,
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
        closeForm();
    }
    return (
        <main>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormControl>
                                    <Textarea placeholder="personal message..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <LoadingButton pending={pending}>
                        Confirm Application
                    </LoadingButton>
                </form>
            </Form>
            <Button className="w-full mt-4" onClick={() => router.push("/adopt-pet")}>Find another Pet to Adopt</Button>
        </main>
    )

}

