import { getLandingPageServer } from "@/features/landing-pages/actions/server/getLandingPageServer";
import LandingPageProductCard from "@/features/landing-pages/components/LandingPageProductCard";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/landing-page/$landingPageSlug")(
  {
    loader: async ({ params, context: { queryClient } }) => {
      const { landingPageSlug } = params;
      const landingPage = await queryClient.ensureQueryData({
        queryKey: ["landing-pages", landingPageSlug],
        queryFn: async () =>
          await getLandingPageServer({
            data: landingPageSlug,
          }),
      });

      if (!landingPage) {
        throw notFound();
      }

      return { landingPage };
    },
    head: ({ loaderData }) =>
      generateMetadata({ title: loaderData?.landingPage.name }),
    component: RouteComponent,
  }
);

function RouteComponent() {
  const { landingPage } = Route.useLoaderData();

  return (
    <main className="container flex flex-col justify-self-center p-6 space-y-6">
      <LandingPageProductCard landingPage={landingPage} />
    </main>
  );
}
