"use client";

import { Button } from "@/components/ui/button";
import { ShelterInfoCard } from "../../../_components/shelters/shelter-description-card";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/auth-client";
import PetCardWrap from "../../../_components/pet-card-wrap";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@/components/ui/tooltip";  

export default function PublicShelterPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [pets, setPets] = useState([]);
  const router = useRouter();

  let hoverMessage = "";
  if (!session?.user) {
    hoverMessage = "Please sign in first to apply for rehoming your pet";
  } else if (session?.user?.user_role === "shelter_manager") {
    hoverMessage = "Shelter Managers are not allowed to apply for rehoming a pet";
  } else if (session?.user?.user_role === "admin") {
    hoverMessage = "Admins are not allowed to apply for rehoming a pet";
  } else if (session?.user?.user_role === "customer") {
    hoverMessage = "Click to apply for rehoming a pet";
  }

  useEffect(() => {
    if (id) {
      fetch(`/api/getPet?shelterId=${id}`)
        .then((res) => res.json())
        .then((data) => setPets(data))
        .catch((error) => console.error("Error fetching pets:", error));
    }
  }, [id]);

  const isDisabled = session?.user?.user_role !== "customer";
  const handleRehomeRedirect = () => {
    router.push(`/rehome-pet-request/${id}`)
  }

  return (
    <div className="p-6 text-center w-full">
      <div className="flex flex-col items-center justify-center mb-10">
        <ShelterInfoCard />
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button onClick={handleRehomeRedirect} disabled={isDisabled}>Rehome pet</Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {hoverMessage}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 w-10/12">
          {pets.length > 0 ? (
            pets.map((pet: any) => (
              <PetCardWrap key={pet.id} pet={pet} />
            ))
          ) : (
            <p className="col-span-full text-gray-500">No available pets at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
