import { CldImage } from 'next-cloudinary';
import Link from "next/link";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { Heart } from "lucide-react";
import { PetCard } from '../../_components/pet-card';
import InfoCard from '../../_components/shelters/info-card';
import AddPetButton from '../../_components/shelters/add-pet-button';
import { getpetcount } from '@/actions/getpetcount';
import { toast } from '@/hooks/use-toast';

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


  return (
    <div className='mt-2 text-center'>
      <div className='flex items-center gap-20'>
        <div className="w-80">
          <InfoCard
            status="Available for Adoption"
            number={availableCount}
            color="#fdef4e"
          />
        </div>
        <div className="w-80">
          <InfoCard
            status="Adopted"
            number={adoptedCount}
            color="#12d929"
          />
        </div>
        <AddPetButton />
      </div>
      <div>
        <PetCard />
      </div>
    </div>
  );
}
