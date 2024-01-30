import { PrismaClient } from "@prisma/client";
import { DISCOUNT_ORDER_INTERVAL, DISCOUNT_PERCENTAGE } from "../constants";

const prisma = new PrismaClient();

/* fetchItemDetails is used to fetch the list of items in the cart */
export async function fetchItemDetails(items: { item_id: string; quantity: number }[]) {
  const itemIds = items.map((item) => item.item_id);
  const itemsDetails = await prisma.items.findMany({
    where: {
      id: {
        in: itemIds,
      },
    },
  });
  return itemsDetails;
}

/* validateDiscount is used to check if the customer is eligible for a nth order discount  */
export const validateDiscount = async ({ user_id }: { user_id: string }) => {
  try {
    const order = await prisma.order.findFirst({ where: { user_id } });

    if (order && order.order_count % DISCOUNT_ORDER_INTERVAL === 0) {
      return {
        status: true,
        discount: DISCOUNT_PERCENTAGE,
      };
    } else {
      return {
        status: false,
        discount: 0,
      };
    }
  } catch (error) {
    console.error(error);
  }
};
