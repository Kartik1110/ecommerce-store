import { z } from 'zod';

const CartItemSchema = z.object({
  item_id: z.string(),
  quantity: z.number(),
});

/* Schema for /cart/add */
export const CartSchema = z.object({
  user_id: z.string(),
  items: z.array(CartItemSchema),
});

/* Schema for /cart/add Request */
export const CreateCartSchema = z.object({
  body: CartSchema,
});

/* Schema for /cart/checkout */ 
export const CartCheckoutSchema = z.object({
  user_id: z.string(),
});

/* Schema for /cart/checkout Request */
export const CreateCartCheckoutSchema = z.object({
  body: CartCheckoutSchema,
});
