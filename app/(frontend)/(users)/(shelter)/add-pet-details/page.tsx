import { Card } from "@/components/ui/card";
import AddPet from "../../_components/add-pet-form";
import Link from "next/link";

export default function AddPetPage() {
    return (
        <main className="p-6 space-y-4 flex flex-col pace-y-4">
            <div>
                <Card className="flex items-center p-6 gap-5 ">
                    <div>
                        <Link href="/add-pet-details">Details</Link>
                    </div>
                    <div>
                        <Link href="/add-pet-images">Images</Link>
                    </div>
                </Card>
            </div>
            <div>
                <AddPet />
            </div>
        </main>
    )
}