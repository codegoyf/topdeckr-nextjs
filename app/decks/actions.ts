"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function createDeck(formData: FormData) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session) {
		redirect("/sign-in");
	}

	const name = formData.get("name") as string;
	const description = formData.get("description") as string;

	if (!name || name.trim().length === 0) {
		return { error: "Deck name is required" };
	}

	try {
		const deck = await prisma.deck.create({
			data: {
				name: name.trim(),
				description: description?.trim() || null,
				userId: session.user.id,
			},
		});

		revalidatePath("/decks");
		return { success: true, deck };
	} catch (error) {
		console.error("Error creating deck:", error);
		return { error: "Failed to create deck. Please try again." };
	}
}
