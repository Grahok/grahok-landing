import { prisma } from "@/lib/prisma/db";
import { createServerFn } from "@tanstack/react-start";

export const getOrdersServer = createServerFn().handler(async () => {
  const orders = await prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  return orders;
});
