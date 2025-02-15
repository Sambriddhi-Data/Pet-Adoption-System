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

export default function LostPetCarousel() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/getallPets");
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
        <div className="relative w-full max-w-7xl"> {/* Added relative to contain navigation buttons */}
            {loading ? (
                <p>Loading pets...</p>
            ) : pets.length > 0 ? (
                <div className="relative"> {/* This ensures buttons are positioned correctly */}
                    <Carousel opts={{ align: "start", loop: true }} className="w-full">
                        <CarouselContent>
                            {pets.map((pet: any, index) => (
                                <CarouselItem key={pet.id} className="md:basis-1/2 lg:basis-1/4">
                                    <div className="p-2">
                                        <LostPetCard
                                            name={pet.name}
                                            age={pet.age}
                                            status={pet.status}
                                            address={pet.address}
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        {/* Position the navigation buttons inside the card */}
                        <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10" />
                        <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10" />
                    </Carousel>
                </div>
            ) : (
                <p>No available pets at the moment.</p>
            )}
        </div>
    );
}
