-- AlterTable
ALTER TABLE "role" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;
