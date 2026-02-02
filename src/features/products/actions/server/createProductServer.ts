import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { createOrEditProductSchema } from "../../types/productTypes";

export const createProductServer = createServerFn({
  method: "POST",
})
  .inputValidator(createOrEditProductSchema)
  .handler(async ({ data: product }) => {
    await prisma.product.create({ data: product });
  });
