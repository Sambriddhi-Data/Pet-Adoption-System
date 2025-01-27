import AddPet from "../../_components/add-pet-form";

export default function AddPetPage() {
    return (
        <main className="space-y-4 ">
            <div>
                <h1>Add Pets</h1>
            </div>
            <div>
                <AddPet />
            </div>
        </main>
    )
}