'use client';

import Navbar from "@/components/navbar"
import RegisterButton from "@/components/registerButton";

import { useSession } from "@/auth-client";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import LostPetCarousel from "@/components/lost-pet-carousel";
import FlipCardComponent from "./(frontend)/(users)/_components/flippableCards";


export default function HomePage() {

    const handleClick = () => {
        redirect("/shelter-homepage")
    }

    const session = useSession();

    return (
        <div className="space-x-4 space-y-4">
            <Navbar />
            <div className=" space-x-4 space-y-4 p-4">
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
                <h1 className="text-5xl text-center">Welcome to Fur-Ever Friends</h1>

                <FlipCardComponent/>
                <div>
                    {session?.data ?
                        (
                            session?.data?.user?.user_role === "shelter_manager" ?
                                (
                                    <Button onClick={handleClick}>Shelter Controls</Button>
                                ) :
                                <div>
                                    <p>Are you are a shelter manager? Register as a shelter manager and use Fur-Ever Friends as a platform
                                        to showcase the furry friends in your care!!
                                    </p>
                                    <RegisterButton route="/shelter-sign-up" />
                                </div>
                        ) : <div>
                            <p>New to the website? </p>
                            <RegisterButton route="/sign-up" />
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
