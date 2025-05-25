'use client';

import Navbar from "@/components/navbar"
import { Button, buttonVariants } from "@/components/ui/button";
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
import axios from "axios";
import Link from "next/link";

type HomePageProps = {
    initialSession: Session;
    adoptedPetC: number;
    claimedPetC: number;
    rehomedPetC: number;
};
export const HomePage = ({ initialSession, adoptedPetC, claimedPetC, rehomedPetC }: HomePageProps) => {
    const [session, setSession] = useState(initialSession);
    const [adoptedPetCount, setAdoptedPetCount] = useState(adoptedPetC);
    const [claimedPetCount, setClaimedPetCount] = useState(claimedPetC);
    const [rehomedPetCount, setRehomedPetCount] = useState(rehomedPetC);
    const [shelters, setShelters] = useState<any[]>([])
    const [petCount, setPetCount] = useState(0);
    const router = useRouter();
    useEffect(() => {
        const fetchShelters = async () => {
            try {
                const res = await axios.get<any[]>('/api/getShelters')
                if (res.status !== 200) {
                    throw new Error(`Error: ${res.status} ${res.statusText}`);
                }
                const data = res.data;
                setShelters(data)
            } catch (err) {
                console.error("Failed to fetch shelters:", err)
            }
        }

        fetchShelters()
    }, [])

    const shelterCount = shelters.length;
    //total adopted pet count

    // Fetch all pets on the platform
    useEffect(() => {
        const fetchAllPets = async () => {
            try {
                const response = await axios.get('/api/getallPets');
                if (response.status !== 200) {
                    throw new Error("Failed to fetch pets");
                }
                const data = response.data;
                const petCounts = data.length;
                setPetCount(petCounts);
            } catch (error) {
                console.error(error);
            }
        };
        fetchAllPets();
    }, []);

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
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center space-y-4 shadow-md">
                            <h2 className="text-2xl font-semibold text-gray-800">New to Fur-Ever Friends? 🐾</h2>
                            <p className="text-gray-600">
                                Join our growing community and help give adorable pets a second chance at love and care.
                            </p>
                            <Button
                                onClick={() => router.push("/sign-up")}
                                className="bg-coral text-white hover:bg-coral/90 hover:text-primary transition"
                            >
                                Create Your Account
                            </Button>
                        </div>

                    )}
                </div>
                <section className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Total Adopted Pets",
                            count: adoptedPetCount,
                            footer: `Fur-Ever Friends has helped ${adoptedPetCount} pets find their fur-ever home.`,
                            bg: "bg-green-50",
                            icon: "🐶",
                        },
                        {
                            title: "Adoptable Pets",
                            count: petCount,
                            footer: `Currently, ${petCount} lovely pets are waiting for a family like yours!`,
                            bg: "bg-blue-50",
                            icon: "🏡",
                        },
                        {
                            title: "Shelters",
                            count: shelterCount,
                            footer: `Fur-Ever Friends collaborates with ${shelterCount} trusted shelters.`,
                            bg: "bg-purple-50",
                            icon: "🏥",
                            clickable: true,
                            route: "/rehome-pet",
                        },
                        {
                            title: "Lost & Found Pets",
                            count: claimedPetCount,
                            footer: `Reunited ${claimedPetCount} pets with their loving pawrents.`,
                            bg: "bg-yellow-50",
                            icon: "🔍",
                        },
                        {
                            title: "Rehomed Pets",
                            count: rehomedPetC,
                            footer: `Helped ${rehomedPetC} families rehome pets safely.`,
                            bg: "bg-pink-50",
                            icon: "🏘️",
                        },
                    ].map(({ title, count, footer, bg, icon, clickable, route }, index) => (
                        <Card
                            key={index}
                            onClick={clickable ? () => router.push(route!) : undefined}
                            className={`flex flex-col items-center text-center p-6 shadow-lg rounded-xl transition-transform duration-300 hover:scale-105 cursor-pointer ${bg}`}
                        >
                            <div className="text-4xl mb-2">{icon}</div>
                            <CardHeader className="text-xl font-bold text-coral">{title}</CardHeader>
                            <CardContent className="text-3xl font-semibold text-gray-800">{count}</CardContent>
                            <CardFooter className="text-sm text-gray-600">{footer}</CardFooter>
                        </Card>
                    ))}
                </section>

                <section className="p-10 bg-orange-50 rounded-xl shadow-md text-center space-y-4 mt-10">
                    <h2 className="text-3xl font-bold text-coral">
                        ❤️ Donate to Help Us Help More Pets
                    </h2>
                    <p className="text-gray-700 max-w-2xl mx-auto">
                        Every donation makes a difference. Select a shelter and donate directly to support their mission of rescuing and rehoming pets in need.
                    </p>
                    <Link
                        href="/donate"
                        className={buttonVariants({ variant: "default", className: "text-white bg-coral hover:bg-coral/90 hover:text-primary px-6 py-2 text-lg" })}
                    >
                        Donate Now
                    </Link>
                </section>

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