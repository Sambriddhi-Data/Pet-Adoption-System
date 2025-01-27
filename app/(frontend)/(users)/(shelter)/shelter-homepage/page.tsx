import { CldImage } from 'next-cloudinary';
import Link from "next/link";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { Heart } from "lucide-react"
import { PetCard } from '../../_components/pet-card';
import InfoCard from '../../_components/info-card';
import AddPetButton from '../../_components/add-pet-button';


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
    }
  }
  return (
    <div className='mt-2 text-center'>
      <div className='flex items-center gap-20'>
        <div className="w-80">
          <InfoCard status="Available for Adoption" number = {3} color="#fdef4e"/>
        </div>
        <div className="w-80">
          <InfoCard status="Adopted" number = {4} color="#12d929"/>
        </div>
        <AddPetButton/>
      </div>
      <div>
        <PetCard />
      </div>
    </div>

  );

}