"use client";

import { updateLostPetStatus } from "@/actions/getAllAlerts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LostPets } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

interface AlertItemProps {
    alert: LostPets;
}

function AlertItem({ alert }: AlertItemProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleMarkAsClaimed = async () => {
        startTransition(async () => {
            const result = await updateLostPetStatus(alert.id, "claimed");
            if (result.success) {
                router.refresh();
            } else {
                console.error("Failed to update status:", result.error);
                window.alert(`Error: ${result.error}`);
            }
        });
    };

    return (
        <TableRow>
            <TableCell>{alert.name}</TableCell>
            <TableCell>{alert.location}</TableCell>
            <TableCell>{alert.phoneNumber}</TableCell>
            <TableCell>{alert.status || "N/A"}</TableCell>
            <TableCell>
                {alert.image && alert.image.length > 0 && (
                    alert.image.map((imgSrc, index) => (
                        <img
                            key={index}
                            src={imgSrc}
                            alt={`${alert.name} ${index + 1}`}
                            style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "5px", marginTop: "5px" }}
                        />
                    ))
                )}
            </TableCell>
            <TableCell>{new Date(alert.createdAt).toLocaleString()}</TableCell>
            <TableCell>
                {(alert.status?.toLowerCase() === "lost" || alert.status?.toLowerCase() === "found") && (
                    <Button onClick={handleMarkAsClaimed} disabled={isPending} style={{ padding: "5px 10px" }}>
                        {isPending ? "Updating..." : "Mark as Claimed"}
                    </Button>
                )}
                {alert.status?.toLowerCase() === "claimed" && (
                    <Button style={{ color: "green", fontWeight: "bold" }} className="pl-3" variant="outline">Claimed</Button>
                )}
            </TableCell>
        </TableRow>
    );
}

interface AlertsClientProps {
    initialAlerts: LostPets[];
}

export default function AlertsClient({ initialAlerts }: AlertsClientProps) {
    if (!initialAlerts || initialAlerts.length === 0) {
        return <p>No pet alerts found at the moment.</p>;
    }

    return (
        <>
            <main className="max-w-7xl mx-auto p-4">
                <Table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                    <TableHeader>
                        <TableRow style={{ borderBottom: "2px solid #eee" }}>
                            <TableHead style={{ textAlign: "left", padding: "8px" }}>Name</TableHead>
                            <TableHead style={{ textAlign: "left", padding: "8px" }}>Location</TableHead>
                            <TableHead style={{ textAlign: "left", padding: "8px" }}>Contact</TableHead>
                            <TableHead style={{ textAlign: "left", padding: "8px" }}>Status</TableHead>
                            <TableHead style={{ textAlign: "left", padding: "8px" }}>Images</TableHead>
                            <TableHead style={{ textAlign: "left", padding: "8px" }}>Reported At</TableHead>
                            <TableHead style={{ textAlign: "left", padding: "8px" }}>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody >
                        {initialAlerts.map((alert) => (
                            <AlertItem key={alert.id} alert={alert} />
                        ))}
                    </TableBody>
                </Table>
            </main>
        </>
    );
}