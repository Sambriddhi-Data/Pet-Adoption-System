'use client';

import { useSession } from "@/auth-client";
import { useEffect, useState } from "react";
import { Requests } from "../type";
import { toast } from "@/hooks/use-toast";
import { Button } from "react-day-picker";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import classNames from "classnames";
import { CldImage } from "next-cloudinary";

export default function MyEnquiries() {

    const { data: session } = useSession()
    const userId = session?.user?.id;
    const [requests, setRequests] = useState<Requests>({ adoptionRequests: [], rehomingRequests: [] });
    const [loading, setLoading] = useState(true);


    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/enquiries?userId=${userId}`);
            const data = await response.json();

            if (!data.data) {
                setRequests({ adoptionRequests: [], rehomingRequests: [] });
                return;
            }

            // Set state with the correct structure
            setRequests({
                adoptionRequests: data.data.adoptionRequests || [],
                rehomingRequests: data.data.rehomingRequests || [],
            });
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast({
                title: "Error",
                description: "Failed to fetch requests",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (userId) {
            fetchRequests();
        }
        console.log(requests);
    }, [session]);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-col w-full max-w-6xl mx-auto px-4 mb-4 space-y-2">
                {requests.adoptionRequests.length > 0 &&
                    <h1 className="text-2xl font-bold">Adoption Requests</h1>
                }
                {loading ? (
                    <p className="col-span-full text-gray-500">Loading requests...</p>
                ) : requests.adoptionRequests && requests.adoptionRequests.length > 0 ? (
                    requests.adoptionRequests.map((request) => (
                        <Card key={request.id} className="p-6 cursor-pointer w-full hover:bg-gray-100">
                            <div className="flex flex-col md:flex-row justify-between p-2 border-b space-x-4">
                                <div className="flex flex-col items-center w-20">
                                    <div className="w-16 h-16 outline-2 rounded-full">
                                        <CldImage
                                            src={request.animals.image[0]}
                                            height="200"
                                            width="200"
                                            alt={request.animals.name}
                                            crop={{
                                                type: 'fill',
                                                source: true
                                            }}
                                            className="object-cover rounded-full"
                                        /></div>
                                    <label htmlFor={request.id} className="mt-2 text-lg">{request.animals.name}</label>
                                </div>
                                <div className="flex flex-col items-left mt-2 md:mt-0">
                                    <span className="text-gray-800">Shelter Name</span>
                                    <span className="text-gray-600 text-[14px]" >{request.animals.shelter.user.name}</span>
                                </div>
                                <div className="flex flex-col items-left mt-2 md:mt-0">
                                    <span className="text-gray-800">Address</span>
                                    <span className="text-gray-600 text-[14px]" >{request.animals.shelter.user.location}</span>
                                </div>
                                <div className="flex flex-col items-left mt-2 md:mt-0">
                                    <span className="text-gray-800">Contact number</span>
                                    <span className="text-gray-600 text-[14px]" >{request.animals.shelter.user.phoneNumber}</span>
                                </div>
                                <div className="flex flex-col items-left mt-2 md:mt-0">
                                    <span className="text-gray-800">Requested On: </span>
                                    <div className="flex space-x-2">
                                        <Calendar color="green" size={20}/>
                                        <span className="text-gray-600 text-[14px]">{new Date(request.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className={classNames({
                                    "rounded-lg text-xs w-fit h-fit py-2 px-6 mt-2": true,
                                    "bg-yellow-400 bg-opacity-50": request.status === "unprocessed",
                                    "bg-red-400 bg-opacity-50": request.status === "rejected",
                                    "bg-green-400 bg-opacity-50": request.status === "approved"
                                })}>
                                    {request.status}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="col-span-full text-gray-500">No matching adoption requests found.</p>
                )}
                <div className="mt-20"></div>
                {requests.rehomingRequests.length > 0 &&
                    <h1 className="text-2xl font-bold">Rehoming Requests</h1>
                }
                {loading ? (
                    <p className="col-span-full text-gray-500">Loading requests...</p>
                ) : requests.rehomingRequests && requests.rehomingRequests.length > 0 ? (
                    requests.rehomingRequests.map((request) => (
                        <Card key={request.id} className="p-6 cursor-pointer w-full hover:bg-gray-100">
                            <div className="flex flex-col md:flex-row justify-between p-2 border-b space-x-4">
                                <div className="flex flex-col items-center w-20">
                                    <div className="w-16 h-16 outline-2 rounded-full">
                                        <CldImage
                                            src={request.image[0]}
                                            height="200"
                                            width="200"
                                            alt={request.petName}
                                            crop={{
                                                type: 'fill',
                                                source: true
                                            }}
                                            className="object-cover rounded-full"
                                        /></div>
                                    <label htmlFor={request.id} className="mt-2 text-lg">{request.petName}</label>
                                </div>
                                <div className="flex flex-col items-left mt-2 md:mt-0">
                                    <span className="text-gray-800">Shelter Name</span>
                                    <span className="text-gray-600 text-[14px]" >{request.shelter.user.name}</span>
                                </div>
                                <div className="flex flex-col items-left mt-2 md:mt-0">
                                    <span className="text-gray-800">Address</span>
                                    <span className="text-gray-600 text-[14px]" >{request.shelter.user.location}</span>
                                </div>
                                <div className="flex flex-col items-left mt-2 md:mt-0">
                                    <span className="text-gray-800">Contact number</span>
                                    <span className="text-gray-600 text-[14px]" >{request.shelter.user.phoneNumber}</span>
                                </div>
                                <div className="flex flex-col items-left mt-2 md:mt-0">
                                    <span className="text-gray-800">Requested On: </span>
                                    <div className="flex space-x-2">
                                        <Calendar color="green" size={20}/>
                                        <span className="text-gray-600 text-[14px]">{new Date(request.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className={classNames({
                                    "rounded-lg text-xs w-fit h-fit py-2 px-6 mt-2": true,
                                    "bg-yellow-400 bg-opacity-50": request.status === "unprocessed",
                                    "bg-red-400 bg-opacity-50": request.status === "rejected",
                                    "bg-green-400 bg-opacity-50": request.status === "approved"
                                })}>
                                    {request.status}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="col-span-full text-gray-500">No matching rehome requests found.</p>
                )}
            </div>
        </div>
    )
}

