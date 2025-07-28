/*
  Warnings:

  - You are about to drop the column `arrangementId` on the `Flower` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Flower" DROP CONSTRAINT "Flower_arrangementId_fkey";

-- AlterTable
ALTER TABLE "Flower" DROP COLUMN "arrangementId";
