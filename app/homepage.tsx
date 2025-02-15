'use client';

import Navbar from "@/components/navbar"
import RegisterButton from "@/components/registerButton";

import { useSession } from "@/auth-client";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import LostPetCarousel from "@/components/lost-pet-carousel";


export default function HomePage() {

    const handleClick = () => {
        redirect("/shelter-homepage")
    }

    const session = useSession();

    return (
        <div className="space-x-4 space-y-4">
            <Navbar />
            <div className="p-4">
                <Card className="p-2">
                    <CardHeader className="text-center text-3xl text-red-600 relative">
                        Lost Pet Alert
                        <Button className="absolute top-6 right-4 text-sm">Request Lost Pet Alert</Button>
                    </CardHeader>
                    <CardDescription className="text-center">Have you seen these furry friends somewhere? If yes, please contact the
                        pet owner and help them find their way home.
                    </CardDescription>
                    <div className="px-6">
                        <LostPetCarousel />
                    </div>
                </Card>
                <h1>Welcome to Fur-Ever Friends</h1>

                <div>Adopt a pet?</div>
                <h1>Lost a Pet?</h1>
                <div>
                    {session?.data?.user?.role ?
                        (
                            session?.data?.user?.role === "shelter_manager" ?
                                (
                                    <Button onClick={handleClick}>Shelter Controls</Button>
                                ) :
                                <div>___WORKING___</div>
                        ) : <div>
                            <p>New to the website? </p>
                            <RegisterButton />
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
