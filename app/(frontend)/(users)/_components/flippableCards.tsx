import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const FlipCardComponent = () => {
    const router = useRouter();
    const handleAdoptButton = () =>
    {
        router.push('/adopt-pet');
    }
    const handleRehomeButton = () =>
    {
        router.push('/rehome-pet');
    }
    return (
        <div className="flex h-72 justify-between text-3xl">
            <div className="group h-full w-1/2 [perspective:1000px]">
                <Card
                    className="relative h-full w-full flex flex-col items-center justify-center bg-coral text-white transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
                >
                    {/* Front Face */}
                    <div className="absolute inset-0 h-full w-full flex items-center justify-center rounded-xl [backface-visibility:hidden]">
                        <CardContent className="text-center">Adopt a Pet</CardContent>
                        <CardContent>
                            <Image
                                src="/images/adopt.svg"
                                alt="dog paw and human hand"
                                width={60}
                                height={60}
                            />
                        </CardContent>
                    </div>
                    {/* Back Face */}
                    <div
                        className="absolute inset-0 flex items-center justify-center h-full w-full rounded-xl bg-cover bg-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
                        style={{
                            backgroundImage: "url('/images/dog.jpg')",
                            backgroundSize: "200px full",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <CardContent className="text-white text-center p-4">
                            <Button className="bg-bright hover:bg-bright/80 hover:scale-105 transition-transform duration-200" onClick={handleAdoptButton}>Adopt Pets Today</Button>
                        </CardContent>
                    </div>
                </Card>
            </div>

            <div className="group h-full w-1/2 [perspective:1000px]">
                <Card
                    className="relative h-full w-full flex flex-col items-center justify-center bg-white text-coral transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
                >
                    {/* Front Face */}
                    <div className="absolute inset-0 h-full w-full flex items-center justify-center rounded-xl [backface-visibility:hidden]">
                        <CardContent className="text-center">Rehome a Pet</CardContent>
                        <CardContent>
                            <Image
                                src="/images/rehome2.svg"
                                alt="cat"
                                width={80}
                                height={80}
                            />
                        </CardContent>

                    </div>
                    {/* Back Face */}
                    <div
                        className="absolute inset-0 flex items-center justify-center h-full w-full rounded-xl bg-cover bg-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
                        style={{
                            backgroundImage: "url('/images/cat.jpeg')",
                            backgroundSize: "200px full",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <CardContent className="text-white text-center p-4">
                            <Button className="bg-bright hover:bg-bright/80 hover:scale-105 transition-transform duration-200" onClick={handleRehomeButton}>Rehome Pets Today</Button>
                        </CardContent>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FlipCardComponent;
