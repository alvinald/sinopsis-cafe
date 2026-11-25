import z from "zod";

import { ItemSchema } from "./item-types";

export const StockInStatusSchema = z.enum([
  "PENDING",
  "RECEIVED",
  "CANCELLED",
]);

export const StockInItemSchema = z.object({
  id: z.string(),
  stockInId: z.string(),
  itemId: z.string(),
  qty: z.number().min(1, "Item qty belum ditambahkan"),
});

export const StockInItemWithItemSchema = StockInItemSchema.extend({
  item: ItemSchema,
});

export const StockInUserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const StockInSchema = z.object({
  id: z.string(),
  number: z.string(),
  status: StockInStatusSchema,
  note: z.string().nullable(),
  receivedAt: z.string().nullable(),
  createdAt: z.string(),
  createdBy: StockInUserSchema,
  cancelledAt: z.string().nullable(),
  cancelledBy: StockInUserSchema.nullable(),
  items: z.array(StockInItemWithItemSchema),
});

export const RequestStockInItemSchema = z.object({
  itemId: z.string().min(1, "Item wajib dipilih"),
  qty: z.number().min(1, "Qty harus lebih dari 0"),
});

export const RequestStockInSchema = z.object({
  note: z.string().nullable(),
  items: z.array(RequestStockInItemSchema).min(1, "Item belum ditambahkan"),
});

export const UpdateStockInSchema = RequestStockInSchema.extend({
  id: z.string().min(1, "Barang masuk tidak ditemukan"),
});

export const UpdateStockInStatusSchema = z.object({
  status: StockInStatusSchema,
});

export type StockInStatus = z.infer<typeof StockInStatusSchema>;
export type StockInItem = z.infer<typeof StockInItemSchema>;
export type StockInItemWithItem = z.infer<typeof StockInItemWithItemSchema>;
export type StockInUser = z.infer<typeof StockInUserSchema>;
export type StockIn = z.infer<typeof StockInSchema>;
export type RequestStockInItem = z.infer<typeof RequestStockInItemSchema>;
export type RequestStockIn = z.infer<typeof RequestStockInSchema>;
export type UpdateStockIn = z.infer<typeof UpdateStockInSchema>;
export type UpdateStockInStatus = z.infer<typeof UpdateStockInStatusSchema>;
