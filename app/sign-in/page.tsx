"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);

		const formData = new FormData(e.currentTarget);

		const res = await signIn.email({
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		});

		if (res.error) {
			setError(res.error.message || "Something went wrong.");
		} else {
			router.push("/dashboard");
		}
	}

	return (
		<main className="flex items-center justify-center min-h-screen p-6">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Sign In</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && <p className="text-destructive text-sm">{error}</p>}

					<form onSubmit={handleSubmit} className="space-y-4">
						<Input name="email" type="email" placeholder="Email" required />
						<Input
							name="password"
							type="password"
							placeholder="Password"
							required
						/>
						<Button type="submit" className="w-full">
							Sign In
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}
