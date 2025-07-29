/*
  Warnings:

  - A unique constraint covering the columns `[eventId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Chat_vendorId_clientId_key";

-- AlterTable
ALTER TABLE "public"."Chat" ADD COLUMN     "eventId" INTEGER,
ALTER COLUMN "vendorId" DROP NOT NULL,
ALTER COLUMN "clientId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_eventId_key" ON "public"."Chat"("eventId");

-- CreateIndex
CREATE INDEX "Chat_eventId_idx" ON "public"."Chat"("eventId");

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
