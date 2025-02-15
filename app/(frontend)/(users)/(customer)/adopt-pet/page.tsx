import React from 'react'
import { PetCard } from "../../_components/pet-card";

export default async function AdoptPet() {
    const response = await fetch(`http://localhost:3000/api/getallPets`);
    const pets = await response.json();

    return (
        <>
            <h1>
                Adopt a pet
                <div className='grid grid-cols-3 gap-4 p-6 mt-6'>
                {pets.length > 0 ? (
                    pets.map((pet: any) => (
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

            </h1>
        </>
    )
}
