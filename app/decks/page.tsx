import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CreateDeckForm } from "./components/create-deck-form";
import { DeckList } from "./components/deck-list";

export default async function DecksPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	// Fetch user's decks
	const decks = await prisma.deck.findMany({
		where: {
			userId: session.user.id,
		},
		orderBy: {
			updatedAt: "desc",
		},
	});

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="flex justify-between items-center">
					<h1 className="text-3xl font-bold">My Decks</h1>
				</div>

				<CreateDeckForm />

				<DeckList decks={decks} />
			</div>
		</div>
	);
}
