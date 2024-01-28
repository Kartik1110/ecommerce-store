import { Request, Response, Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const userRouter = Router();

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

userRouter.post("/cart/add", async (req: Request, res: Response) => {
  const cart = await prisma.cart.create({
    data: {
      items: [
        { item_id: "65b693b9e7d0b3740c0ac7aa", quantity: 10 },
        { item_id: "65b693b9e7d0b3740c0ac7ad", quantity: 9 },
      ],
      user_id: "65b691c33307a462e74528db",
    },
  });

  res.status(200).json({ message: "Items added to cart", data: cart });
});

export default userRouter;
