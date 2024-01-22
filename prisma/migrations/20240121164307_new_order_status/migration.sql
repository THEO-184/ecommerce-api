/*
  Warnings:

  - The values [cancelled] on the enum `OrderStatusEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatusEnum_new" AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'canceled');
ALTER TABLE "OrderStatus" ALTER COLUMN "title" DROP DEFAULT;
ALTER TABLE "OrderStatus" ALTER COLUMN "title" TYPE "OrderStatusEnum_new" USING ("title"::text::"OrderStatusEnum_new");
ALTER TYPE "OrderStatusEnum" RENAME TO "OrderStatusEnum_old";
ALTER TYPE "OrderStatusEnum_new" RENAME TO "OrderStatusEnum";
DROP TYPE "OrderStatusEnum_old";
ALTER TABLE "OrderStatus" ALTER COLUMN "title" SET DEFAULT 'processing';
COMMIT;
