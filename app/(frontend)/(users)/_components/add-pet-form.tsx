'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import z from "zod";
import { addPetSchema } from "../(shelter)/add-pet-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CancelFormButton from "./cancel-form-button";
import { useSession } from "@/auth-client";


export default function AddPet() {
    type TAddPetForm = z.infer<typeof addPetSchema>

    const session = useSession();

    const shelter_id = session?.data?.user?.id;
    const form = useForm<TAddPetForm>({
        resolver: zodResolver(addPetSchema),
        defaultValues: {
            name: "",
            species: "",
            description: "",
            age: "",
            dominantBreed: "",
            gender: "",
            size: "",
            arrivedAtShelter: "",
            shelter_id: shelter_id,
        },
    });


    async function onSubmit(values: TAddPetForm) {
        const { data } = await axios.post('/api/animals', values);
        console.log(data);
    }

    return (
        <main className="">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="border-b">Basic Details</div>
                    <Card className="p-6">
                        <div className="flex flex-wrap justify-center gap-4 max-w-3xl">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
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
                                    <FormItem>
                                        <FormLabel>Species<span style={{ color: 'red' }}> *</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Dog/Cat" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description<span style={{ color: 'red' }}> *</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="ABC is a good boy." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
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
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender<span style={{ color: 'red' }}> *</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="3 months" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Size (when adult)<span style={{ color: 'red' }}> *</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="3 months" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Card>
                    <div className="border-b">Health</div>
                    <Card className="p-6">

                    </Card>
                    <div className="flex gap-2">
                        <CancelFormButton route="/shelter-homepage" />
                        <Button type="submit">
                            Submit
                        </Button>
                    </div>
                </form>
            </Form>

        </main>
    );
}
