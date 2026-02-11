import { OrderModel } from "@/generated/prisma/models";
import { createServerFn } from "@tanstack/react-start";
import { SMSBangladeshUrl } from "../../constants";
import axios from "axios";

export const sendOrderSuccessMessageAdminServer = createServerFn()
  .inputValidator((data: { orderId: OrderModel["id"], mobileNumber: string, customerName: string }) => data)
  .handler(async ({ data }) => {
    const res = await axios.post(SMSBangladeshUrl("01738271408", data.orderId, data.customerName, false));
    return res.data;
  });
