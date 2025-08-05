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
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-2xl mx-auto">
				<Card>
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
			</div>
		</div>
	);
}
