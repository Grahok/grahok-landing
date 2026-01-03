import { LandingPageModel } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma/db";
import { createServerFn } from "@tanstack/react-start";

export const getLandingPageServer = createServerFn()
  .inputValidator((data: LandingPageModel["slug"]) => data)
  .handler(async ({ data }) => {
    const landingPage = await prisma.landingPage.findUnique({
      where: {
        slug: data,
      },
      include: {
        landingPageProducts: {
          include: {
            product: true,
          },
        },
      },
    });
    return landingPage;
  });
