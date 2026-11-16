/*
  Warnings:

  - You are about to drop the column `department` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `job_title` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "department",
DROP COLUMN "job_title",
ADD COLUMN     "departmentId" TEXT,
ADD COLUMN     "jobTitleId" TEXT;

-- CreateTable
CREATE TABLE "job_title" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "job_title_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "job_title"("id") ON DELETE SET NULL ON UPDATE CASCADE;
