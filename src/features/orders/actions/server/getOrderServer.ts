import { OrderFindUniqueArgs } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma/db";
import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";

export const getOrderServer = createServerFn()
  .inputValidator((orderId: OrderFindUniqueArgs["where"]["id"]) => orderId)
  .handler(async ({ data: orderId }) => {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (order == null) {
      throw notFound();
    }
    return order;
  });
