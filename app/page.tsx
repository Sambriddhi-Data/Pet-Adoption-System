import { auth } from "@/auth";
import { HomePage } from "./homepage";
import { headers } from "next/headers";
import { getPetCountByStatus } from "@/actions/getPetCountByStatus";
import { getClaimedPetCount } from "@/actions/getClaimedPetCount";
import Footer from "@/components/Footer";
import { getRehomedPetCountByStatus } from "@/actions/getRehomeStats";



export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const adoptedResult = await getPetCountByStatus('adopted');
  const claimedResult = await getClaimedPetCount('claimed');
  const rehomedResult = await getRehomedPetCountByStatus('approved');
  return (
    <div>
      <HomePage initialSession={session} adoptedPetC={adoptedResult.count} claimedPetC={claimedResult.count} rehomedPetC = {rehomedResult.count}/>
      <Footer />
    </div>
  );
}
