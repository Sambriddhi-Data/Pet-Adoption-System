import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "../../_components/admin/users-table";
import UserGrowthChart from "../../_components/admin/user-graph";
import AnimalLineChart from "../../_components/admin/pet-graph";
import DonationChart from "../../_components/admin/donation-chart";
import DonationTable from "../../_components/admin/donation-table";

export default async function AdminDashboard() {
	return (
		<main className="flex flex-col p-6">
			<div className="flex flex-col gap-4 max-w-7xl mx-auto w-full">
				<div className="flex flex-col gap-2 mb-8">
					<h1 className="text-3xl font-bold">Admin Dashboard</h1>
					<p className="text-muted-foreground">
						Manage users and view system statistics
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Users</CardTitle>
					</CardHeader>
					<CardContent>
						<UsersTable />
					</CardContent>
				</Card>

				<h1 className="text-4xl font-bold">User Growth Chart</h1>

				<UserGrowthChart />

				<h1 className="mt-10 text-4xl font-bold">
					Animals Registered in the System
				</h1>
				<AnimalLineChart />

				<h1 className="mt-10 text-4xl font-bold">Donation Analytics</h1>
				<DonationChart />

				<h1 className="mt-10 text-4xl font-bold">Donation Summary</h1>
				<DonationTable />
			</div>
		</main>
	);
}