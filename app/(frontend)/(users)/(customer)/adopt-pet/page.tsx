'use client'
import React, { useEffect, useState } from 'react';
import { PetCard } from "../../_components/pet-card";
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Combobox } from '../../_components/combo-box';
import { searchPetsSchema, TSearchPetsForm } from '../../(shelter)/search-pet';
import { BCombobox } from '../../_components/breed-combo-box';
import { useRouter } from 'next/navigation';
import PetCardWrap from '../../_components/pet-card-wrap';
import PetLoading from '@/components/pet-card-skeleton';
import axios from 'axios';

const species = [
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Rabbit", label: "Rabbit" },
    { value: "Bird", label: "Bird" },
    { value: "Others", label: "Others" },
];

const sex = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Unknown", label: "Unknown" },
];

const sizeOptions: Record<string, { value: string; label: string }[]> = {
    dog: [
        { value: "small", label: "Small (0-5 kg)" },
        { value: "medium", label: "Medium (5-15 kg)" },
        { value: "large", label: "Large (15+ kg)" },
    ],
    cat: [
        { value: "small", label: "Small (0-4 kg)" },
        { value: "medium", label: "Medium (4-6 kg)" },
        { value: "large", label: "Large (6+ kg)" },
    ],
    rabbit: [
        { value: "mini", label: "Mini (0-1.5 kg)" },
        { value: "small", label: "Small (1.5-2.5 kg)" },
        { value: "medium", label: "Medium (2.5-4 kg)" },
        { value: "large", label: "Large (4+ kg)" },
    ],
    bird: [
        { value: "small", label: "Small (0-50 g)" },
        { value: "medium", label: "Medium (50-300 g)" },
        { value: "large", label: "Large (300+ g)" },
    ],
    others: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
    ],
};

const dominantBreed = [
    { value: "labrador", label: "Labrador Retriever" },
    { value: "golden_retriever", label: "Golden Retriever" },
    { value: "german_shepherd", label: "German Shepherd" },
    { value: "bulldog", label: "Bulldog" },
    { value: "beagle", label: "Beagle" },
    { value: "poodle", label: "Poodle" },
    { value: "rottweiler", label: "Rottweiler" },
    { value: "siberian_husky", label: "Siberian Husky" },
    { value: "doberman", label: "Doberman" },
    { value: "shih_tzu", label: "Shih Tzu" },
    { value: "chow_chow", label: "Chow Chow" },
    { value: "border_collie", label: "Border Collie" },
    { value: "dachshund", label: "Dachshund" },
    { value: "pomeranian", label: "Pomeranian" },
    { value: "boxer", label: "Boxer" },
    { value: "dalmatian", label: "Dalmatian" },
    { value: "bhotia", label: "Bhotia (Himalayan Sheepdog)" },
    { value: "tibetan_mastiff", label: "Tibetan Mastiff" },
    { value: "kathmandu_street_dog", label: "Kathmandu Street Dog" },
    { value: "mixed", label: "Mixed Breed" },
    { value: "unknown", label: "Unknown Breed" }
];

const PETS_PER_PAGE = 12;

export default function AdoptPet() {
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const form = useForm<TSearchPetsForm>({
        resolver: zodResolver(searchPetsSchema),
        defaultValues: {
            species: "",
            sex: "",
            dominantBreed: "",
            size: "",
        },
    });

    // Fetch all pets on component mount
    useEffect(() => {
        const fetchAllPets = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/getallPets');
                if (response.status !== 200) {
                    throw new Error("Failed to fetch pets");
                }
                const data = response.data;
                setPets(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllPets();
    }, []);

    const router = useRouter();

    const onSubmit = async (values: TSearchPetsForm) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (values.species) queryParams.append('species', values.species);
            if (values.sex) queryParams.append('sex', values.sex);
            if (values.size) queryParams.append('size', values.size);
            if (values.dominantBreed) queryParams.append('dominantBreed', values.dominantBreed);

            const response = await fetch(`/api/getallPets?${queryParams.toString()}`);
            if (!response.ok) throw new Error("Failed to fetch pets");
            const data = await response.json();
            setPets(data);
            setCurrentPage(1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const speciesValue = form.watch("species");

    // Pagination logic
    const indexOfLastPet = currentPage * PETS_PER_PAGE;
    const indexOfFirstPet = indexOfLastPet - PETS_PER_PAGE;
    const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
    const totalPages = Math.ceil(pets.length / PETS_PER_PAGE);

    // Disable search button if no filters are applied
    const isSearchDisabled = !form.watch("species") && !form.watch("sex") && !form.watch("size") && !form.watch("dominantBreed");

    return (
        <main className='p-6 flex flex-col items-center justify-center '>
            <h1>Adopt a pet</h1>
            <div className='p-6'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <Card className="p-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center max-w-5xl">
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
                                                    options={speciesValue ? sizeOptions[speciesValue] || sizeOptions.others : []}
                                                    placeholder="Select size..."
                                                    selectedValue={field.value}
                                                    onSelect={(value) => field.onChange(value)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {speciesValue === "Dog" && (
                                    <FormField
                                        control={form.control}
                                        name="dominantBreed"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Breed</FormLabel>
                                                <FormControl>
                                                    <BCombobox
                                                        options={dominantBreed}
                                                        placeholder="Select breed..."
                                                        selectedValue={field.value}
                                                        onSelect={(value) => field.onChange(value)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>
                        </Card>
                        <div className="flex gap-2 justify-end">
                            <Button type="submit" disabled={isSearchDisabled}>Search</Button>
                        </div>
                    </form>
                </Form>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6'>
                {currentPets.length > 0 ? (
                    currentPets.map((pet) => (
                        <PetCardWrap key={pet.id} pet={pet} />

                    ))
                ) : (
                    <div className="col-span-full">
                        <p className="text-gray-500 text-center">No pets available for adoption that match your preferences. Try other filters!</p>
                    </div>)}
            </div>
            {currentPets.length !== 0 && (
                <div className='flex justify-center mt-6 space-x-2'>
                    <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Previous</Button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</Button>
                </div>)}
        </main>
    );
}