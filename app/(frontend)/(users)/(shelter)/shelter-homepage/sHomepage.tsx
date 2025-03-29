"use client";

import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import PetCardWrapper from "../../_components/shelters/pet-card-wrapper";
import { Button } from "@/components/ui/button";

const PETS_PER_PAGE = 12;


const ShelterHomepagePets = ({ shelterId }: { shelterId: string }) => {
    const [loading, setLoading] = useState(true);
    const [pets, setPets] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!shelterId) return;

        const fetchAllPets = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/getPet?shelterId=${shelterId}`);
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
        fetchAllPets();
    }, [shelterId]);

    if (!shelterId) {
        toast({
            title: "Error",
            description: "Shelter ID not found. Please try again.",
        });
        return null;
    }

    // Pagination logic
    const indexOfLastPet = currentPage * PETS_PER_PAGE;
    const indexOfFirstPet = indexOfLastPet - PETS_PER_PAGE;
    const currentPets = pets.slice(indexOfFirstPet, indexOfLastPet);
    const totalPages = Math.ceil(pets.length / PETS_PER_PAGE);

    return (
        <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {loading ? (
                    <p className="col-span-full text-gray-500">Loading pets...</p>
                ) : pets && currentPets.length > 0 ? (
                    currentPets.map((pet: any) => (
                        <PetCardWrapper key={pet.id} pet={pet} />
                    ))
                ) : (
                    <p className="col-span-full text-gray-500">No available pets at the moment.</p>
                )}
            </div>
            <div className='flex justify-center mt-6 space-x-2'>
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Previous</Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</Button>
            </div>
        </main>
    );
};

export default ShelterHomepagePets;
