'use client';

import { useRouter } from "next/navigation";
import { PetCard } from "../pet-card";

export default function PetCardWrapper({ pet }: { pet: any }) {
    const router = useRouter();

    const handleEditPet = () => {
        router.push(`/pet-details/${pet.id}`);
    };

    return (
        <div onClick={handleEditPet}>
            <PetCard
            id={pet.id}
                name={pet.name}
                age={pet.age}
                status={pet.status}
                images={pet.image}
                address={pet.address}
            />
        </div>
    );
}
