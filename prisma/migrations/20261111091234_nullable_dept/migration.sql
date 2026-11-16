-- DropForeignKey
ALTER TABLE "job_title" DROP CONSTRAINT "job_title_departmentId_fkey";

-- AlterTable
ALTER TABLE "job_title" ALTER COLUMN "departmentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "job_title" ADD CONSTRAINT "job_title_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
