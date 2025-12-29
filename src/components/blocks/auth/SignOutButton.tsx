import { Button } from "@/components/ui/button";
import { signOutServer } from "@/features/auth/actions/server";
import { toast } from "sonner";

export default function SignOutButton() {
  const signOut = async () => {
    try {
      const { success } = await signOutServer();
      if (success) {
        toast.success("Signed out successfully");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error signing out");
    }
  };
  return (
    <Button variant="destructive" onClick={signOut}>
      Sign Out
    </Button>
  );
}
