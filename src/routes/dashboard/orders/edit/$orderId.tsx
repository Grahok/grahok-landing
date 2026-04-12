import { Spinner } from "@/components/ui/spinner";
import { getOrderServer } from "@/features/orders/actions/server/getOrderServer";
import EditOrderForm from "@/features/orders/components/EditOrderForm";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/orders/edit/$orderId")({
  params: {
    parse: ({ orderId }) => ({ orderId: Number(orderId) }),
  },
  loader: async ({ params: { orderId }, context: { queryClient } }) => {
    const order = await queryClient.ensureQueryData({
      queryKey: ["order", orderId],
      queryFn: async () =>
        await getOrderServer({
          data: orderId,
        }),
    });
    return { order };
  },
  errorComponent: ({ error }) => {
    if (error.message === "ORDER_NOT_FOUND") {
      throw notFound();
    }
  },
  head: ({ params: { orderId } }) =>
    generateMetadata({ title: `Edit Order #${orderId}` }),
  component: RouteComponent,
});

function RouteComponent() {
  const { orderId } = Route.useParams();
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Order</h1>
      <Suspense fallback={<Spinner />}>
        <EditOrderForm orderId={orderId} />
      </Suspense>
    </section>
  );
}
