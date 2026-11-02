import { z } from "zod";

// Status Moving
export const MovingStatusSchema = z.enum([
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

// Moving Item
export const MovingItemSchema = z.object({
  id: z.string(),
  movingId: z.string(),
  itemId: z.string(),
  qty: z.number().min(1, "Item qty belum ditambahkan"),
});

// Moving Item + relasi Item
export const MovingItemWithItemSchema = MovingItemSchema.extend({
  item: ItemSchema,
});

// User
export const MovingUserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Moving
export const MovingSchema = z.object({
  id: z.string(),
  number: z.string(),
  status: MovingStatusSchema,
  note: z.string().nullable(),
  createdAt: z.string(),
  sentAt: z.string().nullable(),
  receivedAt: z.string().nullable(),
  createdBy: MovingUserSchema,
  items: z.array(MovingItemWithItemSchema),
});

export const RequestMovingItemSchema = z.object({
  itemId: z.string(),
  qty: z.number(),
});

export const RequestMovingSchema = z.object({
  note: z.string().nullable(),
  items: z.array(RequestMovingItemSchema).min(1, "Item belum ditambahkan"),
});

export const UpdateMovingSchema = RequestMovingSchema.extend({
  id: z.string(),
});

export const UpdateMovingStatusSchema = z.object({
  status: MovingStatusSchema,
});

export type MovingStatus = z.infer<typeof MovingStatusSchema>;
export type Moving = z.infer<typeof MovingSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type MovingItem = z.infer<typeof MovingItemSchema>;
export type MovingItemWithItem = z.infer<typeof MovingItemWithItemSchema>;

export type RequestMovingItemSchema = z.infer<typeof RequestMovingItemSchema>;
export type RequestMovingSchema = z.infer<typeof RequestMovingSchema>;
export type UpdateMovingSchema = z.infer<typeof UpdateMovingSchema>;
export type UpdateMovingStatusSchema = z.infer<typeof UpdateMovingStatusSchema>;
