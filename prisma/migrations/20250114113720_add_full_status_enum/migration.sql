/*
  Warnings:

  - The `status` column on the `VendorUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('active', 'pending', 'onhold');

-- AlterTable
ALTER TABLE "VendorUser" DROP COLUMN "status",
ADD COLUMN     "status" "ClientStatus" NOT NULL DEFAULT 'pending';
