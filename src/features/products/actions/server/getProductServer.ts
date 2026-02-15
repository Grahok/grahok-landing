import { ProductFindUniqueArgs } from "@/generated/prisma/models";
import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";

export const getProductServer = createServerFn()
  .inputValidator(
    (productId: ProductFindUniqueArgs["where"]["id"]) => productId,
  )
  .handler(async ({ data: productId }) => {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    return product;
  });
