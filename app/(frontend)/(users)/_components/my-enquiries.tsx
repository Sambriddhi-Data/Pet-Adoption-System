'use client';

import { useSession } from "@/auth-client";
import { use, useEffect, useState } from "react";
import { AdoptionRequest, RehomeRequest, Requests } from "./type";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import classNames from "classnames";
import { CldImage } from "next-cloudinary";
import { useSearchParams } from "next/navigation";
import { CustomModal } from "@/components/custom-modal";
import Link from "next/link";
import confetti from 'canvas-confetti';
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
};

const fireConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            clearInterval(interval);
            return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
    }, 250);
};


export default function MyEnquiries() {

    const { data: session } = useSession()
    const userId = session?.user?.id;
    const searchParams = useSearchParams();
    const [selectedAdoptionRequest, setSelectedAdoptionRequest] = useState<AdoptionRequest | null>(null);
    const [selectedRehomeRequest, setSelectedRehomeRequest] = useState<| RehomeRequest | null>(null);

    const id = searchParams.get("requestId") || "";
    const [requests, setRequests] = useState<Requests>({ adoptionRequests: [], rehomingRequests: [] });
    const [loading, setLoading] = useState(true);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // function to determine which request to display based on requestId
    const findRequestById = (requestId: string) => {
        // check adoption requests first
        const adoptionRequest = requests.adoptionRequests.find(req => req.id === requestId);
        if (adoptionRequest) {
            return { type: 'adoption', request: adoptionRequest };
        }

        //then, check rehome requests
        const rehomeRequest = requests.rehomingRequests.find(req => req.id === requestId);
        if (rehomeRequest) {
            return { type: 'rehome', request: rehomeRequest };
        }
        return null;
    };

    // set the rewuest accordingly
    useEffect(() => {
        if (id && userId) {
            const foundRequest = findRequestById(id);
            if (foundRequest) {
                if (foundRequest.type === 'adoption') {
                    setSelectedAdoptionRequest(foundRequest.request as AdoptionRequest);
                    setSelectedRehomeRequest(null);
                } else {
                    setSelectedRehomeRequest(foundRequest.request as RehomeRequest);
                    setSelectedAdoptionRequest(null);
                }
                setModalOpen(true);
            }
        }
        setRequestId(id);

    }, [id, userId, requests]);


    const handleOnClose = () => {
        setRequestId(null);
        setModalOpen(false);
        setSelectedAdoptionRequest(null);
        setSelectedRehomeRequest(null);
        document.body.style.overflow = '';

    }

    const handleOnOpenAdoption = (request: AdoptionRequest) => {
        setSelectedAdoptionRequest(request);
        setSelectedRehomeRequest(null);
        setRequestId(request.id);
        setModalOpen(true);
    };

    const handleOnOpenRehome = (request: RehomeRequest) => {
        setSelectedRehomeRequest(request);
        setSelectedAdoptionRequest(null);
        setRequestId(request.id);
        setModalOpen(true);
    };

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
        // console.log(requests);
    }, [session]);

    useEffect(() => {
        const isAdoptionApproved = selectedAdoptionRequest?.status === "approved";
        const isRehomeApproved = selectedRehomeRequest?.status === "approved";

        if (modalOpen && (isAdoptionApproved || isRehomeApproved)) {
            fireConfetti();
        }
    }, [modalOpen, selectedAdoptionRequest?.status, selectedRehomeRequest?.status]);

    // deleting a request
    const handleDeleteRequest = async (requestId: string, type: 'adoption' | 'rehome') => {
        try {
            const response = await fetch(`/api/deleteEnquiries?requestId=${requestId}&type=${type}&userId=${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete request');
            }

            toast({
                title: "Success",
                description: "Request deleted successfully",
                variant: "success",
            });

            // Refetch requests to update UI
            fetchRequests();

        } catch (error) {
            console.error("Error deleting request:", error);
            toast({
                title: "Error",
                description: "Failed to delete request",
                variant: "destructive",
            });
        }
    };


    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-col w-full max-w-6xl mx-auto px-4 mb-4 space-y-2">
                {requests.adoptionRequests.length > 0 &&
                    <h1 className="text-2xl font-bold"> My Adoption Requests</h1>
                }
                {loading ? (
                    <p className="col-span-full text-gray-500">Loading requests...</p>
                ) : requests.adoptionRequests && requests.adoptionRequests.length > 0 ? (
                    requests.adoptionRequests.map((request) => (
                        <Card key={request.id} className="p-6 w-full hover:bg-gray-100">
                            <div className="flex flex-col md:flex-row justify-between p-2 border-b space-x-4">
                                <div 
                                    className="flex-1 flex flex-col md:flex-row justify-between space-x-4 cursor-pointer" 
                                    onClick={() => handleOnOpenAdoption(request)}
                                >
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
                                            />
                                        </div>
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
                                            <Calendar color="green" size={20} />
                                            <span className="text-gray-800">
                                                {new Date(request.createdAt).toISOString().slice(0, 10).replace(/-/g, '/')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={classNames({
                                        "rounded-lg text-xs w-fit h-fit py-2 px-6 mt-2 ": true,
                                        "bg-yellow-400 bg-opacity-50": request.status === "unprocessed",
                                        "bg-red-400 bg-opacity-50": request.status === "rejected",
                                        "bg-green-400 bg-opacity-50": request.status === "approved"
                                    })}>
                                        {request.status.toUpperCase()}
                                    </div>
                                </div>
                                
                                {request.status === "unprocessed" && (
                                    <div className="flex items-center ml-4">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Request</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete this adoption request for {request.animals.name}? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteRequest(request.id, 'adoption');
                                                        }}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="col-span-full text-gray-500">No matching adoption requests found.</p>
                )}
                <div className="mt-20"></div>
                {requests.rehomingRequests.length > 0 &&
                    <h1 className="text-2xl font-bold"> My Rehoming Requests</h1>
                }
                {loading ? (
                    <p className="col-span-full text-gray-500"></p>
                ) : requests.rehomingRequests && requests.rehomingRequests.length > 0 ? (
                    requests.rehomingRequests.map((request) => (
                        <Card key={request.id} className="p-6 w-full hover:bg-gray-100">
                            <div className="flex flex-col md:flex-row justify-between p-2 border-b space-x-4">
                                <div 
                                    className="flex-1 flex flex-col md:flex-row justify-between space-x-4 cursor-pointer" 
                                    onClick={() => handleOnOpenRehome(request)}
                                >
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
                                            />
                                        </div>
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
                                            <Calendar color="green" size={20} />
                                            <span className="text-gray-800">
                                                {new Date(request.createdAt).toISOString().slice(0, 10).replace(/-/g, '/')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={classNames({
                                        "rounded-lg text-xs w-fit h-fit py-2 px-6 mt-2": true,
                                        "bg-yellow-400 bg-opacity-50": request.status === "unprocessed",
                                        "bg-red-400 bg-opacity-50": request.status === "rejected",
                                        "bg-green-400 bg-opacity-50": request.status === "approved"
                                    })}>
                                        {request.status.toUpperCase()}
                                    </div>
                                </div>
                                
                                {request.status === "unprocessed" && (
                                    <div className="flex items-center ml-4">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Request</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete this rehome request for {request.petName}? This action cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleDeleteRequest(request.id, 'rehome');
                                                        }}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))
                ) : (
                    <p className="col-span-full text-gray-500">No matching rehome requests found.</p>
                )}
            </div>

            {requestId && selectedAdoptionRequest && (
                <CustomModal
                    isOpen={modalOpen}
                    onClose={() => handleOnClose()}
                    title="Application Status"
                >
                    <div className="p-4">
                        <Link href={`/pets/${selectedAdoptionRequest.animals.id}`} className="flex flex-col items-center mb-4">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 outline-2 rounded-full">
                                    <CldImage
                                        src={selectedAdoptionRequest.animals.image[0]}
                                        height="200"
                                        width="200"
                                        alt={selectedAdoptionRequest.animals.name}
                                        crop={{
                                            type: 'fill',
                                            source: true
                                        }}
                                        className="object-cover rounded-full"
                                    /></div>
                                <label htmlFor={selectedAdoptionRequest.id} className="mt-2 text-lg">{selectedAdoptionRequest.animals.name}</label>
                            </div>
                        </Link>
                        {selectedAdoptionRequest.status === "approved" && (
                            <div className="flex flex-col items-center mt-4">
                                <span className="text-green-500 text-lg font-semibold">Congratulations! Your application has been approved.</span>
                                <span className="text-gray-600 text-sm">You can now proceed with the adoption process.<br /> Contact the shelter first at {selectedAdoptionRequest.animals.shelter.user.phoneNumber}.Refer to this blog to checklist if you are ready to welcome the pet home.</span>

                            </div>
                        )}
                        {selectedAdoptionRequest.status === "rejected" && (
                            <div className="flex flex-col items-center mt-4">
                                <span className="text-red-500 text-lg font-semibold">Sorry! Your application has been rejected.</span>
                                <span className="text-gray-600 text-sm">Your application to adpot {selectedAdoptionRequest.animals.name} has been rejected.
                                    But don't worry! Fur-Ever Friends has long list of animals waiting for a fur-ever home. Visit our pet list page <a href="/adopt-pet" className="text-blue-700 underline">Adopt Pet</a> and find a companion for you!!</span>

                            </div>
                        )}
                        {selectedAdoptionRequest.status === "unprocessed" && (
                            <div className="flex flex-col items-center">
                                <h1 className="text-lg font-semibold rounded-lg w-fit h-fit py-2 px-6 mt-2 bg-yellow-400 bg-opacity-50">{selectedAdoptionRequest.status.toUpperCase()}</h1>
                                <div className="flex justify-between mt-2 gap-4">
                                    <div className="flex flex-col items-left mt-2 md:mt-0 ">
                                        <span className="text-gray-800">Shelter Name</span>
                                        <span className="text-gray-600 text-[14px]" >{selectedAdoptionRequest.animals.shelter.user.name}</span>
                                    </div>
                                    <div className="flex flex-col items-left mt-2 md:mt-0 ">
                                        <span className="text-gray-800">Shelter Contact</span>
                                        <span className="text-gray-600 text-[14px]" >{selectedAdoptionRequest.animals.shelter.user.phoneNumber}</span>
                                    </div>
                                    <div className="flex flex-col items-left mt-2 md:mt-0 ">
                                        <span className="text-gray-800">Shelter Email</span>
                                        <span className="text-gray-600 text-[14px]" >{selectedAdoptionRequest.animals.shelter.user.email}</span>
                                    </div>
                                    <div className="flex flex-col items-left mt-2 md:mt-0 ">
                                        <span className="text-gray-800">Requested On</span>
                                        <span className="text-gray-600 text-[14px]" >{new Date(selectedAdoptionRequest.createdAt).toISOString().slice(0, 10).replace(/-/g, '/')}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CustomModal>
            )}

            {(requestId && selectedRehomeRequest) && (
                <CustomModal
                    isOpen={modalOpen}
                    onClose={() => handleOnClose()}
                    title="Application Status"
                >
                    <div className="flex flex-col items-center w-20">
                        <div className="w-16 h-16 outline-2 rounded-full">
                            <CldImage
                                src={selectedRehomeRequest.image[0]}
                                height="200"
                                width="200"
                                alt={selectedRehomeRequest.petName}
                                crop={{
                                    type: 'fill',
                                    source: true
                                }}
                                className="object-cover rounded-full"
                            /></div>
                        <label htmlFor={selectedRehomeRequest.id} className="mt-2 text-lg">{selectedRehomeRequest.petName}</label>
                    </div>
                    <p></p>

                </CustomModal>
            )}
        </div>
    )
}

