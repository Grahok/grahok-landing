import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";

export const getOfferByIdServer = createServerFn()
  .inputValidator((id: number) => id)
  .handler(async ({ data: id }) => {
    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        landingPages: {
          select: {
            id: true,
          },
        },
      },
    });
    return offer;
  });
