ALTER TYPE "MovingStatus" RENAME TO "StockOutStatus";

ALTER TABLE "moving_items" RENAME TO "stock_out_items";
ALTER TABLE "movings" RENAME TO "stock_outs";

ALTER TABLE "stock_out_items" RENAME COLUMN "moving_id" TO "stock_out_id";

ALTER INDEX "movings_pkey" RENAME TO "stock_outs_pkey";
ALTER INDEX "moving_items_pkey" RENAME TO "stock_out_items_pkey";
ALTER INDEX "movings_number_key" RENAME TO "stock_outs_number_key";
ALTER INDEX "moving_items_moving_id_item_id_key" RENAME TO "stock_out_items_stock_out_id_item_id_key";

ALTER TABLE "stock_outs" RENAME CONSTRAINT "movings_created_by_id_fkey" TO "stock_outs_created_by_id_fkey";
ALTER TABLE "stock_outs" RENAME CONSTRAINT "movings_sent_by_id_fkey" TO "stock_outs_sent_by_id_fkey";
ALTER TABLE "stock_outs" RENAME CONSTRAINT "movings_received_by_id_fkey" TO "stock_outs_received_by_id_fkey";
ALTER TABLE "stock_outs" RENAME CONSTRAINT "movings_cancelled_by_id_fkey" TO "stock_outs_cancelled_by_id_fkey";
ALTER TABLE "stock_out_items" RENAME CONSTRAINT "moving_items_moving_id_fkey" TO "stock_out_items_stock_out_id_fkey";
ALTER TABLE "stock_out_items" RENAME CONSTRAINT "moving_items_item_id_fkey" TO "stock_out_items_item_id_fkey";

UPDATE "permission" AS p
SET resource = 'STOCKOUT'
WHERE p.resource = 'MOVING'
  AND NOT EXISTS (
    SELECT 1
    FROM "permission" AS existing
    WHERE existing.resource = 'STOCKOUT'
      AND existing.action = p.action
  );

DELETE FROM "permission" WHERE resource = 'MOVING';
