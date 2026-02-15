import { createServerFn } from "@tanstack/react-start";
import { createOrEditLandingPageSchema } from "../../types/landingPageTypes";
import { prisma } from "@/db";
import { LandingPageModel } from "@/generated/prisma/models";
import z from "zod";

export const updateLandingPageServer = createServerFn({
  method: "POST",
})
  .inputValidator(
    (data: {
      id: LandingPageModel["id"];
      updatedData: z.infer<typeof createOrEditLandingPageSchema>;
    }) => data,
  )
  .handler(async ({ data }) => {
    const landingPage = await prisma.landingPage.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.updatedData.name,
        slug: data.updatedData.slug,
        landingPageProducts: {
          updateMany: data.updatedData.landingPageProducts.map((product) => ({
            where: {
              productId: product.productId,
            },
            data: {
              description: product.description,
              faqs: product.faqs,
            },
          })),
        },
        shippingInsideDhaka: data.updatedData.shippingInsideDhaka,
        shippingOutsideDhaka: data.updatedData.shippingOutsideDhaka,
      },
    });
    return landingPage;
  });
