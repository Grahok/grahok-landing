import { getOrderServer } from "@/features/orders/actions/server/getOrderServer";
import OrderDetails from "@/features/orders/components/OrderDetails";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/orders/view/$orderId")({
  head: () =>
    generateMetadata({
      title: "Order Details",
    }),
  component: RouteComponent,
  params: {
    parse: ({ orderId }) => ({ orderId: Number(orderId) }),
  },
  loader: async ({ params, context: { queryClient } }) => {
    const order = await queryClient.ensureQueryData({
      queryKey: ["order", params.orderId],
      queryFn: async () =>
        await getOrderServer({
          data: params.orderId,
        }),
    });
    if (!order) {
      throw notFound();
    }
    return {
      order,
    };
  },
});

function RouteComponent() {
  const { order } = Route.useLoaderData();
  return <OrderDetails order={order} />;
}
