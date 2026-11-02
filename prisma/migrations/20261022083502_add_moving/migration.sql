-- CreateEnum
CREATE TYPE "MovingStatus" AS ENUM ('PENDING', 'SENT', 'RECEIVED');

-- CreateTable
CREATE TABLE "items" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movings" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "status" "MovingStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sent_at" TIMESTAMP(3),
    "received_at" TIMESTAMP(3),
    "created_by_id" TEXT NOT NULL,

    CONSTRAINT "movings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moving_items" (
    "id" TEXT NOT NULL,
    "moving_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "moving_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_sku_key" ON "items"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "movings_number_key" ON "movings"("number");

-- CreateIndex
CREATE UNIQUE INDEX "moving_items_moving_id_item_id_key" ON "moving_items"("moving_id", "item_id");

-- AddForeignKey
ALTER TABLE "movings" ADD CONSTRAINT "movings_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moving_items" ADD CONSTRAINT "moving_items_moving_id_fkey" FOREIGN KEY ("moving_id") REFERENCES "movings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moving_items" ADD CONSTRAINT "moving_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
