'use client'

import { useSession } from "@/auth-client";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ApplytoAdoptButtonProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ApplytoAdoptButton= ({ open, onOpenChange }: ApplytoAdoptButtonProps) => {
    const {data: session} = useSession();
    const router = useRouter();
    const { petId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [hasExistingApplication, setHasExistingApplication] = useState(false);

    useEffect(() => {
        const checkExistingApplication = async () => {
            if (session?.user?.id && petId) {
                try {
                    const response = await fetch(`/api/checkExistingApplication?userId=${session.user.id}&petId=${petId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setHasExistingApplication(data.exists);
                    }
                } catch (error) {
                    console.error("Error checking existing application:", error);
                }
            }
        };

        checkExistingApplication();
    }, [session?.user?.id, petId]);

    const isRoleDisabled = session?.user?.user_role !== "customer";
    const isdisabled = isRoleDisabled || hasExistingApplication;

    let hoverMessage = "";
    if (!session) {
        hoverMessage = "Please sign in first to apply for adoption";
    } else if (session?.user?.user_role === "shelter_manager") {
        hoverMessage = "Shelter Managers are not allowed to apply for adoption";
    } else if (session?.user?.user_role === "admin") {
        hoverMessage = "Admins are not allowed to apply for adoption";
    } else if (hasExistingApplication) {
        hoverMessage = "You've already applied to adopt this pet";
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
            return;
        }

        if (hasExistingApplication) {
            toast({
                title: "Already Applied",
                description: "You've already applied to adopt this pet",
                variant: "default",
            })
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`/api/adoptionProfile?userId=${session?.user.id}`);
            const data = await response.json();

            if (!data.adoptionProfile) {
                toast({
                    title: "Error",
                    description: "First fill your Adopter Profile first",
                    variant: "destructive",
                })
                router.push(`/customer-profile/${session?.user.id}?active=editProfile`);
                return;
            }

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
                            {isLoading ? "Checking..." : hasExistingApplication ? "Already Applied" : "Apply to Adopt"}
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
export default ApplytoAdoptButton;