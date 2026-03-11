import { prisma } from "@/db";
import { createServerFn } from "@tanstack/react-start";

export const getOffersServer = createServerFn().handler(async () => {
  const offers = await prisma.offer.findMany({
    include: {
      landingPages: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return offers as typeof offers;
});
