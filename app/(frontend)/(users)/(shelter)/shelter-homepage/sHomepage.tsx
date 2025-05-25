"use client";

import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import PetCardWrapper from "../../_components/shelters/pet-card-wrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Check, ChevronsUpDown } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

const PETS_PER_PAGE = 12;

const statuses = [
    { label: "Available", value: "available" },
    { label: "Adopted", value: "adopted" },
    { label: "Reserved", value: "reserved" },
    { label: "Rainbow", value: "rainbow" },
]

const ShelterHomepagePets = ({ shelterId }: { shelterId: string }) => {
    const [loading, setLoading] = useState(true);
    const [pets, setPets] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

    useEffect(() => {
        if (!shelterId) return;
        fetchAllPets();
    }, [shelterId, selectedStatuses]); // Added selectedStatuses as dependency

    const fetchAllPets = async () => {
        setLoading(true);
        try {
            // Build status parameter string similar to rehoming.tsx
            const statusParams = selectedStatuses.length > 0
                ? selectedStatuses.map(status => `&status=${status}`).join('')
                : '';
                
            const response = await fetch(`/api/getPet?shelterId=${shelterId}${statusParams}`);
            if (!response.ok) throw new Error("Failed to fetch pets");

            const data = await response.json();
            console.log("API Response:", data);

            setPets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setPets([]);
        } finally {
            setLoading(false);
        }
    };

    if (!shelterId) {
        toast({
            title: "Error",
            description: "Shelter ID not found. Please try again.",
        });
        return null;
    }
    
    const handleStatusChange = (status: string) => {
        setSelectedStatuses(prev => {
            if (prev.includes(status)) {
                // Remove status if already selected
                return prev.filter(s => s !== status);
            } else {
                // Add status if not selected
                return [...prev, status];
            }
        });
        // Reset to page 1 when filters change
        setCurrentPage(1);
    };

    const StatusFilter = () => {
        const [open, setOpen] = useState(false)

        return (
            <div className="mt-2 space-y-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between text-primary"
                        >
                            {selectedStatuses.length === 0
                                ? "All Statuses"
                                : `${selectedStatuses.length} selected`}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search status..." />
                            <CommandList>
                                <CommandEmpty>No status found.</CommandEmpty>
                                <CommandGroup>
                                    {statuses.map((status) => (
                                        <CommandItem
                                            key={status.value}
                                            onSelect={() => handleStatusChange(status.value)}
                                            className="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                checked={selectedStatuses.includes(status.value)}
                                                className="h-4 w-4"
                                                onCheckedChange={() => { }}
                                            />
                                            <span>{status.label}</span>
                                            {selectedStatuses.includes(status.value) && (
                                                <Check className="ml-auto h-4 w-4" />
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        )
    }


    // Pagination logic
    const indexOfLastPet = currentPage * PETS_PER_PAGE;
    const indexOfFirstPet = indexOfLastPet - PETS_PER_PAGE;
    const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
    const totalPages = Math.ceil(pets.length / PETS_PER_PAGE);

    return (
        <main>
            <Card className="w-full max-w-xs mx-auto md:w-72 p-4 mt-4 bg-primary text-white ">
                <h1>Filter With Status</h1>
                <StatusFilter />
            </Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
                {loading ? (
                    <p className="col-span-full text-center text-gray-500">Loading pets...</p>
                ) : pets && currentPets.length > 0 ? (
                    currentPets.map((pet: any) => (
                        <PetCardWrapper key={pet.id} pet={pet} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">No available pets at the moment.</p>
                )}
            </div>
            {currentPets.length !== 0 && (
                <div className='flex justify-center mt-6 space-x-2'>
                    <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Previous</Button>
                    <span className="flex items-center">Page {currentPage} of {Math.max(1, totalPages)}</span>
                    <Button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</Button>
                </div>)}
        </main>
    );
};

export default ShelterHomepagePets;
