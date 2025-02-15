import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import { buttonVariants } from "@/components/ui/button";
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
            <h1>Greetings {user?.name}!! Welcome to Fur-Ever Friends!!</h1>
            <Link className={buttonVariants({
                variant: "default",
            })}
                href="/">Click here to go to homepage</Link>
        </div>
    )
}