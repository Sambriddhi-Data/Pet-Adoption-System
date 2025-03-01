import { ShelterInfoCard } from "../../_components/shelters/shelter-description-card";

export default async function PublicShelterPage() {
  return (
    <div className="p-6 text-center w-full">
      <div className='flex flex-col items-center justify-center'>
        <ShelterInfoCard />
      </div>
    </div>
  );
}
