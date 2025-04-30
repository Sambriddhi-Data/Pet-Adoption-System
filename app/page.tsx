import { auth } from "@/auth";
import { HomePage } from "./homepage";
import { headers } from "next/headers";
import { getAdoptedPetCount } from "@/actions/getAdoptedPetCount";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  return (
    <div>
      <HomePage initialSession={session} />
    </div>
  );
}
