-- CreateEnum
CREATE TYPE "UserEnum" AS ENUM ('customer', 'admin');

-- DropIndex
DROP INDEX "OrderStatus_title_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "type" "UserEnum" NOT NULL DEFAULT 'customer';
