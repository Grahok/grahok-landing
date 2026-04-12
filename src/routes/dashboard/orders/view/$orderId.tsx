import { getOrderServer } from "@/features/orders/actions/server/getOrderServer";
import OrderDetails from "@/features/orders/components/OrderDetails";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/orders/view/$orderId")({
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
    generateMetadata({ title: `View Order #${orderId}` }),
  component: RouteComponent,
});

function RouteComponent() {
  const { order } = Route.useLoaderData();
  return <OrderDetails order={order} />;
}
