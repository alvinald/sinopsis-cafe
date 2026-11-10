-- AlterTable
ALTER TABLE "movings" ADD COLUMN     "cancelled_by_id" TEXT,
ADD COLUMN     "received_by_id" TEXT,
ADD COLUMN     "sent_by_id" TEXT;

-- AddForeignKey
ALTER TABLE "movings" ADD CONSTRAINT "movings_sent_by_id_fkey" FOREIGN KEY ("sent_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movings" ADD CONSTRAINT "movings_received_by_id_fkey" FOREIGN KEY ("received_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movings" ADD CONSTRAINT "movings_cancelled_by_id_fkey" FOREIGN KEY ("cancelled_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
