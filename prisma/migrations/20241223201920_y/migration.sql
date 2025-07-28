/*
  Warnings:

  - You are about to drop the `_ArrangementIngredients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ArrangementIngredients" DROP CONSTRAINT "_ArrangementIngredients_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArrangementIngredients" DROP CONSTRAINT "_ArrangementIngredients_B_fkey";

-- AlterTable
ALTER TABLE "Arrangement" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ArrangementType" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "BreakDownPrice" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Color" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Contracts" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "DeliverySetupPrice" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "DesignTemplate" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "EventType" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Flower" ADD COLUMN     "arrangementId" INTEGER,
ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "FlowerCategory" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "LaborCost" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Letters" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Slots" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TransferPrice" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "_ArrangementColors" ADD CONSTRAINT "_ArrangementColors_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ArrangementColors_AB_unique";

-- AlterTable
ALTER TABLE "_VendorClients" ADD CONSTRAINT "_VendorClients_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_VendorClients_AB_unique";

-- DropTable
DROP TABLE "_ArrangementIngredients";

-- CreateTable
CREATE TABLE "ArrangementIngredient" (
    "arrangementId" INTEGER NOT NULL,
    "flowerId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ArrangementIngredient_pkey" PRIMARY KEY ("arrangementId","flowerId")
);

-- AddForeignKey
ALTER TABLE "Flower" ADD CONSTRAINT "Flower_arrangementId_fkey" FOREIGN KEY ("arrangementId") REFERENCES "Arrangement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrangementIngredient" ADD CONSTRAINT "ArrangementIngredient_arrangementId_fkey" FOREIGN KEY ("arrangementId") REFERENCES "Arrangement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrangementIngredient" ADD CONSTRAINT "ArrangementIngredient_flowerId_fkey" FOREIGN KEY ("flowerId") REFERENCES "Flower"("id") ON DELETE RESTRICT ON UPDATE CASCADE;