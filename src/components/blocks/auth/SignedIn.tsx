import { checkIsAuthenticatedServer } from "@/features/auth/actions/server";
import { ReactNode } from "react";

const { isAuthenticated } = await checkIsAuthenticatedServer();
export default function SignedIn({ children }: { children: ReactNode }) {

  if (!isAuthenticated) {
    return null;
  }
  
  return <div>{children}</div>;
}
