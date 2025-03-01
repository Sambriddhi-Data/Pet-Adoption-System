import { Card } from "@/components/ui/card";
import Link from "next/link";
import AddPet from "../../../_components/shelters/(form)/add-pet-form";

export default function AddPetDetails() {
    return (
        <main className="p-6 space-y-4 flex flex-col">
            <div className="mx-auto w-full max-w-3xl">
                <Card className="flex items-center p-4 gap-5">
                    <div>
                        <Link href="/add-pet-details/details">Details</Link>
                    </div>
                    <div>
                        <Link href="/add-pet-details/images">Images</Link>
                    </div>
                </Card>
            </div>
            <div className="mx-auto w-full max-w-4xl">
                <AddPet />
            </div>
        </main>
    );
}
