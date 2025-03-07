"use client";

import React, { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { LostPetCard } from "@/app/(frontend)/(users)/_components/lost-pet-card";
import LostPetModal from "@/app/(frontend)/(users)/_components/lost-pet-modal";
import { Pet } from "@/app/(frontend)/(users)/_components/type";

export default function LostPetCarousel() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/getLostPets");
                const data = await response.json();
                setPets(data);
            } catch (error) {
                console.error("Error fetching pets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    return (
        <div className="relative w-full max-w-7xl">
            {loading ? (
                <p>Loading pets...</p>
            ) : pets.length > 0 ? (
                <div className="relative">
                    <Carousel opts={{
                        align: "start",
                        loop: true,
                        containScroll: "trimSnaps",
                    }}
                        className="w-full">
                        <CarouselContent className=" flex w-full max-w-7xl justify-center mx-auto">
                            {pets.map((pet: any) => (
                                <CarouselItem key={pet.id} className="md:basis-1/2 lg:basis-1/4 flex-shrink-0">
                                    <div className="p-2 ml-1">
                                        <LostPetCard
                                            name={pet.name}
                                            address={pet.location}
                                            phoneNumber={pet.phoneNumber}
                                            image={pet.image}
                                            onClick={() => {
                                                setSelectedPet(pet);
                                                setIsOpen(true);
                                            }}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10" />
                        <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10" />
                    </Carousel>
                </div>
            ) : (
                <p>No available pets at the moment.</p>
            )}

            {isOpen && selectedPet && (
                <LostPetModal
                    name={selectedPet.name}
                    image={selectedPet.image}
                    address={selectedPet.location}
                    phoneNumber={selectedPet.phoneNumber}
                    description={selectedPet.description}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}