-- DropForeignKey
ALTER TABLE "ArrangementIngredient" DROP CONSTRAINT "ArrangementIngredient_arrangementId_fkey";

-- DropForeignKey
ALTER TABLE "ArrangementIngredient" DROP CONSTRAINT "ArrangementIngredient_flowerId_fkey";

-- AddForeignKey
ALTER TABLE "ArrangementIngredient" ADD CONSTRAINT "ArrangementIngredient_arrangementId_fkey" FOREIGN KEY ("arrangementId") REFERENCES "Arrangement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrangementIngredient" ADD CONSTRAINT "ArrangementIngredient_flowerId_fkey" FOREIGN KEY ("flowerId") REFERENCES "Flower"("id") ON DELETE CASCADE ON UPDATE CASCADE;
