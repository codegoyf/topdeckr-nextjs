import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "TopDeckr - MTG Deck Builder",
	description: "Build and manage your Magic: The Gathering decks",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background`}
			>
				<div className="flex flex-col min-h-screen">
					<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
						<div className="container mx-auto px-4 py-4">
							<Navigation />
						</div>
					</header>
					<main className="flex-1">{children}</main>
				</div>
			</body>
		</html>
	);
}
