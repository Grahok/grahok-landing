import { Spinner } from "@/components/ui/spinner";
import { getProductServer } from "@/features/products/actions/server/getProductServer";
import EditProductForm from "@/features/products/components/EditProductForm";
import { generateMetadata } from "@/lib/tanstack-meta/generator";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/products/edit/$productId")({
  head: () => generateMetadata({ title: "Edit Product" }),
  component: RouteComponent,
  params: {
    parse: ({ productId }) => ({ productId: Number(productId) }),
  },
  loader: async ({ params, context: { queryClient } }) => {
    const { productId } = params;
    const product = await queryClient.ensureQueryData({
      queryKey: ["product", productId],
      queryFn: () =>
        getProductServer({
          data: productId,
        }),
    });
    if (product == null) {
      throw notFound();
    }
    return { product };
  },
});

function RouteComponent() {
  const { product } = Route.useLoaderData();
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Product</h1>
      <Suspense fallback={<Spinner />}>
        <EditProductForm product={product} />
      </Suspense>
    </section>
  );
}
