/*
  Warnings:

  - You are about to drop the column `status` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `statusId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatusEnum" AS ENUM ('pending', 'delivered', 'cancelled');

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "status",
ADD COLUMN     "statusId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "OrderStatus";

-- CreateTable
CREATE TABLE "OrderStatus" (
    "id" TEXT NOT NULL,
    "title" "OrderStatusEnum" NOT NULL DEFAULT 'pending',
    "description" TEXT NOT NULL,

    CONSTRAINT "OrderStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "OrderStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
