import { z } from "zod";

const CartItemSchema = z.object({
  item_id: z.string(),
  quantity: z.number(),
});

export const CartSchema = z.object({
  user_id: z.string(),
  items: z.array(CartItemSchema),
});

export const CreateCartSchema = z.object({
  body: CartSchema,
});
