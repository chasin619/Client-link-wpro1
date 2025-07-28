-- CreateTable
CREATE TABLE "Signature" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "signatureData" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Signature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Signature_eventId_clientId_key" ON "Signature"("eventId", "clientId");

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "VendorClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
