import { ArrowLeft, Plus } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface DeckPageProps {
	params: {
		id: string;
	};
}

export default async function DeckPage({ params }: DeckPageProps) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session) {
		redirect("/sign-in");
	}

	const deck = await prisma.deck.findUnique({
		where: {
			id: params.id,
			userId: session.user.id,
		},
		include: {
			deckCards: {
				include: {
					card: true,
				},
				orderBy: {
					createdAt: "asc",
				},
			},
		},
	});

	if (!deck) {
		notFound();
	}

	const totalCards = deck.deckCards.reduce((sum, deckCard) => sum + deckCard.quantity, 0);

	return (
		<div className="container mx-auto py-8 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link href="/decks">
						<Button variant="outline" size="sm">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Decks
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold">{deck.name}</h1>
						{deck.description && (
							<p className="text-muted-foreground mt-1">{deck.description}</p>
						)}
					</div>
				</div>
				<Button>
					<Plus className="h-4 w-4 mr-2" />
					Add Card
				</Button>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">{totalCards}</div>
						<div className="text-sm text-muted-foreground">Total Cards</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">{deck.deckCards.length}</div>
						<div className="text-sm text-muted-foreground">Unique Cards</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="pt-6">
						<div className="text-2xl font-bold">
							{new Date(deck.updatedAt).toLocaleDateString()}
						</div>
						<div className="text-sm text-muted-foreground">Last Updated</div>
					</CardContent>
				</Card>
			</div>

			{/* Cards List */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Cards</h2>
				{deck.deckCards.length === 0 ? (
					<Card>
						<CardContent className="pt-6">
							<p className="text-center text-muted-foreground">
								This deck is empty. Add some cards to get started!
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-4">
						{deck.deckCards.map((deckCard) => (
							<Card key={deckCard.id}>
								<CardContent className="pt-6">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-4">
											<Badge variant="secondary">{deckCard.quantity}x</Badge>
											<div>
												<h3 className="font-medium">{deckCard.card.name}</h3>
												<p className="text-sm text-muted-foreground">
													{deckCard.card.typeLine} • {deckCard.card.colors.join(", ")}
												</p>
											</div>
										</div>
										<div className="flex gap-2">
											<Button variant="outline" size="sm">
												Edit
											</Button>
											<Button variant="outline" size="sm">
												Remove
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
