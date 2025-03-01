'use client';

import { useRouter } from "next/navigation";
import { PetCard } from "../pet-card";

export default function PetCardWrapper({ pet }: { pet: any }) {
    const router = useRouter();

    const handleEditPet = () => {
        router.push(`/edit-pet/${pet.id}`);
    };

    return (
        <div onClick={handleEditPet}>
            <PetCard
                name={pet.name}
                age={pet.age}
                status={pet.status}
                address={pet.address}
            />
        </div>
    );
}
