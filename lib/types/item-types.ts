import z from "zod";

export const ItemSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  unit: z.string(),
  stock: z.number(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
  isDeleted: z.boolean(),
});

export const CreateItemRequestSchema = z.object({
  sku: z.string().trim().min(1, "SKU wajib diisi"),
  name: z.string().trim().min(1, "Nama item wajib diisi"),
  unit: z.string().trim().min(1, "Satuan wajib diisi"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const UpdateItemRequestSchema = CreateItemRequestSchema.extend({
  id: z.string(),
});

export const DeleteItemRequestSchema = z.object({
  id: z.string().min(1, "ID tidak ditemukan"),
});

export type Item = z.infer<typeof ItemSchema>;
export type CreateItemRequest = z.infer<typeof CreateItemRequestSchema>;
export type UpdateItemRequest = z.infer<typeof UpdateItemRequestSchema>;
export type DeleteItemRequest = z.infer<typeof DeleteItemRequestSchema>;
