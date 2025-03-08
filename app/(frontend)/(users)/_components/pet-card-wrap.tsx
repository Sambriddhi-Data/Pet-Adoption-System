'use client';

import { useRouter } from "next/navigation";
import { PetCard } from "./pet-card";

export default function PetCardWrap({ pet }: { pet: any }) {
    const router = useRouter();

    const handleEditPet = () => {
        router.push(`/pets/${pet.id}`);
    };

    return (
        <div onClick={handleEditPet}>
            <PetCard
                name={pet.name}
                age={pet.age}
                status={pet.status}
                address={pet.shelter?.user?.location}
                images={pet.image}
            />
        </div>
    );
}
