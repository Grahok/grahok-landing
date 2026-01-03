import { prisma } from "@/lib/prisma/db";
import { createServerFn } from "@tanstack/react-start";
import { createOrEditProductSchema } from "../../types/productTypes";

export const createProductServer = createServerFn()
  .inputValidator(createOrEditProductSchema)
  .handler(async ({ data: product }) => {
    await prisma.product.create({ data: product });
  });
