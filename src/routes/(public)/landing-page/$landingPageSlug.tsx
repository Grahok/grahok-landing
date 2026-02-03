import { getLandingPageBySlugServer } from "@/features/landing-pages/actions/server/getLandingPageBySlugServer";
import LandingPageWrapper from "@/features/landing-pages/components/LandingPageWrapper";
import { LandingPageProvider } from "@/features/landing-pages/contexts/LandingPageContext";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute, notFound } from "@tanstack/react-router";
import LandingPageNotFound from "./-not-found";

export const Route = createFileRoute("/(public)/landing-page/$landingPageSlug")(
  {
    component: RouteComponent,
    notFoundComponent: LandingPageNotFound,
    loader: async ({ context: { queryClient }, params }) => {
      const { landingPageSlug } = params;
      const landingPage = await queryClient.ensureQueryData({
        queryKey: ["landing-page", landingPageSlug],
        queryFn: () =>
          getLandingPageBySlugServer({
            data: {
              slug: landingPageSlug,
            },
          }),
      });
      if (!landingPage) {
        throw notFound();
      }
      return { landingPage };
    },
    head: ({ loaderData }) =>
      generateMetadata({
        title: loaderData?.landingPage.name,
        openGraph: {
          images:
            loaderData?.landingPage.landingPageProducts[0].product.images[0],
        },
        twitter: {
          card: "summary_large_image",
          images: loaderData?.landingPage.landingPageProducts[0].product.images,
        },
      }),
  },
);

function RouteComponent() {
  const { landingPage } = Route.useLoaderData();
  return (
    <LandingPageProvider landingPage={landingPage}>
      <LandingPageWrapper />
    </LandingPageProvider>
  );
}
