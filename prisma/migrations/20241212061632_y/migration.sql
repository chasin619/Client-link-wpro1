-- DropIndex
DROP INDEX "unique_vendor_isdefault";

-- AlterTable
ALTER TABLE "Slots" ALTER COLUMN "slotNo" DROP NOT NULL;
