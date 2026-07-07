import { OrderFindUniqueArgs } from "@/generated/prisma/models";
import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { customerDetailsInOrderSchema } from "../../types/orderTypes";
import z from "zod";

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

    if (!order) {
      throw new Error("ORDER_NOT_FOUND");
    }

    const customerDetails = customerDetailsInOrderSchema.extend({
          mobileNumber: z.string(),
        }).parse(order.customer);

    return { ...order, customer: customerDetails };
  });
