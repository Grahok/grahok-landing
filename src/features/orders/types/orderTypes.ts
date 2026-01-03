import { z } from "zod";

// 1. Reusable Address Schema
const addressSchema = z.object({
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  upazilla: z.string().min(1, "Upazilla is required"),
  location: z.string().min(1, "Location is required"),
});

// 2. Customer Schema
const customerSchema = z.object({
  name: z.string().min(1, "Customer Name is required"),
  mobileNumber: z.string().min(11, "Mobile number must be valid"), // Adjusted for typical length
  address: addressSchema,
});

// 3. Order Item Schema (The input from the cart/form)
const orderItemInputSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const orderStatuses = ["pending", "delivered", "cancelled"] as const;

export type TOrderStatus = (typeof orderStatuses)[number];

// 4. Main Create Order Schema
export const createOrEditOrderSchema = z.object({
  customer: customerSchema,

  // Matches the 'orderItems' relation in your Prisma schema
  orderItems: z
    .array(orderItemInputSchema)
    .min(1, "Order must contain at least one product"),

  // These are usually calculated on the frontend for display,
  // but MUST be recalculated/verified on the backend!
  totalPrice: z.number().nonnegative("Total price cannot be negative"),
  shippingCharge: z.number().nonnegative("Shipping charge cannot be negative"),

  // Optional: Allow status override if this is an admin edit
  orderStatus: z
    .enum(orderStatuses)
});

// 5. Type Inference (Handy for your frontend props or API handlers)
export type CreateOrEditOrderType = z.infer<typeof createOrEditOrderSchema>;
