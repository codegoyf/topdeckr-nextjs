"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Home() {
	const router = useRouter();

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-2xl mx-auto text-center space-y-8">
				<div className="space-y-4">
					<h1 className="text-4xl font-bold tracking-tight">
						Welcome to TopDeckr
					</h1>
					<p className="text-xl text-muted-foreground">
						Build and manage your Magic: The Gathering decks with ease
					</p>
				</div>

				<Card className="w-full max-w-md mx-auto">
					<CardHeader>
						<CardTitle>Get Started</CardTitle>
						<CardDescription>
							Sign up or sign in to start building your decks
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-4">
							<Button
								onClick={() => router.push("/sign-up")}
								className="flex-1"
							>
								Sign Up
							</Button>
							<Button
								onClick={() => router.push("/sign-in")}
								variant="outline"
								className="flex-1"
							>
								Sign In
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
