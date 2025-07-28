/*
  Warnings:

  - Changed the type of `subscriptionPlan` on the `VendorUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "VendorUser" ADD COLUMN     "role" TEXT,
DROP COLUMN "subscriptionPlan",
ADD COLUMN     "subscriptionPlan" JSONB NOT NULL;
