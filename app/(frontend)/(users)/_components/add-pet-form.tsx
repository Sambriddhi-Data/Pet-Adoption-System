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

export default function AddPet() {
    type TAddPetForm = z.infer<typeof addPetSchema>

    const form = useForm<TAddPetForm>({
        resolver: zodResolver(addPetSchema),
        defaultValues: {
            name: "",
            species: "",
            description: "",
        },
    });

    async function onSubmit(values: TAddPetForm) {
        const { data } = await axios.post('/api/animals', values);
        console.log(data);
    }

    return (
        <main className="p-6 space-y-4">
            <Card className="p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-wrap gap-2">

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
                                    <Input placeholder="Enter species" {...field} />
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
                                    <Input placeholder="Enter description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </div>
                    <Button type="submit">
                        Submit
                    </Button>
                </form>
            </Form>
            </Card>

        </main>
    );
}
