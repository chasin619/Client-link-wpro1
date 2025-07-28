-- CreateTable
CREATE TABLE "DepositAmount" (
    "id" SERIAL NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DepositAmount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepositAmount_vendorId_key" ON "DepositAmount"("vendorId");

-- AddForeignKey
ALTER TABLE "DepositAmount" ADD CONSTRAINT "DepositAmount_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
