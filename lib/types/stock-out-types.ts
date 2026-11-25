import { z } from "zod";

// Status StockOut
export const StockOutStatusSchema = z.enum([
  "PENDING",
  "SENT",
  "RECEIVED",
  "CANCELLED",
]);

// Item
export const ItemSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  unit: z.string(),
  stock: z.number(),
  isActive: z.boolean(),
});

// StockOut Item
export const StockOutItemSchema = z.object({
  id: z.string(),
  stockOutId: z.string(),
  itemId: z.string(),
  qty: z.number().min(1, "Item qty belum ditambahkan"),
});

// StockOut Item + relasi Item
export const StockOutItemWithItemSchema = StockOutItemSchema.extend({
  item: ItemSchema,
});

// User
export const StockOutUserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// StockOut
export const StockOutSchema = z.object({
  id: z.string(),
  number: z.string(),
  status: StockOutStatusSchema,
  note: z.string().nullable(),
  createdAt: z.string(),
  sentAt: z.string().nullable(),
  receivedAt: z.string().nullable(),
  cancelledAt: z.string().nullable(),
  createdBy: StockOutUserSchema,
  sentBy: StockOutUserSchema.nullable(),
  receivedBy: StockOutUserSchema.nullable(),
  cancelledBy: StockOutUserSchema.nullable(),
  items: z.array(StockOutItemWithItemSchema),
});

export const RequestStockOutItemSchema = z.object({
  itemId: z.string(),
  qty: z.number(),
});

export const RequestStockOutSchema = z.object({
  note: z.string().nullable(),
  items: z.array(RequestStockOutItemSchema).min(1, "Item belum ditambahkan"),
});

export const UpdateStockOutSchema = RequestStockOutSchema.extend({
  id: z.string(),
});

export const UpdateStockOutStatusSchema = z.object({
  status: StockOutStatusSchema,
});

export type StockOutStatus = z.infer<typeof StockOutStatusSchema>;
export type StockOut = z.infer<typeof StockOutSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type StockOutItem = z.infer<typeof StockOutItemSchema>;
export type StockOutItemWithItem = z.infer<typeof StockOutItemWithItemSchema>;

export type RequestStockOutItemSchema = z.infer<typeof RequestStockOutItemSchema>;
export type RequestStockOutSchema = z.infer<typeof RequestStockOutSchema>;
export type UpdateStockOutSchema = z.infer<typeof UpdateStockOutSchema>;
export type UpdateStockOutStatusSchema = z.infer<typeof UpdateStockOutStatusSchema>;
