import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { createOrEditOfferSchema } from "../../types/offerTypes";

export const createOfferServer = createServerFn({
  method: "POST",
})
  .inputValidator(createOrEditOfferSchema)
  .handler(async ({ data }) => {
    const offer = await prisma.offer.create({
      data: {
        name: data.name,
        bannerText: data.bannerText,
        type: data.type,
        threshold: data.threshold,
        isActive: data.isActive,
        landingPages: {
          connect: data.landingPageIds.map((id) => ({ id })),
        },
      },
      include: {
        landingPages: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });
    return offer;
  });
