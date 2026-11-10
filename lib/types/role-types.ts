import { z } from "zod";
import { permissionSchema } from "./permission-types";

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

export const createRoleSchema = z.object({
  name: z.string().trim().min(1, "Nama role wajib diisi"),
  description: z.string().trim().nullable(),
});

export const updateRoleSchema = z.object({
  id: z.string().trim().min(1, "ID role tidak ditemukan"),
  name: z.string().trim().min(1, "Nama role wajib diisi"),
  description: z.string().trim().nullable(),
  isDeleted: z.boolean(),
});

export const deleteRoleSchema = z.object({
  id: z.string().trim().min(1, "ID role tidak ditemukan"),
});

export const roleWithPermissionsSchema = roleSchema.extend({
  permissions: z.array(permissionSchema),
});

export const updateRolePermissionSchema = z.object({
  roleId: z.string(),
  permissionsIds: z.array(z.string()),
});

export type Role = z.infer<typeof roleSchema>;
export type CreateRoleRequest = z.infer<typeof createRoleSchema>;
export type UpdateRoleRequest = z.infer<typeof updateRoleSchema>;
export type DeleteRoleRequest = z.infer<typeof deleteRoleSchema>;
export type RoleWithPermissions = z.infer<typeof roleWithPermissionsSchema>;
export type updateRolePermission = z.infer<typeof updateRolePermissionSchema>;
