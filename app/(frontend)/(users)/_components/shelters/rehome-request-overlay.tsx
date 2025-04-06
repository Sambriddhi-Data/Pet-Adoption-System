'use client';
import { Button } from "@/components/ui/button";
import { RehomeRequest } from "../type";
import { Calendar } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";


interface RehomeRequestOverlayProps {
    request: RehomeRequest;
    onClose: () => void;
    refreshRequests: () => void;
}

const RehomeRequestOverlay: React.FC<RehomeRequestOverlayProps> = ({ request, onClose, refreshRequests}) => {
    const [status, setStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const fetchRequestStatus = async () => {
        if (!request.id) return;
        try {
            const response = await fetch(`api/getRehomeRequestStatus?requestId=${request.id}`);
            const data = await response.json();
            setStatus(data.request.status);
        } catch (error) {
            console.error("Error fetching rehome request status:", error);
            toast({
                title: "Error",
                description: "Failed to fetch request status",
                variant: "destructive"
            });
        }
    }
    useEffect(() => {
        fetchRequestStatus();
    }, [status]);

    const handleAccept = async () => {
        if (!request.id) return;
        try {
            const response = await fetch(`api/acceptRehomeRequest?requestId=${request.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (response.ok) {
                setStatus("approved");
                toast({
                    title: "Rehome Request Accepted",
                    description: "The rehome request has been accepted successfully.",
                    variant: "success"
                });
                refreshRequests();
                onClose();
            }
        }
        catch (error) {
            console.error("Error accepting rehome request:", error);
            toast({
                title: "Error",
                description: "Failed to accept request",
                variant: "destructive"
            });
        }
    };

    const handleReject = async () => {
        if (!request.id) return;
        try {
            const response = await fetch(`api/rejectRehomeRequest?requestId=${request.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (response.ok) {
                setStatus("rejected");
                toast({
                    title: "Rehome Request Rejected",
                    description: "The rehome request has been rejected successfully.",
                    variant: "success"
                });
                refreshRequests();
                onClose();
            }
        }
        catch (error) {
            console.error("Error rejecting rehome request:", error);
            toast({
                title: "Error",
                description: "Failed to reject request",
                variant: "destructive"
            });
        }
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg w-full relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {request.image.map((imgUrl, index) => (
                    <div
                        key={index}
                        className="w-full aspect-[4/3] overflow-hidden rounded-lg shadow-md"
                    >
                        <CldImage
                            src={imgUrl}
                            width="400"
                            height="300"
                            alt={`${request.petName} - ${index + 1}`}
                            crop={{
                                type: 'fill',
                                source: true
                            }}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap justify-between p-2 border-b space-x-4">
                {[
                    { label: "Requester's Name", value: request.user.name },
                    { label: "Address", value: request.user.location },
                    { label: "Email", value: request.user.email, extraClasses: "break-words max-w-[200px]" },
                    { label: "Phone number", value: request.user.phoneNumber },
                ].map((item, index) => (
                    <div key={index} className="flex flex-col">
                        <span className="text-gray-800">{item.label}</span>
                        <span className={`text-gray-600 text-[14px] ${item.extraClasses || ""}`}>
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex gap-1 p-2">
                <Calendar size={22} color="green" />
                <span className="text-gray-800">{new Date(request.createdAt).toLocaleDateString()}</span>
            </div>

            <h2 className="text-xl font-bold mb-2">{request.user.name}'s Rehome Request</h2>

            <section className="w-full border-3 mb-2 bg-gray-100 rounded-md px-4 py-2 space-y-3 border-b ">
                <h1 className=" font-semibold mb-4">Home Details</h1>
                <div className="flex flex-wrap gap-4 text-sm">
                    {[
                        { label: "Pet Name", value: request.petName },
                        { label: "Bonded Pets?", value: request.isBonded ? `Yes` : "No" },
                        { label: "Reason(s) for rehome request", value: request.rehomeReason.join(", "), extraClasses: "break-words max-w-[235px]" },
                        { label: "Keep Duration", value: request.keepDuration },
                        { label: "Species", value: request.species },
                        { label: "Over 18?", value: request.isOver18 ? `Yes` : "No" },
                    ].map((item, index) => (
                        <div key={index} className="flex flex-col">
                            <span className="font-semibold">{item.label}</span>
                            <span className={`text-gray-800 ${item.extraClasses || ""}`}>
                                {item.value}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {request.status !== "unprocessed" ?
                <div className="flex justify-between mt-4">
                    <Button className="bg-red-500 text-white hover:bg-red-600" disabled>
                        Reject
                    </Button>
                    <Button disabled>
                        Accepted
                    </Button>
                </div> :
                <div className="flex justify-between mt-4">
                    <Button onClick={handleReject} className="bg-red-500 text-white hover:bg-red-600">
                        Reject
                    </Button>
                    <Button onClick={handleAccept} >
                        Accept
                    </Button>
                </div>
            }


        </div>
    );
};

export default RehomeRequestOverlay;
