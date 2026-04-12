import { signOutServer } from "@/features/auth/actions/server";
import { toast } from "sonner";
import SignedIn from "./SignedIn";
import { useRouter } from "@tanstack/react-router";
import { ActionButton } from "@/components/ui/action-button";

export default function SignOutButton() {
  const router = useRouter();
  async function handleSignOut() {
    try {
      const { success } = await signOutServer();

      if (success) {
        toast.success("Signed out successfully");
        router.navigate({ to: "/" });
      } else {
        toast.error("Failed to sign in");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    }
  }
  return (
    <SignedIn>
      <ActionButton
        action={async () => await handleSignOut()}
        variant="destructive"
        onClick={handleSignOut}
      >
        Sign Out
      </ActionButton>
    </SignedIn>
  );
}
