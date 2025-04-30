import { getpetcount } from "@/actions/getpetcount";
import { auth } from "@/auth";
import { toast } from "@/hooks/use-toast";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AnalyticsDashboard from "./analytics";

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const user = session?.user;

  if (!session || !user?.id) {
    toast({
      title: "Error",
      description: "Shelter ID not found. Please try again.",
    });
    redirect("/");
  }

  const availableCountResponse = await getpetcount("available", user.id);
  const adoptedCountResponse = await getpetcount("adopted", user.id);

  const availableCount = availableCountResponse?.count || 0;
  const adoptedCount = adoptedCountResponse?.count || 0;

  return (
    <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Shelter Analytics Dashboard</h1>
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="bg-white shadow rounded-lg p-4 flex-1">
            <h2 className="text-gray-500 text-sm">Available Pets</h2>
            <p className="text-2xl font-bold">{availableCount}</p>
          </div>
          <div className="bg-white shadow rounded-lg p-4 flex-1">
            <h2 className="text-gray-500 text-sm">Adopted Pets</h2>
            <p className="text-2xl font-bold">{adoptedCount}</p>
          </div>
        </div>
      <AnalyticsDashboard userId={user.id} />
    </div>
  );
}