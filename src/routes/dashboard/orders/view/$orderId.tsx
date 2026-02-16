import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import OrderDetails from "@/features/orders/components/OrderDetails";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute } from "@tanstack/react-router";
import { usePDF } from 'react-to-pdf';
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/orders/view/$orderId")({
  head: () =>
    generateMetadata({
      title: "Order Details",
    }),
  component: RouteComponent,
  params: {
    parse: ({ orderId }) => ({ orderId: Number(orderId) }),
  },
});

function RouteComponent() {
  const { orderId }: { orderId: number } = Route.useParams();
  const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
      <h1 className="text-3xl font-bold">Order Details</h1>
      <Button onClick={() => toPDF()}></Button>
      </div>
      <Suspense fallback={<Spinner />}>
        <OrderDetails pdfRef={targetRef} orderId={orderId} />
      </Suspense>
    </section>
  );
}
