/*
  Warnings:

  - The `title` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[title]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CategoryEnum" AS ENUM ('jewelery', 'electronics', 'clothing');

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "title",
ADD COLUMN     "title" "CategoryEnum" NOT NULL DEFAULT 'clothing';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Category_title_key" ON "Category"("title");
