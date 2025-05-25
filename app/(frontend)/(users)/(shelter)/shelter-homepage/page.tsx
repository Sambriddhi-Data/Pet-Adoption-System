import { auth } from "@/auth";
import { headers } from "next/headers";
import InfoCard from '../../_components/shelters/info-card';
import AddPetButton from '../../_components/shelters/(form)/add-pet-button';
import { getpetcount } from '@/actions/getpetcount';
import { toast } from '@/hooks/use-toast';
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ShelterHomepagePets from "./sHomepage";

export const metadata: Metadata = {
  title: "Shelter Homepage",
  description: "Shelter Management System",
};

export default async function ShelterHomepage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const user = session?.user;

  if (!session || !user?.id) {
    toast({
      title: "Error",
      description: "Shelter ID not found. Please try again.",
    });
    redirect("/");
  }

  const availableCountResponse = await getpetcount("available", user.id);
  const adoptedCountResponse = await getpetcount("adopted", user.id);

  const availableCount = availableCountResponse?.count || 0;
  const adoptedCount = adoptedCountResponse?.count || 0;

  return (
    <div className="p-3 sm:p-4 text-center w-full max-w-[1600px] mx-auto">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-center gap-4 md:gap-8">
        <div className="w-full max-w-xs mx-auto">
          <InfoCard
            status="Available for Adoption"
            number={availableCount}
            color="#fdef4e"
          />
        </div>
        <div className="w-full max-w-xs mx-auto">
          <InfoCard
            status="Adopted"
            number={adoptedCount}
            color="#12d929"
          />
        </div>
        <div className="mt-4 md:mt-0 flex justify-center lg:justify-start">
          <AddPetButton />
        </div>
      </div>

      {/* Client Component for Pets */}
      <div className="mt-6 lg:mt-8">
        <ShelterHomepagePets shelterId={user.id} />
      </div>
    </div>
  );
}
