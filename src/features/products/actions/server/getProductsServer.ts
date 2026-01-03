import { prisma } from "@/lib/prisma/db";
import { createServerFn } from "@tanstack/react-start";

export const getProductsServer = createServerFn().handler(async () => {
  const products = await prisma.product.findMany();
  return products;
});
