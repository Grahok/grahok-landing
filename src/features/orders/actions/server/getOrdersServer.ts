import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { customerDetailsInOrderSchema } from "../../types/orderTypes";
import z from "zod";

export const getOrdersServer = createServerFn().handler(async () => {
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const ordersWithCustomerDetails = orders.map((order) => {
    const customerDetails = customerDetailsInOrderSchema.extend({
      mobileNumber: z.string(),
    }).parse(order.customer);
    return { ...order, customer: customerDetails };
  });

  return ordersWithCustomerDetails;
});
