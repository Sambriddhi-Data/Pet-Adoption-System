import { auth } from "@/auth";
import { headers } from "next/headers";
import InfoCard from '../../_components/shelters/info-card';
import AddPetButton from '../../_components/shelters/(form)/add-pet-button';
import { getpetcount } from '@/actions/getpetcount';
import { toast } from '@/hooks/use-toast';
import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { redirect } from "next/navigation";
import PetCardWrapper from "../../_components/shelters/pet-card-wrapper";

export const metadata: Metadata = {
  title: "Shelter Homepage",
  description: "Shelter Management System",
};

export default async function ShelterHomepage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const user = session?.user;

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  if (!user?.id) {
    toast({
      title: "Error",
      description: "Shelter ID not found. Please try again.",
    });
    return;
  }

  const availableCountResponse = await getpetcount("available", user.id);
  const adoptedCountResponse = await getpetcount("adopted", user.id);

  const availableCount = availableCountResponse?.count || 0;
  const adoptedCount = adoptedCountResponse?.count || 0;

  const response = await fetch(`http://localhost:3000/api/getPet?shelterId=${user.id}`);
  const pets = await response.json();

  return (
    <div className="p-4 text-center w-full">
      {/* Stats Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
        <div className="w-full sm:w-72 md:w-80">
          <InfoCard
            status="Available for Adoption"
            number={availableCount}
            color="#fdef4e"
          />
        </div>
        <div className="w-full sm:w-72 md:w-80">
          <InfoCard
            status="Adopted"
            number={adoptedCount}
            color="#12d929"
          />
        </div>
        <div className="mt-4 md:mt-0">
          <AddPetButton />
        </div>
      </div>
      <div>
        <Card className="mt-4 p-2 w-11/12 text-left">
          Filter
        </Card>
      </div>
      {/* Pet List Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {pets.length > 0 ? (
          pets.map((pet: any) => (
            <PetCardWrapper key={pet.id} pet={pet} />
          ))
        ) : (
          <p className="col-span-full text-gray-500">No available pets at the moment.</p>
        )}
      </div>
    </div>
  );
}
