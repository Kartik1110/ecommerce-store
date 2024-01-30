import { z } from "zod";

export const DiscountSchema = z.object({
  code: z.string(),
  discount_percent: z.number(),
});

export const CreateDiscountSchema = z.object({
  body: DiscountSchema,
});
