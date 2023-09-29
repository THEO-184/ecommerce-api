/*
  Warnings:

  - You are about to drop the `_OrderItemToOrderProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "_OrderItemToOrderProduct" DROP CONSTRAINT "_OrderItemToOrderProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderItemToOrderProduct" DROP CONSTRAINT "_OrderItemToOrderProduct_B_fkey";

-- AlterTable
ALTER TABLE "OrderProduct" ADD COLUMN     "orderItemId" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "_OrderItemToOrderProduct";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProduct" ADD CONSTRAINT "OrderProduct_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
