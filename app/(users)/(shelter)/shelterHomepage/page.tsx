import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function shelterHomepage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  const user = session?.user;

    return (
      <div className='mt-10 text-center'>
        <h1 className='text-2xl font-bold underline'> Shelter Homepage </h1>
        <ul>
          <li>First Name: {user?.name}</li>
          <li>Email: {user?.email}</li>
        </ul>
        
      </div>
    );

}