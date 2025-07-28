-- CreateTable
CREATE TABLE "PreviewBackgroundImages" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "vendorId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PreviewBackgroundImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreviewHeroImages" (
    "id" SERIAL NOT NULL,
    "src" TEXT NOT NULL,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "vendorId" INTEGER NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PreviewHeroImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PreviewBackgroundImages" ADD CONSTRAINT "PreviewBackgroundImages_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviewHeroImages" ADD CONSTRAINT "PreviewHeroImages_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "VendorUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
