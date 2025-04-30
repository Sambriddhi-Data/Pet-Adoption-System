'use client';

import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import LostPetCarousel from "@/components/lost-pet-carousel";
import FlipCardComponent from "./(frontend)/(users)/_components/flippableCards";
import Image from "next/image";
import LostPetForm from "./(frontend)/(users)/_components/forms/lost-pet-form";
import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal";
import { Session } from "./(frontend)/(auth)/type";
import { useRouter } from "next/navigation";
import { getAdoptedPetCount } from "@/actions/getAdoptedPetCount";

type HomePageProps = {
    initialSession: Session;
};
export const HomePage = ({ initialSession }: HomePageProps) => {
    const [session, setSession] = useState(initialSession);
    const router = useRouter();

    // const totalpetcount = async () => {const total =  await getAdoptedPetCount('adopted'); 
        
    // }
    // const adoptedpetcount = total?.count || 0;

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
                <div>
                    <div>
                        <Card className="">
                            <CardHeader>Pets</CardHeader>
                            <CardContent>Count</CardContent>
                        </Card>
                        <p className="text-sm">{ }</p>
                    </div>
                </div>
            </div>

            <Card className=""></Card>

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