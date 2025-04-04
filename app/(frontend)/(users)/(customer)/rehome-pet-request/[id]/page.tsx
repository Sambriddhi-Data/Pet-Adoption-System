'use client';
import { useParams } from "next/navigation";
import RehomePet from "../../../_components/shelters/(form)/rehome-pet-form";

export default function RehomePetRequest() {
  const { id } = useParams();
  return (
    <div className="p-6 w-full">
        <RehomePet shelterId = {id as string } />
    </div>
  );
}
