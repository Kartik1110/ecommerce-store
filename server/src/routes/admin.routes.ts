import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express';
import validate from '../middlewares/validation.middleware';
import { CreateDiscountSchema } from '../schemas';

const prisma = new PrismaClient();
const adminRouter = Router();

/* POST - create a new discount code */
adminRouter.post(
  '/discount/generate',
  validate(CreateDiscountSchema),
  async (req: Request, res: Response) => {
    try {
      const { code, discount_percent } = req.body;

      await prisma.discount.create({
        data: { code, discount_percent },
      });

      res.status(200).send({ message: 'Discount generated' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

export default adminRouter;
