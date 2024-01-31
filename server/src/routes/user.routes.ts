import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import validate from '../middlewares/validation.middleware';
import { CreateCartCheckoutSchema, CreateCartSchema } from '../schemas';
import { fetchItemDetails, validateDiscount } from '../utils';

const prisma = new PrismaClient();
const userRouter = Router();

/* GET - get all items */
userRouter.get('/items', async (req: Request, res: Response) => {
  try {
    const items = await prisma.items.findMany({});
    if (items && items.length > 0) {
      res.status(200).json({ message: 'Items found!', data: items });
    } else {
      res.status(404).json({ message: 'Items not found!', data: [] });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/* POST - add items to cart */
userRouter.post('/cart/add', validate(CreateCartSchema), async (req: Request, res: Response) => {
  try {
    const { user_id, items } = req.body;

    /* Checking if cart exists  */
    const existingCart = await prisma.cart.findUnique({ where: { user_id } });

    if (existingCart) {
      /* If cart exists then update the cart */
      const updatedCart = await prisma.cart.update({
        where: { id: existingCart.id },
        data: { items: { push: items } },
      });

      res.status(200).json({ message: 'Items added to your existing cart', data: updatedCart });
    } else {
      /* If cart does not exist then create a new cart */
      const newCart = await prisma.cart.create({ data: { user_id, items } });

      res.status(200).json({ message: 'Items added to cart', data: newCart });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

/* POST - Cart checkout */
userRouter.post(
  '/cart/checkout',
  validate(CreateCartCheckoutSchema),
  async (req: Request, res: Response) => {
    try {
      const { user_id } = req.body;

      /* Validate discount */
      const isDiscountValid = await validateDiscount(user_id);

      /* Get cart details */
      const cart = await prisma.cart.findFirst({ where: { user_id } });

      if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(404).json({ message: 'No items in the cart', data: {} });
      }

      /* Get item details */
      const items = await fetchItemDetails(cart.items);
      const discount_percent = isDiscountValid?.status ? isDiscountValid.discount : null;

      res.status(200).json({ message: 'Items added to cart', data: { items, discount_percent } });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

export default userRouter;
