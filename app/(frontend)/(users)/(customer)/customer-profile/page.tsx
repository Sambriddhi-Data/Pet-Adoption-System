import { auth } from "@/auth";
import { headers } from "next/headers";

export default async function CustomerProfile() {
   const session = await auth.api.getSession({
      headers: await headers()
    });
  
    const user = session?.user;
  
    return (
      <div className='mt-10 text-center'>
        <h1 className='text-2xl font-bold underline'> Customer Information </h1>
        <p>{user?.email}</p>

      </div>
    );
  }
  