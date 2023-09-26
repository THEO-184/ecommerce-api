/*
  Warnings:

  - Added the required column `price` to the `ShoppingCartItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShoppingCartItem" ADD COLUMN     "price" INTEGER NOT NULL;
