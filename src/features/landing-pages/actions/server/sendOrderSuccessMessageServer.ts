import { OrderModel } from "@/generated/prisma/models";
import { createServerFn } from "@tanstack/react-start";
import { SMSBangladeshUrl } from "../../constants";
import axios from "axios";

export const sendOrderSuccessMessageServer = createServerFn()
  .inputValidator((data: { orderId: OrderModel["id"], mobileNumber: string, customerName: string }) => data)
  .handler(async ({ data }) => {
    const res = await axios.post(SMSBangladeshUrl(data.mobileNumber, data.orderId, data.customerName));
    return res.data;
  });
