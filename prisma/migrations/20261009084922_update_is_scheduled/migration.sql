/*
  Warnings:

  - You are about to drop the column `isSchedule` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "isSchedule",
ADD COLUMN     "isScheduled" BOOLEAN NOT NULL DEFAULT false;
