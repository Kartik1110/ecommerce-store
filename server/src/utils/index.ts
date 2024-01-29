import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
