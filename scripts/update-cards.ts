import prisma from "../lib/prisma";

interface ScryfallCard {
	oracle_id: string;
	name: string;
	mana_cost?: string;
	type_line: string;
	oracle_text?: string;
	color_identity: string[];
	cmc?: number;
	rarity?: string;
	set?: string;
	collector_number?: string;
	image_uris?: {
		normal?: string;
	};
}

async function updateCardsEfficient() {
	console.log("Starting efficient card data update...");

	try {
		// 1. Fetch bulk data metadata from Scryfall
		console.log("Fetching bulk data metadata...");
		const response = await fetch(
			"https://api.scryfall.com/bulk-data/oracle-cards",
		);
		const bulkData = await response.json();

		console.log(`Bulk data last updated: ${bulkData.updated_at}`);

		// 2. Download the actual card data
		console.log("Downloading card data...");
		const cardsResponse = await fetch(bulkData.download_uri);
		const allCards: ScryfallCard[] = await cardsResponse.json();

		console.log(`Processing ${allCards.length} cards...`);

		// 3. Process cards in smaller batches to work within Accelerate limits
		const batchSize = 1000;
		let processedCards = 0;

		for (let i = 0; i < allCards.length; i += batchSize) {
			const batch = allCards.slice(i, i + batchSize);
			console.log(
				`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allCards.length / batchSize)} (${batch.length} cards)...`,
			);

			// Transform batch cards
			const cardData = batch.map((card) => ({
				scryfallId: card.oracle_id,
				name: card.name,
				manaCost: card.mana_cost || null,
				typeLine: card.type_line,
				oracleText: card.oracle_text || null,
				colors: card.color_identity,
				cmc: card.cmc || null,
				rarity: card.rarity || null,
				setCode: card.set || null,
				collectorNumber: card.collector_number || null,
				imageUrl: card.image_uris?.normal || null,
				updatedAt: new Date(),
			}));

			// Use createMany for new cards and individual updates for existing ones
			await prisma.$transaction(
				async (tx) => {
					// Get existing card IDs for this batch
					const existingCards = await tx.card.findMany({
						where: {
							scryfallId: {
								in: cardData.map((card) => card.scryfallId),
							},
						},
						select: { scryfallId: true },
					});
					const existingIds = new Set(
						existingCards.map((card) => card.scryfallId),
					);

					// Separate new cards from existing cards
					const newCards = cardData.filter(
						(card) => !existingIds.has(card.scryfallId),
					);
					const existingCardsToUpdate = cardData.filter((card) =>
						existingIds.has(card.scryfallId),
					);

					// Bulk create new cards
					if (newCards.length > 0) {
						await tx.card.createMany({
							data: newCards,
							skipDuplicates: true,
						});
						console.log(`Created ${newCards.length} new cards`);
					}

					// Update existing cards in smaller sub-batches
					if (existingCardsToUpdate.length > 0) {
						const updateBatchSize = 100;
						for (
							let j = 0;
							j < existingCardsToUpdate.length;
							j += updateBatchSize
						) {
							const updateBatch = existingCardsToUpdate.slice(
								j,
								j + updateBatchSize,
							);

							await Promise.all(
								updateBatch.map((card) =>
									tx.card.updateMany({
										where: { scryfallId: card.scryfallId },
										data: {
											name: card.name,
											manaCost: card.manaCost,
											typeLine: card.typeLine,
											oracleText: card.oracleText,
											colors: card.colors,
											cmc: card.cmc,
											rarity: card.rarity,
											setCode: card.setCode,
											collectorNumber: card.collectorNumber,
											imageUrl: card.imageUrl,
											updatedAt: card.updatedAt,
										},
									}),
								),
							);
						}
						console.log(
							`Updated ${existingCardsToUpdate.length} existing cards`,
						);
					}
				},
				{
					timeout: 20000, // 10 second timeout per batch
				},
			);

			processedCards += batch.length;
			console.log(
				`Completed batch. Total processed: ${processedCards}/${allCards.length}`,
			);
		}

		console.log("Card data update completed successfully!");

		// 4. Log summary
		const totalCards = await prisma.card.count();
		console.log(`Total cards in database: ${totalCards}`);
	} catch (error) {
		console.error("Error updating cards:", error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the script
updateCardsEfficient();
