'use client'

import { signOut, useSession } from "@/auth-client"
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react"

interface AdopterProfile {
    name: string,
    email: string,
    phoneNumber: string,
    location: string,
    adoptionProfile: {
        image: string[],
        age: boolean,
        home_situation: string,
        outside_space: string,
        household_setting: string,
        household_typical_activity: string,
        flatmate: boolean,
        allergy: boolean,
        other_animals: boolean,
        other_animals_info?: string,
        neuter_status?: string,
        lifestyle: string,
        move_holiday: string,
        experience: string,
        agreement: boolean,
        min_age: string,
    },
    userId: string,
}

export const MyProfile = () => {
    const { data: session } = useSession();
    const id = session?.user?.id;
    const [adopterProfile, setAdopterProfile] = useState<AdopterProfile>();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const fetchAdopterProfile = useCallback(async () => {
        if (!id) return;
        try {
            const response = await fetch(`/api/adoption-profile?id=${id}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const profile = await response.json();
            setAdopterProfile(profile);
        } catch (error) {
            console.error("Failed to fetch adopter profile", error);
        }
    }, [id]);

    useEffect(() => {
        fetchAdopterProfile();
    }, [fetchAdopterProfile]);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/user/delete?userId=${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete account");
            }

            toast({
                title: "Success",
                description: "Account has been successfully deleted",
                variant: "success"
            });
            if (response.ok) {
                const deleted = await signOut();
                if (deleted.data?.success) {
                    router.push('/sign-in');
                }
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            toast({
                title: "Error",
                description: "Failed to delete account. Please try again",
                variant: "destructive"
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    return (
        <main className="bg-gray-100 rounded-md p-6">
            <section className="mb-6">
                <h1 className="font-bold text-xl">Personal Information</h1>
                <p className="text-center">{adopterProfile?.name}</p>
                <p className="text-center">{adopterProfile?.phoneNumber} {adopterProfile?.location ? <span><span className="text-coral text-2xl">|</span> {adopterProfile?.location} </span> : ""}</p>
            </section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-center text-gray-800">
                <section className="mb-6 w-full border-3 bg-white p-6 rounded-lg space-y-3">
                    <h1 className="text-xl font-semibold mb-4">Home Details</h1>
                    <p className="font-semibold">Home Situation:</p><p> {adopterProfile?.adoptionProfile.home_situation}</p>
                    <p className="font-semibold">Outside Space:</p><p> {adopterProfile?.adoptionProfile.outside_space}</p>
                    <p className="font-semibold">Household Setting:</p><p> {adopterProfile?.adoptionProfile.household_setting}</p>
                    <p className="font-semibold">Typical Household Activity:</p><p> {adopterProfile?.adoptionProfile.household_typical_activity}</p>
                    <p className="font-semibold">Has Flatmates:</p><p> {adopterProfile?.adoptionProfile.flatmate ? "Yes" : "No"}</p>
                    <p className="font-semibold">Allergy to Pets:</p><p> {adopterProfile?.adoptionProfile.allergy ? "Yes" : "No"}</p>
                    <p className="font-semibold">Other Animals in Home:</p><p> {adopterProfile?.adoptionProfile.other_animals ? `Yes (${adopterProfile?.adoptionProfile.other_animals_info})` : "No"}</p>
                </section>

                <section className="mb-6 w-full border-3 bg-white p-6 rounded-lg space-y-3">
                    <h1 className="text-xl font-semibold mb-4">Life Style and Commitment</h1>
                    <p className="font-semibold">Work/Lifestyle:</p> <p>{adopterProfile?.adoptionProfile.lifestyle}</p>
                    <p className="font-semibold">Moving/Holidays Plan:</p> <p>{adopterProfile?.adoptionProfile.move_holiday}</p>
                    <p className="font-semibold">Experience with Pets:</p> <p>{adopterProfile?.adoptionProfile.experience}</p>
                    <p className="font-semibold">Agreement to Terms:</p> <p>{adopterProfile?.adoptionProfile.agreement ? "Yes" : "No"}</p>
                    <p className="font-semibold">Minimum Age Preferred:</p> <p>{adopterProfile?.adoptionProfile.min_age}</p>
                </section>
            </div>
            <footer className="flex justify-between mt-6 w-80">
                <Button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    variant={"destructive"}
                >
                    Delete Account
                </Button>
            </footer>

            {/* Delete Account Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Delete Account</DialogTitle>
                        <DialogDescription className="py-4">
                            Are you sure you want to delete your account? This action cannot be undone.
                            All your personal information will be marked as deleted but your adoption history
                            will be preserved for record-keeping purposes.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    )
}
