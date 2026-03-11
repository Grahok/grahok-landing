import z from "zod";

export const createOrEditOfferSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bannerText: z.string().optional(),
  type: z.enum(["FREE_SHIPPING"]),
  threshold: z.number().int().nonnegative().nullable(),
  isActive: z.boolean(),
  landingPageIds: z.array(z.number()).min(1, "At least one landing page is required"),
});

export type CreateOrEditOfferType = z.infer<typeof createOrEditOfferSchema>;

export const updateOfferSchema = createOrEditOfferSchema.extend({
  id: z.number(),
});

export type UpdateOfferType = z.infer<typeof updateOfferSchema>;
