import { Card } from "@/components/ui/card";
import Link from "next/link";
import AddPet from "../../../_components/shelters/add-pet-form";

export default function AddPetImages() {
    return (
        <main className="p-6 space-y-4 flex flex-col pace-y-4">
            <div>
                <Card className={`flex items-center p-4 gap-5 w-[818px]`}>
                    <div>
                        <Link href="/add-pet-details/details">Details</Link>
                    </div>
                    <div>
                        <Link href="/add-pet-details/images">Images</Link>
                    </div>
                </Card>
            </div>
            <div>
                Upload images
            </div>
        </main>
    )
}