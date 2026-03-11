import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";

export const getActiveOfferForLandingPageServer = createServerFn()
  .inputValidator((landingPageId: number) => landingPageId)
  .handler(async ({ data: landingPageId }) => {
    const offer = await prisma.offer.findFirst({
      where: {
        isActive: true,
        landingPages: {
          some: {
            id: landingPageId,
          },
        },
      },
    });
    return offer;
  });
