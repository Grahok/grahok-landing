import EditLandingPageForm from "@/features/landing-pages/components/EditLandingPageForm";
import { createFileRoute } from "@tanstack/react-router";
import { getLandingPageBySlugServer } from "@/features/landing-pages/actions/server/getLandingPageBySlugServer";
import { notFound } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/dashboard/landing-pages/edit/$landingPageSlug",
)({
  component: RouteComponent,
  loader: async ({ params, context: { queryClient } }) => {
    const { landingPageSlug } = params;
    const landingPage = await queryClient.ensureQueryData({
      queryKey: ["landing-page", landingPageSlug],
      queryFn: () =>
        getLandingPageBySlugServer({
          data: { slug: landingPageSlug },
        }),
    });
    if (!landingPage) {
      throw notFound();
    }
    return { landingPage };
  },
});

function RouteComponent() {
  const { landingPage } = Route.useLoaderData();
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Landing Page</h1>
      <EditLandingPageForm landingPage={landingPage} />
    </section>
  );
}
