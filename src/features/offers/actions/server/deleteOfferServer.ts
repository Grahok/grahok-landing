import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";

export const deleteOfferServer = createServerFn({
  method: "POST",
})
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }) => {
    await prisma.offer.delete({
      where: { id },
    });
    return { success: true };
  });
