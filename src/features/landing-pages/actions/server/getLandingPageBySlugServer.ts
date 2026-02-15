import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";
import { landingPageProductFaqsSchema } from "../../types/landingPageTypes";
import { LandingPageModel } from "@/generated/prisma/models";

export const getLandingPageBySlugServer = createServerFn()
  .inputValidator((data: { slug: LandingPageModel["slug"] }) => data)
  .handler(async ({ data }) => {
    const landingPage = await prisma.landingPage.findUnique({
      where: {
        slug_isActive: { slug: data.slug, isActive: true },
      },
      include: {
        landingPageProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!landingPage) {
      return null;
    }

    const landingPageProducts = landingPage.landingPageProducts.map(
      (lpProduct) => {
        const faqs = landingPageProductFaqsSchema.parse(lpProduct.faqs);

        return {
          ...lpProduct,
          faqs,
        };
      },
    );

    return { ...landingPage, landingPageProducts };
  });
