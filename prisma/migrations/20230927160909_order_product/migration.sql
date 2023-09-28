/*
  Warnings:

  - You are about to drop the column `orderId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `_OrderItemToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrderItemToProduct" DROP CONSTRAINT "_OrderItemToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderItemToProduct" DROP CONSTRAINT "_OrderItemToProduct_B_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "orderId";

-- DropTable
DROP TABLE "_OrderItemToProduct";

-- CreateTable
CREATE TABLE "OrderProduct" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "OrderProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_OrderItemToOrderProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderItemToOrderProduct_AB_unique" ON "_OrderItemToOrderProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderItemToOrderProduct_B_index" ON "_OrderItemToOrderProduct"("B");

-- AddForeignKey
ALTER TABLE "OrderProduct" ADD CONSTRAINT "OrderProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderItemToOrderProduct" ADD CONSTRAINT "_OrderItemToOrderProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderItemToOrderProduct" ADD CONSTRAINT "_OrderItemToOrderProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "OrderProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
