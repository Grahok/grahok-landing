import { SignInForm } from "@/features/auth/components/sign-in/SignInForm";
import { generateMetadata } from "@/lib/utils";
import { preventRedundantAuthMiddleware } from "@/middleware/authMiddleware";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-in/")({
  component: RouteComponent,
  server: {
    middleware: [preventRedundantAuthMiddleware],
  },
  head: () =>
    generateMetadata({
      title: "Sign In",
    }),
});

function RouteComponent() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-4">
      <SignInForm />
    </main>
  );
}
