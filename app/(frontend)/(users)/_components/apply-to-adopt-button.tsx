'use client'

import { useSession } from "@/auth-client";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ApplytoAdoptButtonProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ApplytoAdoptButton({ open, onOpenChange }: ApplytoAdoptButtonProps) {
    const {data: session} = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const isdisabled = session?.user?.user_role !== "customer";

    let hoverMessage = "";
    if (!session) {
        hoverMessage = "Please sign in first to apply for adoption";
    } else if (session?.user?.user_role === "shelter_manager") {
        hoverMessage = "Shelter Managers are not allowed to apply for adoption";
    } else if (session?.user?.user_role === "admin") {
        hoverMessage = "Admins are not allowed to apply for adoption";
    } else if (session?.user?.user_role === "customer") {
        hoverMessage = "Click to apply for adoption";
    }

    const handleApplyToAdopt = async () => {
        if (!session?.user?.id) {
            toast({
                title: "Error",
				description: "Please sign in first to apply for adoption",
				variant: "destructive",
            })
        }

        setIsLoading(true);

        try {
            // Check if the user has an adoption profile
            const response = await fetch(`/api/adoptionProfile?userId=${session?.user.id}`);
            const data = await response.json();

            if (!data.adoptionProfile) {
                toast({
                    title: "Error",
                    description: "First fill your Adopter Profile first",
                    variant: "destructive",
                })
                router.push(`/customer-profile/${session?.user.id}`);
                return;
            }

            // If the user has an adoption profile, open the adoption form
            onOpenChange(true);
        } catch (error) {
            console.error("Error checking adoption profile:", error);
            toast({
                title: "Error",
                description: "An error occurred. Please try again",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                        <Button className="w-full" onClick={handleApplyToAdopt} disabled={isdisabled || isLoading}>
                            {isLoading ? "Checking..." : "Apply to Adopt"}
                        </Button>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    {hoverMessage}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}