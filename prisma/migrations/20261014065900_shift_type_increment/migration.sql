/*
  Warnings:

  - The primary key for the `shift_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `shift_types` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `shift_type_id` to the `shift_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "shift_schedules" DROP CONSTRAINT "shift_schedules_shift_type_id_fkey";

-- AlterTable
ALTER TABLE "shift_schedules" DROP COLUMN "shift_type_id",
ADD COLUMN     "shift_type_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "shift_types" DROP CONSTRAINT "shift_types_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "shift_types_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "shift_schedules" ADD CONSTRAINT "shift_schedules_shift_type_id_fkey" FOREIGN KEY ("shift_type_id") REFERENCES "shift_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
