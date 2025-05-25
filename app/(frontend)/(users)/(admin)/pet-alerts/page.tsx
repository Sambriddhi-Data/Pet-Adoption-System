import { getAllLostPetAlerts } from "@/actions/getAllAlerts";
import AlertsClient from "./alerts"; // We'll name the client component export AlertsClient
import { Card, CardHeader } from "@/components/ui/card";

export default async function PetAlertsPage() { // Renamed for clarity, ensure your routing matches
    const alerts = await getAllLostPetAlerts();

    return (
        <>
            <Card className="max-w-7xl mx-auto mt-6 p-6">
                <CardHeader className="text-3xl font-bold px-6">Manage Pet Alerts</CardHeader>
                <AlertsClient initialAlerts={alerts} />
            </Card>
        </>
    );
}