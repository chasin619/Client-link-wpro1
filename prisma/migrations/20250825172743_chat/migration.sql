/*
  Warnings:

  - You are about to drop the column `eventId` on the `Chat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vendorId,clientId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Made the column `vendorId` on table `Chat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `clientId` on table `Chat` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_eventId_fkey";

-- DropIndex
DROP INDEX "public"."Chat_eventId_idx";

-- DropIndex
DROP INDEX "public"."Chat_eventId_key";

-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "eventId",
ALTER COLUMN "vendorId" SET NOT NULL,
ALTER COLUMN "clientId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Slots" ALTER COLUMN "slotNo" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_vendorId_clientId_key" ON "public"."Chat"("vendorId", "clientId");
