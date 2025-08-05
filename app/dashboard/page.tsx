import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	return (
		<main className="flex items-center justify-center min-h-screen p-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Dashboard</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground">
						Welcome, {session.user.name || "User"}!
					</p>
					<p className="text-muted-foreground">Email: {session.user.email}</p>
					<SignOutButton />
				</CardContent>
			</Card>
		</main>
	);
}
