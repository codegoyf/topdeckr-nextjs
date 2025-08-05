"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Navigation() {
	const pathname = usePathname();

	const isActive = (path: string) => {
		if (path === "/" && pathname === "/") return true;
		if (path !== "/" && pathname.startsWith(path)) return true;
		return false;
	};

	return (
		<NavigationMenu className="max-w-none w-full">
			<NavigationMenuList className="space-x-4">
				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link
							href="/"
							className={cn(
								navigationMenuTriggerStyle(),
								isActive("/") && "bg-accent text-accent-foreground",
							)}
						>
							Home
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link
							href="/dashboard"
							className={cn(
								navigationMenuTriggerStyle(),
								isActive("/dashboard") && "bg-accent text-accent-foreground",
							)}
						>
							Dashboard
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuLink asChild>
						<Link
							href="/decks"
							className={cn(
								navigationMenuTriggerStyle(),
								isActive("/decks") && "bg-accent text-accent-foreground",
							)}
						>
							Decks
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
