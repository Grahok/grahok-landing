import { OrderModel } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma/db";
import { createServerFn } from "@tanstack/react-start";

export const deleteOrderServer = createServerFn()
  .inputValidator((data: { orderId: OrderModel["id"] }) => data)
  .handler(async ({ data: { orderId } }) => {
    await prisma.order.delete({
      where: {
        id: orderId,
      },
    });
  });
