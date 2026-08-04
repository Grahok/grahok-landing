import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import {
  createOrEditOrderSchema,
  customerDetailsInOrderSchema,
} from "../../types/orderTypes";
import { MIN_ORDER_TOTAL, MIN_ORDER_TOTAL_MESSAGE } from "../../constants";

export const createOrderServer = createServerFn({
  method: "POST",
})
  .inputValidator(createOrEditOrderSchema)
  .handler(async ({ data }) => {
    // 1. Fetch the real products from the DB to get current 'sellPrice'
    // This prevents users from tampering with prices on the client side.
    const productIds = data.orderItems.map((item) => item.productId);

    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      select: {
        id: true,
        name: true,
        sellPrice: true,
      },
    });

    // Quick lookup map
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // 2. Prepare the data for the 'OrderItem' table (The Snapshot)
    // We verify product existence and calculate the REAL total here.
    let calculatedTotalPrice = 0;

    const orderItemsData = data.orderItems.map((item) => {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      // Calculate line total for backend verification
      calculatedTotalPrice += product.sellPrice * item.quantity;

      return {
        // Relation: Connect to the Product
        productId: item.productId,

        // Snapshot: Save the Name/Price AS IT IS NOW.
        // If you change the product name/price next week, this order record remains historically accurate.
        name: product.name,
        price: product.sellPrice,

        quantity: item.quantity,
      };
    });

    // Calculate subtotal (without shipping)
    const subtotal = calculatedTotalPrice;

    // 3. Check for active offers and apply free shipping if threshold is met
    let finalShippingCharge = data.shippingCharge;
    
    if (data.landingPageId) {
      const activeOffer = await prisma.offer.findFirst({
        where: {
          isActive: true,
          type: "FREE_SHIPPING",
          threshold: {
            not: null,
          },
          landingPages: {
            some: {
              id: data.landingPageId,
            },
          },
        },
      });

      if (activeOffer && activeOffer.threshold && subtotal >= activeOffer.threshold) {
        finalShippingCharge = 0;
      }
    }

    // Add shipping to the backend-calculated total
    calculatedTotalPrice += finalShippingCharge;

    // Enforce minimum order total for customer checkout from landing pages
    // (admin-created orders do not send a landingPageId and are exempt)
    if (data.landingPageId && calculatedTotalPrice < MIN_ORDER_TOTAL) {
      throw new Error(MIN_ORDER_TOTAL_MESSAGE);
    }

    // 3. Perform the Transaction
    // Prisma handles of "Foreign Key" linking automatically via nested 'create'
    const customerDetails = customerDetailsInOrderSchema.parse(data.customer);
    const newOrder = await prisma.order.create({
      data: {
        // Simple composite type mapping
        customer: customerDetails,

        // Use of secure, calculated total
        totalPrice: calculatedTotalPrice,
        shippingCharge: finalShippingCharge,
        orderStatus: data.orderStatus,
        landingPageId: data.landingPageId,

        // The Magic Part: Creating the relations
        // Prisma will create these OrderItem records AND insert the new order.id into them automatically.
        orderItems: {
          create: orderItemsData,
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        }, // Include orderItems in the response
      },
    });

    return {
      ...newOrder,
      customer: customerDetails,
    };
  });
