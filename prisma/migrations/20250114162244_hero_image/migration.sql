/*
  Warnings:

  - Made the column `backgroundImage` on table `Event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "heroImage" TEXT NOT NULL DEFAULT 'https://s3.us-east-2.amazonaws.com/wpro.ai/backgroundImages/pexels-fu-zhichao-176355-587741.jpg',
ALTER COLUMN "backgroundImage" SET NOT NULL,
ALTER COLUMN "backgroundImage" SET DEFAULT 'https://s3.us-east-2.amazonaws.com/wpro.ai/backgroundImages/pexels-fu-zhichao-176355-587741.jpg';
