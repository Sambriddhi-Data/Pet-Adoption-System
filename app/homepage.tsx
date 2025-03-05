'use client';

import Navbar from "@/components/navbar"
import RegisterButton from "@/components/registerButton";
import { useSession } from "@/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import LostPetCarousel from "@/components/lost-pet-carousel";
import FlipCardComponent from "./(frontend)/(users)/_components/flippableCards";
import Image from "next/image";
import LostPetForm from "./(frontend)/(users)/_components/forms/lost-pet-form";
import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal";

export default function HomePage() {
    const session = useSession();

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="space-x-4 space-y-4">
            <Navbar />
            <div className="space-x-4 space-y-4 p-4">
                <Card className="p-2 border-coral">
                    <CardHeader className="text-center text-3xl text-red-600 relative">
                        Lost Pet Alert
                        <Button
                            className="absolute top-6 right-4 text-sm"
                            onClick={() => setModalOpen(true)}
                        >
                            Request Lost Pet Alert
                        </Button>
                    </CardHeader>
                    <CardDescription className="text-center">Have you seen these furry friends somewhere? If yes, please contact the
                        pet owner and help them find their way home.
                    </CardDescription>
                    <div className="px-6">
                        <LostPetCarousel />
                    </div>
                </Card>

                <div className="mt-24">
                    <h1 className="text-8xl text-center">Welcome to Fur-Ever Friends
                        <div className="inline-block transform -rotate-45">
                            <Image
                                src='/images/paw-colar.svg'
                                alt='paw'
                                width={120}
                                height={162}
                                priority

                            />
                        </div>
                    </h1>
                </div>

                <FlipCardComponent />
                <div>
                    {session?.data ? (
                        session?.data?.user?.user_role === "shelter_manager" ? (
                            <p></p>
                        ) : (
                            <div>
                                <p>Are you are a shelter manager? Register as a shelter manager and use Fur-Ever Friends as a platform
                                    to showcase the furry friends in your care!!
                                </p>
                                <RegisterButton route="/shelter-sign-up" />
                            </div>
                        )
                    ) : (
                        <div>
                            <p>New to the website? </p>
                            <RegisterButton route="/sign-up" />
                        </div>
                    )}
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