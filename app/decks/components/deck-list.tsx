import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Deck } from "@/generated/prisma";

interface DeckListProps {
	decks: Deck[];
}

export function DeckList({ decks }: DeckListProps) {
	if (decks.length === 0) {
		return (
			<Card>
				<CardContent className="pt-6">
					<p className="text-center text-muted-foreground">
						You don't have any decks yet. Create your first deck above!
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{decks.map((deck) => (
				<Card key={deck.id} className="hover:shadow-md transition-shadow">
					<CardHeader>
						<CardTitle className="text-lg">{deck.name}</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{deck.description && (
							<p className="text-sm text-muted-foreground">
								{deck.description}
							</p>
						)}
						<div className="flex justify-between items-center text-sm text-muted-foreground">
							<span>0 cards</span>
							<span>{new Date(deck.updatedAt).toLocaleDateString()}</span>
						</div>
						<div className="flex gap-2">
							<Link href={`/decks/${deck.id}`}>
								<Button variant="outline" size="sm" className="flex-1">
									View Deck
								</Button>
							</Link>
							<Button variant="outline" size="sm">
								Edit
							</Button>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
