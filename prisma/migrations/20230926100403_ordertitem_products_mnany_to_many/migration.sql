/*
  Warnings:

  - You are about to drop the column `orderId` on the `ShoppingCartItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShoppingCartItem" DROP CONSTRAINT "ShoppingCartItem_orderId_fkey";

-- AlterTable
ALTER TABLE "ShoppingCartItem" DROP COLUMN "orderId";

-- CreateTable
CREATE TABLE "_OrderItemToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderItemToProduct_AB_unique" ON "_OrderItemToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderItemToProduct_B_index" ON "_OrderItemToProduct"("B");

-- AddForeignKey
ALTER TABLE "_OrderItemToProduct" ADD CONSTRAINT "_OrderItemToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderItemToProduct" ADD CONSTRAINT "_OrderItemToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
