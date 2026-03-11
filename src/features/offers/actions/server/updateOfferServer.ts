import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { updateOfferSchema } from "../../types/offerTypes";

export const updateOfferServer = createServerFn({
  method: "POST",
})
  .inputValidator(updateOfferSchema)
  .handler(async ({ data }) => {
    const offer = await prisma.offer.update({
      where: { id: data.id },
      data: {
        name: data.name,
        bannerText: data.bannerText,
        type: data.type,
        threshold: data.threshold,
        isActive: data.isActive,
        landingPages: {
          set: data.landingPageIds.map((id) => ({ id })),
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
