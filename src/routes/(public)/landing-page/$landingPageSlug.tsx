import { getLandingPageBySlugServer } from "@/features/landing-pages/actions/server/getLandingPageBySlugServer";
import LandingPageWrapper from "@/features/landing-pages/components/LandingPageWrapper";
import { LandingPageProvider } from "@/features/landing-pages/contexts/LandingPageContext";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/landing-page/$landingPageSlug")(
  {
    component: RouteComponent,
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
    head: ({ loaderData }) => {
      const firstProduct = loaderData?.landingPage.landingPageProducts[0];
      const firstImage = firstProduct?.product.images?.[0];
      
      return {
        ...generateMetadata({
          title: loaderData?.landingPage.name,
          description: firstProduct?.description ||
            `Buy ${loaderData?.landingPage.name} online with best price and fast delivery in Bangladesh.`,
          openGraph: {
            images: firstImage,
            description: firstProduct?.description ||
              `Buy ${loaderData?.landingPage.name} online with best price and fast delivery in Bangladesh.`,
          },
          twitter: {
            card: "summary_large_image",
            images: firstProduct?.product.images,
            description: firstProduct?.description ||
              `Buy ${loaderData?.landingPage.name} online with best price and fast delivery in Bangladesh.`,
          },
        }),
        links: firstImage ? [
          {
            rel: "preload",
            href: firstImage,
            as: "image",
            fetchPriority: "high",
          },
        ] : [],
      };
    },
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
