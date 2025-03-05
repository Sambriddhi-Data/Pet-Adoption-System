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
            {
                session?.data?.user?.user_role !== "customer" &&
                <div>You need to sign in before applying for adoption</div>
            }
            <Button onClick={handleOnCLick} disabled = {isdisabled}>Apply to Adopt</Button>
        </>
    )
}