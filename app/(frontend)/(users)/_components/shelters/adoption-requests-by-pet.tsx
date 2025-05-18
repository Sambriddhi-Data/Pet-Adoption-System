'use client'

import { useState, useEffect } from "react";
import { useSession } from "@/auth-client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Check, ChevronsUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { CustomModal } from "@/components/custom-modal";
import { AdoptionRequest } from "../type";
import AdopterProfileOverlay from "./adopter-profile-overlay";
import classNames from "classnames";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const APPLICATIONS_PER_PAGE = 3;

interface AdoptionRequestsByPetProps {
    petId: string;
}
const statuses = [
    { value: "unprocessed", label: "Unprocessed" },
    { value: "rejected", label: "Rejected" },
    { value: "approved", label: "Approved" },
]

export default function AdoptionRequestsByPet({ petId }: AdoptionRequestsByPetProps) {

    const [requests, setRequests] = useState<AdoptionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredRequests, setFilteredRequests] = useState<AdoptionRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [choose, setChoose] = useState(false);
    const [chooseApplicantOverlay, setChooseApplicantOverlay] = useState(false);
    const [applicant, setApplicant] = useState<AdoptionRequest | null>(null);

    const handleSelect = (request: AdoptionRequest) => {
        setApplicant(request);
        setChooseApplicantOverlay(true);
    };

    const session = useSession();
    console.log("Pet ID:", petId);

    const fetchAdoptionRequests = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/api/adoptionRequestsByPetId?petId=${petId}`
            );
            const data = await response.json();
            const requestsData = Array.isArray(data.data) ? data.data : [];
            setRequests(requestsData);
            setFilteredRequests(requestsData);
        } catch (error) {
            console.error("Error fetching adoption requests:", error);
            toast({
                title: "Error",
                description: "Failed to fetch adoption requests",
                variant: "destructive",
            })
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.data?.user?.id) {
            fetchAdoptionRequests();
        }
    }, [petId, session]);

    useEffect(() => {
        filterRequests();
    }, [selectedStatuses, requests]);

    const filterRequests = () => {
        if (selectedStatuses.length === 0) {
            // If no statuses selected, show all requests
            setFilteredRequests(requests);
        } else {
            // Filter requests based on selected statuses
            const filtered = requests.filter(request =>
                selectedStatuses.includes(request.status)
            );
            setFilteredRequests(filtered);
        }
        // Reset to first page whenever filters change
        setCurrentPage(1);
    };

    const handleStatusChange = (status: string) => {
        setSelectedStatuses(prev => {
            if (prev.includes(status)) {
                // Remove status if already selected
                return prev.filter(s => s !== status);
            } else {
                // Add status if not selected
                return [...prev, status];
            }
        });
    };

    const StatusFilter = () => {
        const [open, setOpen] = useState(false)

        return (
            <div className="mt-2 space-y-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {selectedStatuses.length === 0
                                ? "All Statuses"
                                : `${selectedStatuses.length} selected`}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Search status..." />
                            <CommandList>
                                <CommandEmpty>No status found.</CommandEmpty>
                                <CommandGroup>
                                    {statuses.map((status) => (
                                        <CommandItem
                                            key={status.value}
                                            onSelect={() => handleStatusChange(status.value)}
                                            className="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                checked={selectedStatuses.includes(status.value)}
                                                className="h-4 w-4"
                                                onCheckedChange={() => { }}
                                            />
                                            <span>{status.label}</span>
                                            {selectedStatuses.includes(status.value) && (
                                                <Check className="ml-auto h-4 w-4" />
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
        )
    }

    // Pagination logic
    const indexOfLastRequest = currentPage * APPLICATIONS_PER_PAGE;
    const indexOfFirstRequest = indexOfLastRequest - APPLICATIONS_PER_PAGE;
    const currentRequests = filteredRequests?.length ? filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest) : [];
    const totalPages = Math.ceil(filteredRequests.length / APPLICATIONS_PER_PAGE);

    const [modalOpen, setModalOpen] = useState(false);
    const handleOnOpen = (request: AdoptionRequest) => {
        setSelectedRequest(request),
            setModalOpen(true);
    }
    const handleOnClose = () => {
        setModalOpen(false);
        setSelectedRequest(null);
    };

    const handleConfirm = async () => {
        if (!applicant) return;

        try {
            const response = await fetch('/api/confirmAdoption', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applicationId: applicant.id,
                    petId: petId
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to confirm adoption application');
            }

            toast({
                title: "Success",
                description: "Application choosen successfully!",
                variant: "success"
            });

            // Refresh the requests list
            await fetchAdoptionRequests();

            // Close all modals
            setChoose(false);
            setChooseApplicantOverlay(false);
            setApplicant(null);
        } catch (error) {
            console.error("Error confirming adoption:", error);
            toast({
                title: "Error",
                description: "Failed to confirm adoption",
                variant: "destructive"
            });
        }
    };
    //check if the pet is already adopted
    const isPetAdopted = requests.some(request => request.status === "approved" || request.status === "rejected");

    return (
        <div className="flex flex-col w-full max-w-4xl md:w-[80rem] mx-auto px-4">
            <div className="flex flex-col md:flex-row w-[80] items-center justify-between border-b">
                <Card className="p-2 py-3 mb-4 md:mb-0">{filteredRequests.length > 1 ? `${filteredRequests.length} Applications` : `${filteredRequests.length} Application`}</Card>
                <Card className="w-full md:w-72 p-4 mb-4">
                    <h1>Filter Applications</h1>
                    <StatusFilter />
                </Card>
            </div>

            <div className="flex flex-col items-center justify-center w-full p-4 space-y-2">

                {requests.length > 0 && !isPetAdopted &&
                    <Button className="" onClick={() => { setChoose(true) }}>Choose a successful applicant</Button>
                }
                <div className="w-full mb-4 space-y-2">
                    {loading ? (
                        <p className="col-span-full text-gray-500">Loading pets...</p>
                    ) : filteredRequests && currentRequests.length > 0 ? (
                        currentRequests.map((request) => (
                            <Card key={request.id} onClick={() => handleOnOpen(request)} className="p-6 cursor-pointer w-full hover:bg-gray-100">
                                <div className="flex flex-col md:flex-row justify-between p-2 border-b space-x-4">

                                    <div className="flex flex-col items-left mt-2 md:mt-0">
                                        <span className="text-gray-800">Full Name</span>
                                        <span className="text-gray-600 text-[14px]" >{request.adoptionprofile.user.name}</span>
                                    </div>
                                    <div className="flex flex-col items-left mt-2 md:mt-0">
                                        <span className="text-gray-800">Address</span>
                                        <span className="text-gray-600 text-[14px]" >{request.adoptionprofile.user.location}</span>
                                    </div>
                                    <div className="flex flex-col items-left mt-2 md:mt-0">
                                        <span className="text-gray-800">Phone number</span>
                                        <span className="text-gray-600 text-[14px]" >{request.adoptionprofile.user.phoneNumber}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Calendar color="green" />
                                        <span className="text-gray-800">
                                            {new Date(request.createdAt).toISOString().slice(0, 10).replace(/-/g, '/')}
                                        </span>                                    </div>

                                    <div className={classNames({
                                        "rounded-lg text-xs w-fit h-fit py-2 px-6 mt-2": true,
                                        "bg-yellow-400 bg-opacity-50": request.status === "unprocessed",
                                        "bg-red-400 bg-opacity-50": request.status === "rejected",
                                        "bg-green-400 bg-opacity-50": request.status === "approved"
                                    })}>
                                        {request.status.toUpperCase()}
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="col-span-full text-gray-500">No matching adoption requests found.</p>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className="flex justify-center mt-6 space-x-2">
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >Previous</Button>
                        <span>Page {currentPage} of {totalPages || 1}</span>
                        <Button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >Next</Button>
                    </div>
                </div>

                {selectedRequest && (
                    <CustomModal
                        isOpen={modalOpen}
                        onClose={() => handleOnClose()}
                        title="Adoption Request"
                    >
                        <AdopterProfileOverlay request={selectedRequest} />
                    </CustomModal>
                )}
                {choose && (
                    <CustomModal
                        isOpen={choose}
                        onClose={() => setChoose(false)}
                        title="Confirm Successful Applicant"
                    >
                        {!chooseApplicantOverlay && !selectedRequest ? (
                            <div className="p-6 bg-gray-100">
                                <p className="text-sm mb-2">
                                    Listed below is a summary of all approved and unprocessed applications for this pet.
                                    Clicking "Select" will open an expanded view of the application where you can confirm your selection.
                                </p>
                                {loading ? (
                                    <p className="col-span-full text-gray-500">Loading pets...</p>
                                ) : filteredRequests && currentRequests.length > 0 ? (
                                    currentRequests.map((request) => (
                                        <Card key={request.id} className="p-6 cursor-pointer w-full hover:bg-gray-100">
                                            <div className="flex flex-col md:flex-row justify-between p-2 border-b space-x-4">
                                                <div className="flex flex-col items-left mt-2 md:mt-0">
                                                    <span className="text-gray-800">Full Name</span>
                                                    <span className="text-gray-600 text-[14px]">{request.adoptionprofile.user.name}</span>
                                                </div>
                                                <div className="flex flex-col items-left mt-2 md:mt-0">
                                                    <span className="text-gray-800">Address</span>
                                                    <span className="text-gray-600 text-[14px]">{request.adoptionprofile.user.location}</span>
                                                </div>
                                                <div className="flex flex-col items-left mt-2 md:mt-0">
                                                    <span className="text-gray-800">Phone number</span>
                                                    <span className="text-gray-600 text-[14px]">{request.adoptionprofile.user.phoneNumber}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Calendar color="green" />
                                                    <span className="text-gray-800">
                                                        {new Date(request.createdAt).toISOString().slice(0, 10).replace(/-/g, '/')}
                                                    </span>                                                </div>
                                                <Button onClick={() => handleSelect(request)}>Select</Button>
                                            </div>
                                            <div className={classNames({
                                                "rounded-lg text-xs w-fit h-fit py-2 px-6 mt-2": true,
                                                "bg-yellow-400 bg-opacity-50": request.status === "unprocessed",
                                                "bg-red-400 bg-opacity-50": request.status === "rejected",
                                                "bg-green-400 bg-opacity-50": request.status === "approved"
                                            })}>
                                                {request.status}
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="col-span-full text-gray-500">No matching adoption requests found.</p>
                                )}
                            </div>
                        ) : (
                            applicant && (
                                <div className="p-6 bg-gray-100">
                                    <p className="p-1 bg-primary opacity-90 text-white">
                                        Clicking "Confirm" will mark this pet as adopted and send an email to all unsuccessful applicants informing them of the outcome.
                                    </p>
                                    <div className="flex flex-col md:flex-row justify-between p-2 border-b space-x-4">

                                        <div className="flex flex-col items-left mt-2 md:mt-0">
                                            <span className="text-gray-800">Full Name</span>
                                            <span className="text-gray-600 text-[14px]">{applicant.adoptionprofile.user.name}</span>
                                        </div>
                                        <div className="flex flex-col items-left mt-2 md:mt-0">
                                            <span className="text-gray-800">Address</span>
                                            <span className="text-gray-600 text-[14px]">{applicant.adoptionprofile.user.location}</span>
                                        </div>
                                        <div className="flex flex-col items-left mt-2 md:mt-0">
                                            <span className="text-gray-800">Phone number</span>
                                            <span className="text-gray-600 text-[14px]">{applicant.adoptionprofile.user.phoneNumber}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Calendar color="green" />
                                            <span className="text-gray-800">
                                                {new Date(applicant.createdAt).toISOString().slice(0, 10).replace(/-/g, '/')}
                                            </span>
                                        </div>
                                    </div>
                                    <section className="w-full border-3 mb-2 bg-gray-100 rounded-md px-6 space-y-3 border-b ">
                                        <h1 className=" font-semibold mb-4">Home Details</h1>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div>
                                                <p className="font-semibold">Home Situation:</p><p> {applicant.adoptionprofile.home_situation}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Outside Space:</p><p> {applicant.adoptionprofile.outside_space}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Household Setting:</p><p> {applicant.adoptionprofile.household_setting}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Typical Household Activity:</p><p> {applicant.adoptionprofile.household_typical_activity}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Allergy to Pets:</p><p> {applicant.adoptionprofile.allergy ? "Yes" : "No"}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Other Animals in Home:</p><p> {applicant.adoptionprofile.other_animals ? `Yes (${applicant?.adoptionprofile.other_animals_info})` : "No"}</p>
                                            </div>
                                        </div>
                                    </section>
                                    <section className="w-full border-3 mb-2 bg-gray-100 rounded-md px-6 space-y-3 border-b ">
                                        <h1 className="font-semibold mb-4">Life Style and Commitment</h1>
                                        <div className="flex flex-wrap gap-4 text-sm ">
                                            <div>
                                                <p className="font-semibold">Work/Lifestyle:</p> <p className=" break-words max-w-[150px]">{applicant.adoptionprofile.lifestyle}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Moving/Holidays Plan:</p> <p className=" break-words max-w-[150px]">{applicant.adoptionprofile.move_holiday}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Experience with Pets:</p> <p className=" break-words max-w-[150px]">{applicant.adoptionprofile.experience}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Agreement to Terms:</p> <p>{applicant.adoptionprofile.agreement ? "Yes" : "No"}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Minimum Age Preferred:</p> <p>{applicant.adoptionprofile.min_age}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <div className="flex justify-between mt-4">
                                        <Button variant="outline" onClick={() => setChooseApplicantOverlay(false)}>Go Back</Button>
                                        <Button onClick={handleConfirm}>{loading?'Confirming':'Confirm'}</Button>
                                    </div>
                                </div>
                            )
                        )}
                    </CustomModal>
                )}
            </div>
        </div>
    );
}