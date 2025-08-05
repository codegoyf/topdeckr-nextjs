"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createDeck } from "../actions";

export function CreateDeckForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	async function handleSubmit(formData: FormData) {
		setIsLoading(true);
		setError(null);

		try {
			const result = await createDeck(formData);

			if (result.error) {
				setError(result.error);
			} else {
				// Refresh the page to show the new deck
				router.refresh();
				// Reset the form
				const form = document.getElementById(
					"create-deck-form",
				) as HTMLFormElement;
				form?.reset();
			}
		} catch (_err) {
			setError("Something went wrong. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Create New Deck</CardTitle>
			</CardHeader>
			<CardContent>
				<form id="create-deck-form" action={handleSubmit} className="space-y-4">
					{error && <p className="text-destructive text-sm">{error}</p>}

					<div className="space-y-2">
						<label htmlFor="name" className="text-sm font-medium">
							Deck Name
						</label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="Enter deck name"
							required
							disabled={isLoading}
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="description" className="text-sm font-medium">
							Description (Optional)
						</label>
						<Input
							id="description"
							name="description"
							type="text"
							placeholder="Enter deck description"
							disabled={isLoading}
						/>
					</div>

					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Creating..." : "Create Deck"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
