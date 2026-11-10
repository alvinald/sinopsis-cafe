import { boolean, z } from "zod";

export const permissionSchema = z.object({
  id: z.string(),
  resource: z.string(),
  action: z.string(),
});

export const permissionByGroupSchema = z.object({
  resource: z.string(),
  collapsed: boolean,
  actions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
});

export type Permission = z.infer<typeof permissionSchema>;
export type PermissionByGroup = z.infer<typeof permissionByGroupSchema>;
