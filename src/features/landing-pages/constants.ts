import { OrderModel } from "@/generated/prisma/models";

const messageBody = (customerName: string, orderId: OrderModel["id"]) =>
  `Congratulation ${customerName}! Your order #${orderId} has been placed successfully! Thank you for shopping with us.`;

const messageBodyAdmin = (customerName: string, orderId: OrderModel["id"]) =>
  `New order received! Order #${orderId} has been placed by ${customerName}.`;

export const SMSBangladeshUrl = (
  mobileNumber: string,
  orderId: OrderModel["id"],
  customerName: string,
  isCustomer: boolean = true,
) =>
  `https://panel.smsbangladesh.com/api?user=${encodeURIComponent(
    process.env.SMS_BANGLADESH_EMAIL!,
  )}&password=${encodeURIComponent(
    process.env.SMS_BANGLADESH_PASSWORD!,
  )}&to=88${encodeURIComponent(mobileNumber)}&text=${encodeURIComponent(isCustomer ? messageBody(customerName, orderId) : messageBodyAdmin(customerName, orderId))}`;
