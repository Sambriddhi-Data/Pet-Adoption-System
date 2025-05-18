import { auth } from "@/auth";
import { HomePage } from "./homepage";
import { headers } from "next/headers";
import { getPetCountByStatus } from "@/actions/getPetCountByStatus";
import { getClaimedPetCount } from "@/actions/getClaimedPetCount";



export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const adoptedResult = await getPetCountByStatus('adopted');
  const claimedResult = await getClaimedPetCount('claimed');
  return (
    <div>
      <HomePage initialSession={session} adoptedPetC={adoptedResult.count} claimedPetC={claimedResult.count} />
    </div>
  );
}
