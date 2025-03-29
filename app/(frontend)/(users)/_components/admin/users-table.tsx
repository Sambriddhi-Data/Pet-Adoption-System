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
import LoadingButton from "@/components/loading-button";
import { useToast } from "@/hooks/use-toast";

export default function UsersTable() {
	const [users, setUsers] = useState<User[]>([]);
	const [pendingUserId, setPendingUserId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const { toast } = useToast();

	// Function to handle user shelter verification
	async function verifyUser(userId: string) {
		try {
			const response = await fetch("/api/shelters", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId }),
			});
			const data = await response.json();
			if (data.success) {
				setUsers((prevUsers) =>
					prevUsers.map((user) =>
						user.id === userId ? { ...user, isVerifiedUser: true } : user
					)
				);
			} else {
				throw new Error(data.message || "Verification failed");
			}
		} catch (err) {
			console.error("Error verifying user:", err);
			toast({
				title: "Error",
				description: "An error occurred while verifying the user.",
				variant: "destructive",
			})
		}
	}

	// Function to add the user as a shelter
	async function addShelter(userId: string) {
		try {
			const response = await fetch("/api/addShelter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId }),
			});
			const data = await response.json();
			if (!data.success) {
				throw new Error(data.message || "Failed to add shelter.");
			}
		} catch (err) {
			console.error("Error adding shelter:", err);
			toast({
				title: "Error",
				description: "An error occurred while adding the shelter.",
				variant: "destructive",
			})
		}
	}

	// Function to send verification email
	async function sendVerifiedEmail(userName: string, userEmail: string) {
		try {
			const response = await fetch("/api/sendVerifiedMail", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userName, userEmail }),
			});
			const data = await response.json();
			if (!data.accepted) {
				throw new Error(data.message || "Failed to send email.");
			}
		} catch (err) {
			console.error("Error sending email:", err);
			toast({
				title: "Error",
				description: "An error occurred while sending the verified message to the shelter.",
				variant: "destructive",
			})
		}
	}

	async function handleVerifyAndAddShelter(userId: string, userName: string, userEmail: string) {
		setPendingUserId(userId);
	
		try {
			await Promise.all([
				verifyUser(userId),
				addShelter(userId),
				sendVerifiedEmail(userName, userEmail),
			]);
	
			toast({
				title: "Shelter Added Successfully!🎉",
				description: "Shelter verified and email sent successfully!",
				variant: "success",
			});
		} catch (err) {
			console.error("Error during shelter verification:", err);
			alert("Something went wrong during the verification process.");
		}
	
		setPendingUserId(null);
	}

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				setIsLoading(true);
				const response = await admin.listUsers({
					query: { limit: 10, sortBy: "createdAt", filterField: "user_role", filterValue: "shelter_manager" },
				});
				if (response?.data) {
					setUsers(response.data.users as User[]);
				}
			} catch (err) {
				setError(err instanceof Error ? err : new Error("Failed to fetch users"));
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
						<TableCell>{user.user_role}</TableCell>
						<TableCell>{user.isVerifiedUser ? "Yes" : "No"}</TableCell>
						<TableCell>{user.phoneNumber}</TableCell>
						<TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
						<TableCell>
							{user.user_role === "shelter_manager" ? (
								user.isVerifiedUser === false ? (
									<LoadingButton
										pending={pendingUserId === user.id}
										onClick={() => handleVerifyAndAddShelter(user.id, user.name, user.email)}
									>
										Verify
									</LoadingButton>
								) : (
									<p className="pl-3">Verified</p>
								)
							) : (
								<p className="text-neutral-500">Unavailable</p>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
