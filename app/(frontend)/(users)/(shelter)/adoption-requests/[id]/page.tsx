'use client'

import { useState, useEffect } from "react";
import { useSession } from "@/auth-client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CldImage } from "next-cloudinary";
import { Calendar, Check, ChevronsUpDown } from "lucide-react";
import { AdoptionRequest } from "../../../_components/type";
import AdopterProfileOverlay from "../../../_components/shelters/adopter-profile-overlay";
import { CustomModal } from "@/components/custom-modal";
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
import classNames from "classnames";
import { API_ROUTES } from "@/lib/apiRoutes";
import { set } from "lodash";

const statuses = [
    { value: "unprocessed", label: "Unprocessed" },
    { value: "rejected", label: "Rejected" },
    { value: "approved", label: "Approved" },
]

export default function AdoptionRequests() {
    const [requests, setRequests] = useState<AdoptionRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [filteredRequests, setFilteredRequests] = useState<AdoptionRequest[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const session = useSession();
    const userId = session?.data?.user?.id;
    const [modalOpen, setModalOpen] = useState(false);

    const fetchAdoptionRequests = async (page: number) => {
        if (!userId) {
            toast({
                title: "Error",
                description: "User ID is not available",
                variant: "destructive",
            })
            return;
        }
        try {
            const response = await fetch( API_ROUTES.adoptionRequests(page, userId, selectedStatuses));
            const data = await response.json();
            setRequests(data.data);
            setFilteredRequests(data.data);
            setTotalPages(data.pagination.totalPages);
            console.log("Total pages: ", data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching adoption requests:", error);
            toast({
                title: "Error",
                description: "Failed to fetch adoption requests",
                variant: "destructive",
            })
        }
    };
    
    useEffect(() => {
        if (userId) {
            fetchAdoptionRequests(currentPage);
        }
    }, [currentPage, session, selectedStatuses]);
    
    
    const handleOnOpen = (request: AdoptionRequest) => {
        setSelectedRequest(request),
        setModalOpen(true);
    }
    
    const handleOnClose = () => {
        setModalOpen(false);
        setSelectedRequest(null);
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
    
    const filterRequests = () => {
       setFilteredRequests(requests);
    };
    
    useEffect(() => {
        setCurrentPage(1); // Reset page when filters change
    }, [selectedStatuses]);
    
    useEffect(() => {
        filterRequests();
    }, [requests]);
    
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

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
            // console.log("Current: ",currentPage);
        }
    };
    
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    return (
        <div className="p-6 flex flex-col">
            <Card className="w-72 p-4 mb-4">
                <h1>Filter Applications</h1>
                <StatusFilter />
            </Card>
            <div className=" ">
                <div className="w-full mb-4 space-y-2 ">
                    {filteredRequests.map((request) => (
                        <Card key={request.id} onClick={() => handleOnOpen(request)} className=" p-6 cursor-pointer w-full hover:bg-gray-100">
                            <div className="flex justify-between p-2 border-b space-x-4">
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
                                <div className="flex flex-col items-left">
                                    <span className="text-gray-800">Full Name</span>
                                    <span className="text-gray-600 text-[14px]" >{request.adoptionprofile.user.name}</span>
                                </div>
                                <div className="flex flex-col items-left">
                                    <span className="text-gray-800">Address</span>
                                    <span className="text-gray-600 text-[14px]" >{request.adoptionprofile.user.location}</span>
                                </div>
                                <div className="flex flex-col items-left">
                                    <span className="text-gray-800">Phone number</span>
                                    <span className="text-gray-600 text-[14px]" >{request.adoptionprofile.user.phoneNumber}</span>

                                </div>
                                <div className="flex space-x-1">
                                    <Calendar color="green" />
                                    <span className="text-gray-800">
                                        {new Date(request.createdAt).toISOString().slice(0, 10).replace(/-/g, '/')}
                                    </span>
                                </div>
                                <div>
                                    <div className={classNames({
                                        "rounded-lg text-xs w-fit h-fit py-2 px-6 mt-2 ": true,
                                        "bg-yellow-400 bg-opacity-50": request.status === "unprocessed",
                                        "bg-red-400 bg-opacity-50": request.status === "rejected",
                                        "bg-green-400 bg-opacity-50": request.status === "approved"
                                    })}>
                                        {request.status.toUpperCase()}
                                    </div>
                                    <div className="bg-gray-100 p-2 rounded-lg mt-2 break-words max-w-[250px]">
                                        {request.message}

                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-center">
                    <div className='flex justify-center mt-6 space-x-2'>
                        <Button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >Previous</Button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <Button
                            onClick={handleNextPage}
                            disabled={currentPage === (totalPages)}
                        >  Next  </Button>
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
            </div>
        </div>
    );
}