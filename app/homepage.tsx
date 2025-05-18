'use client';

import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import LostPetCarousel from "@/components/lost-pet-carousel";
import FlipCardComponent from "./(frontend)/(users)/_components/flippableCards";
import Image from "next/image";
import LostPetForm from "./(frontend)/(users)/_components/forms/lost-pet-form";
import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal";
import { Session } from "./(frontend)/(auth)/type";
import { useRouter } from "next/navigation";
import { getPetCountByStatus } from "@/actions/getPetCountByStatus";

type HomePageProps = {
    initialSession: Session;
    adoptedPetC: number;
    claimedPetC: number;
};
export const HomePage = ({ initialSession, adoptedPetC, claimedPetC }: HomePageProps) => {
    const [session, setSession] = useState(initialSession);
    const [adoptedPetCount, setAdoptedPetCount] = useState(adoptedPetC);
    const [claimedPetCount, setClaimedPetCount] = useState(claimedPetC);
    const [shelters, setShelters] = useState<any[]>([])
    const router = useRouter();
    useEffect(() => {
        const fetchShelters = async () => {
            try {
                const res = await fetch('/api/getShelters')
                const data = await res.json()
                setShelters(data)
            } catch (err) {
                console.error("Failed to fetch shelters:", err)
            }
        }

        fetchShelters()
    }, [])
    const shelterCount = shelters.length;
    //total adopted pet count
    console.log(adoptedPetCount);

    //total claimed pet count (from lost and found)


    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="space-y-4">
            <Navbar />

            <div className="space-y-4 p-4">
                <Card className="p-2 border-coral">
                    <CardHeader className="text-center text-3xl h-24 text-red-600 relative">
                        Lost Pet Alert 🚨
                        <Button
                            className="absolute right-4 text-sm top-16 lg:top-6"
                            onClick={() => setModalOpen(true)}
                        >
                            Request Lost Pet Alert
                        </Button>
                    </CardHeader>
                    <CardDescription className="text-center mt-4">Have you seen these furry friends somewhere? If yes, please contact the
                        pet owner and help them find their way home.
                    </CardDescription>
                    <div className="px-6">
                        <LostPetCarousel />
                    </div>
                </Card>

                <div className="mt-24 flex items-center justify-center">
                    <h1 className="text-4xl text-center md:text-5xl lg:text-6xl">Welcome to Fur-Ever Friends
                    </h1>
                    <div className="inline-block transform -rotate-45">
                        <Image
                            src='/images/paw-colar.svg'
                            alt='paw'
                            width={80}
                            height={108}
                            className="md:w-[100px] md:h-[135px] lg:w-[120px] lg:h-[162px]"
                            priority
                        />
                    </div>
                </div>

                <FlipCardComponent />
                <div>
                    {session ? (
                        session?.user?.user_role === "shelter_manager" ? (
                            <p></p>
                        ) : (
                            <div>
                                <p>Are you are a shelter manager? Register as a shelter manager with your shelter's account and use Fur-Ever Friends as a platform
                                    to showcase the furry friends in your care!!
                                </p>
                                <Button onClick={() => router.push("/shelter-sign-up")}>Shelter Register</Button>

                            </div>
                        )
                    ) : (
                        <div>
                            <p>New to the website? </p>
                            <Button onClick={() => router.push("/'sign up'")}>Register</Button>
                        </div>
                    )}
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 ">
                    <Card className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
                        <CardHeader>Total Adopted Pets</CardHeader>
                        <CardContent>{adoptedPetCount}</CardContent>
                        <CardFooter className="text-sm text-gray-500">Fur-Ever Friends has helped {adoptedPetCount} pets to find their fur-ever home.</CardFooter>
                    </Card>

                    <Card className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
                        <CardHeader>Pets</CardHeader>
                        <CardContent>Count</CardContent>
                        <CardFooter className="text-sm text-gray-500">Fur-Ever Friends is a virtual home to { } pets</CardFooter>
                    </Card>

                    <Card className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
                        <CardHeader>Shelter</CardHeader>
                        <CardContent>{shelterCount}</CardContent>
                        <CardFooter className="text-sm text-gray-500">Fur-Ever Friends is a family of {shelterCount} shelters</CardFooter>

                    </Card>
                    <Card className="flex flex-col items-center transition-transform duration-300 hover:scale-105">
                        <CardHeader>Lost and Found Pets</CardHeader>
                        <CardContent>{shelterCount}</CardContent>
                        <CardFooter className="text-sm text-gray-500">Fur-Ever Friends has helped reunite {claimedPetCount} pets and pawrents</CardFooter>

                    </Card>
                </div>
            </div>

            <CustomModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Request for Lost Pet Alert"
            >
                <LostPetForm />
            </CustomModal>
        </div>
    );
}