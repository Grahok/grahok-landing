import { Spinner } from "@/components/ui/spinner";
import { getOfferByIdServer } from "@/features/offers/actions/server/getOfferByIdServer";
import EditOfferForm from "@/features/offers/components/EditOfferForm";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/offers/edit/$offerId")({
  head: () => generateMetadata({ title: "Edit Offer" }),
  component: RouteComponent,
  params: {
    parse: ({ offerId }) => ({ offerId: Number(offerId) }),
  },
  loader: async ({ params, context: { queryClient } }) => {
    const { offerId } = params;
    const offer = await queryClient.ensureQueryData({
      queryKey: ["offer", offerId],
      queryFn: () =>
        getOfferByIdServer({
          data: offerId,
        }),
    });
    if (offer == null) {
      throw notFound();
    }
    return { offer };
  },
});

function RouteComponent() {
  const { offer } = Route.useLoaderData();
  return (
    <section className="container max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Edit Offer</h1>
      <Suspense fallback={<Spinner />}>
        <EditOfferForm offer={offer} />
      </Suspense>
    </section>
  );
}
