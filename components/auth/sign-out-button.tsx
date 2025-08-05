"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
	const router = useRouter();

	return (
		<Button
			onClick={async () =>
				await signOut({
					fetchOptions: {
						onSuccess: () => {
							router.push("/sign-in");
						},
					},
				})
			}
			variant="default"
			className="w-full"
		>
			Sign Out
		</Button>
	);
}
