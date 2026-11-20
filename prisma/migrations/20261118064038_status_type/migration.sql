/*
  Warnings:

  - You are about to drop the column `is_active` on the `items` table. All the data in the column will be lost.
  - The `status` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "department" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "items" DROP COLUMN "is_active",
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "status" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "job_title" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "moving_items" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "movings" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "permission" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "role" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "shift_schedules" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "status",
ADD COLUMN     "status" "status" NOT NULL DEFAULT 'ACTIVE';

-- DropEnum
DROP TYPE "UserStatus";
