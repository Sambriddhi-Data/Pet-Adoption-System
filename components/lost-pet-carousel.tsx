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
        <div className="w-full max-w-7xl mx-auto px-4">
            {loading ? (
                <p>Loading pets...</p>
            ) : pets.length > 0 ? (
                <div className="relative">
                    <Carousel 
                        opts={{
                            align: "center",
                            loop: true,
                            slidesToScroll: 1,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="">
                            {pets.map((pet: any) => (
                                <CarouselItem key={pet.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                                    <div className="p-1">
                                        <LostPetCard
                                            name={pet.name}
                                            address={pet.location}
                                            phoneNumber={pet.phoneNumber}
                                            image={pet.image}
                                            status={pet.status}
                                            onClick={() => {
                                                setSelectedPet(pet);
                                                setIsOpen(true);
                                            }}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="flex justify-center mt-4">
                            <CarouselPrevious className="relative mr-2" />
                            <CarouselNext className="relative ml-2" />
                        </div>
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
                    status={selectedPet.status}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}