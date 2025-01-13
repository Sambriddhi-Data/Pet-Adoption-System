'use client'

import { useSession } from "@/auth-client";

export default function ShelterHomepage() {
    const session = useSession();
  
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const user = session?.data?.user;

    return (
      <div className='mt-10 text-center'>
        <h1 className='text-2xl font-bold underline'> Welcome to Shelter Homepage </h1>
        <ul>
          <li>Shelter Name: {user?.name}</li>
        </ul>
        
      </div>
    );

}