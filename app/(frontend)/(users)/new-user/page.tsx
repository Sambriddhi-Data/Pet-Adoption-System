import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { headers } from "next/headers";
import Link from "next/link";

export default async function NewUser() {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const user = session?.user;

    return (
        <div className="">
            <Navbar />
            <Card className='m-10 p-20 space-y-4 text-center opacity-85'>
                <h1>Greetings {user?.name}!! Welcome to Fur-Ever Friends!!</h1>
                <Link className={buttonVariants({
                    variant: "default",
                })}
                    href="/">Click here to go to homepage</Link>
            </Card>
        </div>
    )
}