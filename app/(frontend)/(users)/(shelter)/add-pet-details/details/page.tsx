import { Card } from "@/components/ui/card";
import Link from "next/link";
import AddPet from "../../../_components/shelters/(form)/add-pet-form";

export default function AddPetDetails() {
    return (
        <main className="p-6 space-y-4 flex flex-col">
            <Card className="p-4">
                <h1 className="text-2xl font-semibold text-gray-800">Add Pet Details</h1>
                <p className="mt-2 text-gray-600">
                    Fill in the details of the pet you want to add.
                </p>
            </Card>
            <div className="mx-auto w-full max-w-4xl">
                <AddPet />
            </div>
        </main>
    );
}
