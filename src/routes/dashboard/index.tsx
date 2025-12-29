import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserServer } from "@/features/auth/actions/server";
import SignOutButton from "@/features/auth/components/SignOutButton";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { protectedMiddleware } from "@/middleware/authMiddleware";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/")({
  head: () => generateMetadata({ title: "Dashboard" }),
  component: RouteComponent,
  server: {
    middleware: [protectedMiddleware],
  },
  loader: async () => {
    const { user } = await getUserServer();

    return user;
  },
});

function RouteComponent() {
  const user = Route.useLoaderData();
  return (
    <>
      <Card className="max-w-xs">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
          <p>{user?.email}</p>
        </CardContent>
      </Card>
      <SignOutButton />
    </>
  );
}
