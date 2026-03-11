import CreateOfferForm from "@/features/offers/components/CreateOfferForm";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/offers/add/")({
  head: () => generateMetadata({ title: "Add Offer" }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="container max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Add New Offer</h1>
      <CreateOfferForm />
    </section>
  );
}
