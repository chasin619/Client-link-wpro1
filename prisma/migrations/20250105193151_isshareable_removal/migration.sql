/*
  Warnings:

  - You are about to drop the column `isShareable` on the `Arrangement` table. All the data in the column will be lost.
  - You are about to drop the column `isShareable` on the `Flower` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Arrangement" DROP COLUMN "isShareable";

-- AlterTable
ALTER TABLE "Flower" DROP COLUMN "isShareable";
