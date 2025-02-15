"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { User } from "@prisma/client";
import { useState, useEffect } from "react";
import { admin } from "@/auth-client";
import { Button } from "@/components/ui/button";

export default function UsersTable() {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	// Function to handle user shelter verification
	async function verifyUser(userId: string) {
		try {
			const response = await fetch("/api/shelters", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId }),
			});

			const data = await response.json();

			if (data.success) {
				alert("User verified successfully!");
				// Update the UI to reflect the change
				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.id === userId ? { ...user, isVerifiedUser: true } : user
					)
				);
			} else {
				alert(data.message || "Verification failed");
			}
		} catch (err) {
			alert("An error occurred while verifying the user.");
		}
	}

	// Function to add the user as a shelter 

	async function addShelter(userId: string) {
		try {
			const response = await fetch("/api/addShelter", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId }),
			});

			const data = await response.json();

			if (data.success) {
				alert("Shelter added successfully!");
			} else {
				alert(data.message || "Failed to add shelter.");
			}
		} catch (err) {
			alert("An error occurred while adding the shelter.");
		}
	}

	async function handleVerifyAndAddShelter(userId: string) {
		// First, verify the user
		await verifyUser(userId);

		// Then, add the shelter
		await addShelter(userId);
	}

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setIsLoading(true);

				const response = await admin.listUsers({
					query: {
						limit: 10,
						sortBy: "createdAt",
					},
				});
				if (response?.data) {
					setUsers(response.data.users as User[]);
				}
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Failed to fetch users")
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUsers();
	}, []);

	if (isLoading) {
		return (
			<div className="flex justify-center p-4">
				<span>Loading users...</span>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center p-4">
				<span className="text-red-500">Error: {error.message}</span>
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Verified</TableHead>
					<TableHead>Phone Number</TableHead>
					<TableHead>Joined</TableHead>
					<TableHead>Verify Shelter</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user.id}>
						<TableCell>{user.name}</TableCell>
						<TableCell>{user.email}</TableCell>
						<TableCell>{user.role}</TableCell>
						<TableCell>{user.isVerifiedUser ? "Yes" : "No"}</TableCell>
						<TableCell>{user.phoneNumber}</TableCell>
						<TableCell>
							{new Date(user.createdAt).toLocaleDateString()}
						</TableCell>
						<TableCell>
							{user.role === "shelter_manager" ? (
								user.isVerifiedUser === false ? (
									<Button onClick={() => handleVerifyAndAddShelter(user.id)}>Verify</Button>
								) :
									<p className="pl-3">Verified</p>

							) :
								<p className="text-neutral-500">Unavailable</p>
							}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
