-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('Personal', 'Ceremony', 'Reception');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'active', 'onhold');

-- CreateTable
CREATE TABLE "VendorUser" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "business_email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "business_address" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "subscriptionPlan" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "customerId" TEXT,
    "subscriptionId" TEXT,

    CONSTRAINT "VendorUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flower" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "colorId" INTEGER NOT NULL,
    "stemsPerBunch" INTEGER NOT NULL,
    "costPerStem" DOUBLE PRECISION NOT NULL,
    "costPerBunch" DOUBLE PRECISION NOT NULL,
    "supplier" TEXT,
    "imageFilename" TEXT,
    "userId" INTEGER NOT NULL,
    "flowerCategoryId" INTEGER NOT NULL,
    "isShareable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Flower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "ClientUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VendorClient" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "VendorClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowerCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "FlowerCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransferPrice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "TransferPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliverySetupPrice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "DeliverySetupPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaborCost" (
    "id" SERIAL NOT NULL,
    "costPerHour" DOUBLE PRECISION NOT NULL,
    "costPerMinute" DOUBLE PRECISION NOT NULL,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "LaborCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArrangementType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "ArrangementType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BreakDownPrice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "BreakDownPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hexCode" TEXT NOT NULL,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arrangement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageFilename" TEXT,
    "isShareable" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "costPerMin" DOUBLE PRECISION NOT NULL,
    "labourTime" INTEGER NOT NULL,
    "labourCost" DOUBLE PRECISION NOT NULL,
    "itemCost" DOUBLE PRECISION NOT NULL,
    "profit" DOUBLE PRECISION NOT NULL,
    "margin" DOUBLE PRECISION NOT NULL,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "Arrangement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "eventTypeId" INTEGER,
    "weddingDate" TIMESTAMP(3),
    "totalPrice" DOUBLE PRECISION,
    "laborTime" INTEGER,
    "setupPriceId" INTEGER,
    "breakdownPriceId" INTEGER,
    "transferPriceId" INTEGER,
    "miscItemsCost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "NumberOfGuests" INTEGER,
    "brideName" TEXT,
    "groomName" TEXT,
    "location" TEXT,
    "referredBy" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventArrangement" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER,
    "arrangementId" INTEGER,
    "section" "SectionType" NOT NULL,
    "slotName" TEXT,
    "slotNo" INTEGER,
    "defaultArrangementType" INTEGER,
    "quantity" INTEGER,

    CONSTRAINT "EventArrangement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignTemplate" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,

    CONSTRAINT "DesignTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slots" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "templateId" INTEGER,
    "eventId" INTEGER,
    "arrangementId" INTEGER,
    "section" "SectionType" NOT NULL,
    "slotNo" SERIAL,
    "slotName" TEXT,
    "defaultArrangementType" INTEGER,

    CONSTRAINT "Slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventDetail" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "section" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "setupStartTime" TIMESTAMP(3),
    "location" TEXT NOT NULL,

    CONSTRAINT "EventDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventDesign" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "eventColors" JSONB NOT NULL,
    "designCost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "EventDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspiration" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inspiration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Letters" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL,

    CONSTRAINT "Letters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contracts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "vendorId" INTEGER NOT NULL,

    CONSTRAINT "Contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_VendorClients" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ArrangementColors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ArrangementIngredients" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VendorUser_business_email_key" ON "VendorUser"("business_email");

-- CreateIndex
CREATE UNIQUE INDEX "VendorUser_phone_key" ON "VendorUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "VendorUser_customerId_key" ON "VendorUser"("customerId");

-- CreateIndex
CREATE INDEX "Flower_userId_idx" ON "Flower"("userId");

-- CreateIndex
CREATE INDEX "Flower_colorId_idx" ON "Flower"("colorId");

-- CreateIndex
CREATE INDEX "Flower_flowerCategoryId_idx" ON "Flower"("flowerCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientUser_email_key" ON "ClientUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientUser_phone_key" ON "ClientUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VendorClient_vendorId_clientId_key" ON "VendorClient"("vendorId", "clientId");

-- CreateIndex
CREATE INDEX "FlowerCategory_vendorId_idx" ON "FlowerCategory"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "LaborCost_vendorId_key" ON "LaborCost"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_vendorId_key" ON "Color"("name", "vendorId");

-- CreateIndex
CREATE INDEX "Arrangement_typeId_idx" ON "Arrangement"("typeId");

-- CreateIndex
CREATE INDEX "Arrangement_vendorId_idx" ON "Arrangement"("vendorId");

-- CreateIndex
CREATE INDEX "EventType_vendorId_idx" ON "EventType"("vendorId");

-- CreateIndex
CREATE INDEX "Event_clientId_idx" ON "Event"("clientId");

-- CreateIndex
CREATE INDEX "Event_vendorId_idx" ON "Event"("vendorId");

-- CreateIndex
CREATE INDEX "Event_eventTypeId_idx" ON "Event"("eventTypeId");

-- CreateIndex
CREATE INDEX "Event_setupPriceId_idx" ON "Event"("setupPriceId");

-- CreateIndex
CREATE INDEX "Event_breakdownPriceId_idx" ON "Event"("breakdownPriceId");

-- CreateIndex
CREATE INDEX "Event_transferPriceId_idx" ON "Event"("transferPriceId");

-- CreateIndex
CREATE UNIQUE INDEX "EventArrangement_eventId_section_slotNo_key" ON "EventArrangement"("eventId", "section", "slotNo");

-- CreateIndex
CREATE UNIQUE INDEX "unique_vendor_isdefault" ON "DesignTemplate"("vendorId", "isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "Letters_id_key" ON "Letters"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Contracts_id_key" ON "Contracts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_VendorClients_AB_unique" ON "_VendorClients"("A", "B");

-- CreateIndex
CREATE INDEX "_VendorClients_B_index" ON "_VendorClients"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArrangementColors_AB_unique" ON "_ArrangementColors"("A", "B");

-- CreateIndex
CREATE INDEX "_ArrangementColors_B_index" ON "_ArrangementColors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArrangementIngredients_AB_unique" ON "_ArrangementIngredients"("A", "B");

-- CreateIndex
CREATE INDEX "_ArrangementIngredients_B_index" ON "_ArrangementIngredients"("B");

-- AddForeignKey
ALTER TABLE "Flower" ADD CONSTRAINT "Flower_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flower" ADD CONSTRAINT "Flower_flowerCategoryId_fkey" FOREIGN KEY ("flowerCategoryId") REFERENCES "FlowerCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flower" ADD CONSTRAINT "Flower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorClient" ADD CONSTRAINT "VendorClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VendorClient" ADD CONSTRAINT "VendorClient_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowerCategory" ADD CONSTRAINT "FlowerCategory_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransferPrice" ADD CONSTRAINT "TransferPrice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeliverySetupPrice" ADD CONSTRAINT "DeliverySetupPrice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaborCost" ADD CONSTRAINT "LaborCost_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrangementType" ADD CONSTRAINT "ArrangementType_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakDownPrice" ADD CONSTRAINT "BreakDownPrice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrangement" ADD CONSTRAINT "Arrangement_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ArrangementType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrangement" ADD CONSTRAINT "Arrangement_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_breakdownPriceId_fkey" FOREIGN KEY ("breakdownPriceId") REFERENCES "BreakDownPrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ClientUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_setupPriceId_fkey" FOREIGN KEY ("setupPriceId") REFERENCES "DeliverySetupPrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_transferPriceId_fkey" FOREIGN KEY ("transferPriceId") REFERENCES "TransferPrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventArrangement" ADD CONSTRAINT "EventArrangement_arrangementId_fkey" FOREIGN KEY ("arrangementId") REFERENCES "Arrangement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventArrangement" ADD CONSTRAINT "EventArrangement_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignTemplate" ADD CONSTRAINT "DesignTemplate_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slots" ADD CONSTRAINT "Slots_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "DesignTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDetail" ADD CONSTRAINT "EventDetail_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDesign" ADD CONSTRAINT "EventDesign_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventDesign" ADD CONSTRAINT "EventDesign_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inspiration" ADD CONSTRAINT "Inspiration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Letters" ADD CONSTRAINT "Letters_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VendorClients" ADD CONSTRAINT "_VendorClients_A_fkey" FOREIGN KEY ("A") REFERENCES "ClientUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VendorClients" ADD CONSTRAINT "_VendorClients_B_fkey" FOREIGN KEY ("B") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArrangementColors" ADD CONSTRAINT "_ArrangementColors_A_fkey" FOREIGN KEY ("A") REFERENCES "Arrangement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArrangementColors" ADD CONSTRAINT "_ArrangementColors_B_fkey" FOREIGN KEY ("B") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArrangementIngredients" ADD CONSTRAINT "_ArrangementIngredients_A_fkey" FOREIGN KEY ("A") REFERENCES "Arrangement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArrangementIngredients" ADD CONSTRAINT "_ArrangementIngredients_B_fkey" FOREIGN KEY ("B") REFERENCES "Flower"("id") ON DELETE CASCADE ON UPDATE CASCADE;
