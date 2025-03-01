'use client'
import React, { useEffect, useState } from 'react'
import { PetCard } from "../../_components/pet-card";
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Combobox } from '../../_components/combo-box';
import { petBasicDetailsSchema, TPetBasicDetailsForm } from '../../(shelter)/add-pet-form';

const species = [
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "rabbit", label: "Rabbit" },
    { value: "parrot", label: "Parrot" },
    { value: "others", label: "Others" },
]

const sex = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "unknown", label: "Unknown" },
]

const size = [
    { value: "small", label: "Small (0-5 kg)" },
    { value: "medium", label: "Medium (5-15 kg)" },
    { value: "large", label: "Large (15+ kg)" },
]

export default function AdoptPet() {
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPets() {
            try {
                const response = await fetch(`/api/getallPets`);
                if (!response.ok) throw new Error("Failed to fetch pets");
                const data = await response.json();
                setPets(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchPets();
    }, []);

    const form = useForm<TPetBasicDetailsForm>({
        resolver: zodResolver(petBasicDetailsSchema),
        defaultValues: {
            species: "",
            sex: "unknown",
            size: ""
        },
    });

    const onSubmit = async (values: TPetBasicDetailsForm) => {
        console.log(values); 
    };

    return (
        <main className='p-6 flex flex-col items-center justify-center '>
            <h1>Adopt a pet</h1>
            <div className='p-6 w-8/12'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Card className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 max-w-4xl">
                                <FormField
                                    control={form.control}
                                    name="species"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Species</FormLabel>
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
                                    name="sex"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Gender</FormLabel>
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
                                            <FormLabel>Size (when adult)</FormLabel>
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
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button type="submit">Search</Button>
                            </div>
                        </Card>
                    </form>
                </Form>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6'>
                {loading ? (
                    <p>Loading...</p>
                ) : pets.length > 0 ? (
                    pets.map((pet) => (
                        <PetCard
                            key={pet.id}
                            name={pet.name}
                            age={pet.age}
                            status={pet.status}
                            address={pet.address}
                        />
                    ))
                ) : (
                    <p>No available pets at the moment.</p>
                )}
            </div>
        </main>
    )
}
