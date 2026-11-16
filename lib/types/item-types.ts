import z from "zod";

export const CreateItemRequestSchema = z.object({
  sku: z.string(),
  name: z.email(),
  unit: z.string(),
  isDeleted: z.string(),
});

export type CreateItemRequest = z.infer<typeof CreateItemRequestSchema>;
