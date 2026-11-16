/*
  Warnings:

  - Added the required column `level` to the `job_title` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LevelJob" AS ENUM ('OWNER', 'DIREKTUR', 'MANAGER', 'HEAD', 'STAFF');

-- AlterTable
ALTER TABLE "job_title" ADD COLUMN     "level" "LevelJob" NOT NULL;
