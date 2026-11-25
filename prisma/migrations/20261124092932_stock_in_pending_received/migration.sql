-- Data cleanup
UPDATE "stock_ins" SET "received_at" = NULL WHERE "status" = 'CANCELLED';

-- AlterEnum
ALTER TYPE "StockInStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "department" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "items" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

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
ALTER TABLE "stock_in_items" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "stock_ins" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text,
ALTER COLUMN "received_at" DROP NOT NULL,
ALTER COLUMN "received_at" DROP DEFAULT,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
