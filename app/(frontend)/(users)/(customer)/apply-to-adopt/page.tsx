'use client';

import { useSession } from "@/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ApplytoAdoptButton() {
    const session = useSession();
    const router = useRouter();
    const handleOnCLick = () => {
        router.push("/apply-to-adopt");
    }
    const isdisabled = session?.data?.user?.user_role !== "customer";
    return (
        <>
            <Button onClick={handleOnCLick} disabled = {isdisabled}>Adopt</Button>
        </>
    )
}