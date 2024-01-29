import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";
import validate from "../middlewares/validation.middleware";
import { CreateCartSchema } from "../schemas";
import { fetchItemDetails } from "../utils";

const prisma = new PrismaClient();
const userRouter = Router();

/* GET - get all items */
userRouter.get("/items", async (req: Request, res: Response) => {
  try {
    const items = await prisma.items.findMany({});
    if (items && items.length > 0) {
      res.status(200).json({ message: "Items found!", data: items });
    } else {
      res.status(404).json({ message: "Items not found!", data: [] });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* POST - add items to cart */
userRouter.post("/cart/add", validate(CreateCartSchema), async (req: Request, res: Response) => {
  const { user_id, items } = req.body;

  /* Checking if cart exists, add items to the cart  */
  await prisma.cart
    .findUniqueOrThrow({
      where: { user_id },
    })
    .then(async (cartData) => {
      /* If cart exists then update the cart */
      const existingCart = await prisma.cart.findFirst({ where: { id: cartData.id } });
      console.log("🚀 ~ .then ~ existingCart:", existingCart?.items);
      const finalItems = existingCart?.items;

      finalItems?.push(...items);

      const cart = await prisma.cart.update({
        where: { id: cartData?.id },
        data: {
          items: finalItems,
        },
      });
      res.status(200).json({ message: "Items added to your existing cart", data: cart });
    })
    .catch(async () => {
      /* If cart does not exist then create a new cart */
      const cart = await prisma.cart.create({
        data: {
          user_id,
          items,
        },
      });
      res.status(200).json({ message: "Items added to cart", data: cart });
    });
});

/* GET - get cart info */
/**
@TODO : Add Middleware to check coupon logic
*/
userRouter.get("/cart", async (req: Request, res: Response) => {
  try {
    const cart = await prisma.cart.findFirst({ where: { user_id: "65b691c33307a462e74528db" } });

    if (cart && cart.items && cart.items.length > 0) {
      const items = await fetchItemDetails(cart?.items);
      res.status(200).json({ message: "Items added to cart", data: items });
    } else {
      res.status(404).json({ message: "No items in the cart", data: [] });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default userRouter;
