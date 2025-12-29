import { SignUpForm } from "@/features/auth/components/sign-up/SignUpForm";
import { generateMetadata } from "@/lib/utils";
import { preventRedundantAuthMiddleware } from "@/middleware/authMiddleware";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/sign-up/")({
  component: RouteComponent,
  server: {
    middleware: [preventRedundantAuthMiddleware],
  },
  head: () =>
    generateMetadata({
      title: "Sign Up",
    }),
});

function RouteComponent() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-4">
      <SignUpForm />
    </main>
  );
}
