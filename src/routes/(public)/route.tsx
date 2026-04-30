// import SiteHeader from "@/features/home/components/SiteHeader";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-dvh space-y-6">
      {/* <SiteHeader /> */}
      <Outlet />
    </main>
  );
}
