-- CreateEnum
CREATE TYPE "public"."SenderType" AS ENUM ('VENDOR', 'CLIENT');

-- CreateEnum
CREATE TYPE "public"."MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."SectionType" AS ENUM ('Personal', 'Ceremony', 'Reception', 'Suggestion');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('Inquiry', 'ReadyToSign', 'Pending', 'Signed', 'Booked', 'VendorApprovalNeeded', 'ApprovedAfterBooked');

-- CreateEnum
CREATE TYPE "public"."ClientStatus" AS ENUM ('active', 'pending', 'suspended', 'banned', 'onhold');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');

-- CreateTable
CREATE TABLE "public"."VendorUser" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "business_name" TEXT NOT NULL,
    "business_email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "business_address" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "customerId" TEXT,
    "subscriptionId" TEXT,
    "resetToken" TEXT,
    "resetTokenExpiry" TIMESTAMP(3),
    "role" TEXT,
    "subscriptionPlan" JSONB NOT NULL,
    "subscriptionStatus" TEXT,
    "subscriptionStatusLatest" "public"."SubscriptionStatus",
    "requiresPaymentUpdate" BOOLEAN DEFAULT false,
    "trialEndsAt" TIMESTAMP(3),
    "status" "public"."ClientStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "VendorUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Flower" (
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Flower_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ClientUser" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "ClientUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VendorClient" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,

    CONSTRAINT "VendorClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER,
    "clientId" INTEGER,
    "eventId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastMessageAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "firstEmailSent" BOOLEAN NOT NULL DEFAULT false,
    "lastEmailSentAt" TIMESTAMP(3),

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" SERIAL NOT NULL,
    "chatId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "vendorSenderId" INTEGER,
    "clientSenderId" INTEGER,
    "senderType" "public"."SenderType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "messageType" "public"."MessageType" NOT NULL DEFAULT 'TEXT',
    "attachmentUrl" TEXT,
    "attachmentType" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FlowerCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "vendorId" INTEGER NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FlowerCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TransferPrice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TransferPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DeliverySetupPrice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DeliverySetupPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LaborCost" (
    "id" SERIAL NOT NULL,
    "costPerHour" DOUBLE PRECISION NOT NULL,
    "costPerMinute" DOUBLE PRECISION NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LaborCost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DepositAmount" (
    "id" SERIAL NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DepositAmount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArrangementType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ArrangementType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BreakDownPrice" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BreakDownPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Color" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hexCode" TEXT NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Arrangement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageFilename" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "costPerMin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "labourTime" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "labourCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "itemCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "profit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "margin" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vendorId" INTEGER NOT NULL DEFAULT 0,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Arrangement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArrangementIngredient" (
    "arrangementId" INTEGER NOT NULL,
    "flowerId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "ArrangementIngredient_pkey" PRIMARY KEY ("arrangementId","flowerId")
);

-- CreateTable
CREATE TABLE "public"."Event" (
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
    "status" "public"."Status" NOT NULL DEFAULT 'Pending',
    "NumberOfGuests" INTEGER,
    "brideName" TEXT,
    "groomName" TEXT,
    "location" TEXT,
    "referredBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "backgroundImage" TEXT NOT NULL DEFAULT 'https://s3.us-east-2.amazonaws.com/wpro.ai/backgroundImages/pexels-fu-zhichao-176355-587741.jpg',
    "heroImage" TEXT NOT NULL DEFAULT 'https://s3.us-east-2.amazonaws.com/wpro.ai/backgroundImages/pexels-fu-zhichao-176355-587741.jpg',
    "clientSign" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PreviewBackgroundImages" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "vendorId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PreviewBackgroundImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PreviewHeroImages" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "vendorId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PreviewHeroImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventArrangement" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER,
    "arrangementId" INTEGER,
    "section" "public"."SectionType" NOT NULL,
    "slotName" TEXT,
    "slotNo" INTEGER,
    "defaultArrangementType" INTEGER,
    "quantity" INTEGER,

    CONSTRAINT "EventArrangement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DesignTemplate" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DesignTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Slots" (
    "id" SERIAL NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "templateId" INTEGER,
    "eventId" INTEGER,
    "arrangementId" INTEGER,
    "section" "public"."SectionType" NOT NULL,
    "slotNo" SERIAL,
    "slotName" TEXT,
    "defaultArrangementType" INTEGER,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventDetail" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "section" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "setupStartTime" TIMESTAMP(3),
    "location" TEXT NOT NULL,

    CONSTRAINT "EventDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventDesign" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "eventTypeId" INTEGER NOT NULL,
    "eventColors" JSONB NOT NULL,
    "designCost" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "EventDesign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inspiration" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inspiration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Letters" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Letters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contracts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "vendorId" INTEGER NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Signature" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "signatureData" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Signature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_VendorClients" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_VendorClients_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_ArrangementColors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ArrangementColors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "VendorUser_business_email_key" ON "public"."VendorUser"("business_email");

-- CreateIndex
CREATE UNIQUE INDEX "VendorUser_phone_key" ON "public"."VendorUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "VendorUser_customerId_key" ON "public"."VendorUser"("customerId");

-- CreateIndex
CREATE INDEX "Flower_userId_idx" ON "public"."Flower"("userId");

-- CreateIndex
CREATE INDEX "Flower_colorId_idx" ON "public"."Flower"("colorId");

-- CreateIndex
CREATE INDEX "Flower_flowerCategoryId_idx" ON "public"."Flower"("flowerCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientUser_email_key" ON "public"."ClientUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClientUser_phone_key" ON "public"."ClientUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VendorClient_vendorId_clientId_key" ON "public"."VendorClient"("vendorId", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_eventId_key" ON "public"."Chat"("eventId");

-- CreateIndex
CREATE INDEX "Chat_vendorId_idx" ON "public"."Chat"("vendorId");

-- CreateIndex
CREATE INDEX "Chat_clientId_idx" ON "public"."Chat"("clientId");

-- CreateIndex
CREATE INDEX "Chat_eventId_idx" ON "public"."Chat"("eventId");

-- CreateIndex
CREATE INDEX "Chat_lastMessageAt_idx" ON "public"."Chat"("lastMessageAt");

-- CreateIndex
CREATE INDEX "Message_chatId_idx" ON "public"."Message"("chatId");

-- CreateIndex
CREATE INDEX "Message_vendorSenderId_idx" ON "public"."Message"("vendorSenderId");

-- CreateIndex
CREATE INDEX "Message_clientSenderId_idx" ON "public"."Message"("clientSenderId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "public"."Message"("createdAt");

-- CreateIndex
CREATE INDEX "Message_isRead_idx" ON "public"."Message"("isRead");

-- CreateIndex
CREATE INDEX "FlowerCategory_vendorId_idx" ON "public"."FlowerCategory"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "LaborCost_vendorId_key" ON "public"."LaborCost"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "DepositAmount_vendorId_key" ON "public"."DepositAmount"("vendorId");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_vendorId_key" ON "public"."Color"("name", "vendorId");

-- CreateIndex
CREATE INDEX "Arrangement_typeId_idx" ON "public"."Arrangement"("typeId");

-- CreateIndex
CREATE INDEX "Arrangement_vendorId_idx" ON "public"."Arrangement"("vendorId");

-- CreateIndex
CREATE INDEX "EventType_vendorId_idx" ON "public"."EventType"("vendorId");

-- CreateIndex
CREATE INDEX "Event_clientId_idx" ON "public"."Event"("clientId");

-- CreateIndex
CREATE INDEX "Event_vendorId_idx" ON "public"."Event"("vendorId");

-- CreateIndex
CREATE INDEX "Event_eventTypeId_idx" ON "public"."Event"("eventTypeId");

-- CreateIndex
CREATE INDEX "Event_setupPriceId_idx" ON "public"."Event"("setupPriceId");

-- CreateIndex
CREATE INDEX "Event_breakdownPriceId_idx" ON "public"."Event"("breakdownPriceId");

-- CreateIndex
CREATE INDEX "Event_transferPriceId_idx" ON "public"."Event"("transferPriceId");

-- CreateIndex
CREATE UNIQUE INDEX "EventArrangement_eventId_section_slotNo_key" ON "public"."EventArrangement"("eventId", "section", "slotNo");

-- CreateIndex
CREATE UNIQUE INDEX "Letters_id_key" ON "public"."Letters"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Contracts_id_key" ON "public"."Contracts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Signature_eventId_clientId_key" ON "public"."Signature"("eventId", "clientId");

-- CreateIndex
CREATE INDEX "_VendorClients_B_index" ON "public"."_VendorClients"("B");

-- CreateIndex
CREATE INDEX "_ArrangementColors_B_index" ON "public"."_ArrangementColors"("B");

-- AddForeignKey
ALTER TABLE "public"."Flower" ADD CONSTRAINT "Flower_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "public"."Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Flower" ADD CONSTRAINT "Flower_flowerCategoryId_fkey" FOREIGN KEY ("flowerCategoryId") REFERENCES "public"."FlowerCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Flower" ADD CONSTRAINT "Flower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorClient" ADD CONSTRAINT "VendorClient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."ClientUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VendorClient" ADD CONSTRAINT "VendorClient_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."ClientUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_vendorSender_fkey" FOREIGN KEY ("vendorSenderId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_clientSender_fkey" FOREIGN KEY ("clientSenderId") REFERENCES "public"."ClientUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FlowerCategory" ADD CONSTRAINT "FlowerCategory_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TransferPrice" ADD CONSTRAINT "TransferPrice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DeliverySetupPrice" ADD CONSTRAINT "DeliverySetupPrice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LaborCost" ADD CONSTRAINT "LaborCost_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DepositAmount" ADD CONSTRAINT "DepositAmount_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArrangementType" ADD CONSTRAINT "ArrangementType_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BreakDownPrice" ADD CONSTRAINT "BreakDownPrice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Color" ADD CONSTRAINT "Color_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Arrangement" ADD CONSTRAINT "Arrangement_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "public"."ArrangementType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Arrangement" ADD CONSTRAINT "Arrangement_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventType" ADD CONSTRAINT "EventType_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArrangementIngredient" ADD CONSTRAINT "ArrangementIngredient_arrangementId_fkey" FOREIGN KEY ("arrangementId") REFERENCES "public"."Arrangement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArrangementIngredient" ADD CONSTRAINT "ArrangementIngredient_flowerId_fkey" FOREIGN KEY ("flowerId") REFERENCES "public"."Flower"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_breakdownPriceId_fkey" FOREIGN KEY ("breakdownPriceId") REFERENCES "public"."BreakDownPrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."ClientUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_setupPriceId_fkey" FOREIGN KEY ("setupPriceId") REFERENCES "public"."DeliverySetupPrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_transferPriceId_fkey" FOREIGN KEY ("transferPriceId") REFERENCES "public"."TransferPrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PreviewBackgroundImages" ADD CONSTRAINT "PreviewBackgroundImages_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PreviewHeroImages" ADD CONSTRAINT "PreviewHeroImages_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventArrangement" ADD CONSTRAINT "EventArrangement_arrangementId_fkey" FOREIGN KEY ("arrangementId") REFERENCES "public"."Arrangement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventArrangement" ADD CONSTRAINT "EventArrangement_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DesignTemplate" ADD CONSTRAINT "DesignTemplate_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Slots" ADD CONSTRAINT "Slots_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."DesignTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventDetail" ADD CONSTRAINT "EventDetail_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventDesign" ADD CONSTRAINT "EventDesign_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventDesign" ADD CONSTRAINT "EventDesign_eventTypeId_fkey" FOREIGN KEY ("eventTypeId") REFERENCES "public"."EventType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inspiration" ADD CONSTRAINT "Inspiration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Letters" ADD CONSTRAINT "Letters_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contracts" ADD CONSTRAINT "Contracts_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Signature" ADD CONSTRAINT "Signature_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."VendorClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Signature" ADD CONSTRAINT "Signature_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_VendorClients" ADD CONSTRAINT "_VendorClients_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."ClientUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_VendorClients" ADD CONSTRAINT "_VendorClients_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ArrangementColors" ADD CONSTRAINT "_ArrangementColors_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Arrangement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ArrangementColors" ADD CONSTRAINT "_ArrangementColors_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;
