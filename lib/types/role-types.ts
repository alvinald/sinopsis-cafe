import { z } from "zod";
import { permissionSchema } from "./permission-types";

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

export const CreateRoleSchema = z.object({
  name: z.string().trim().min(1, "Nama role wajib diisi"),
  description: z.string().trim().nullable(),
});

export const UpdateRoleSchema = z.object({
  id: z.string().trim().min(1, "ID role tidak ditemukan"),
  name: z.string().trim().min(1, "Nama role wajib diisi"),
  description: z.string().trim().nullable(),
  isDeleted: z.boolean(),
});

export const DeleteRoleSchema = z.object({
  id: z.string().trim().min(1, "ID role tidak ditemukan"),
});

export const RoleWithPermissionsSchema = RoleSchema.extend({
  permissions: z.array(permissionSchema),
});

export const UpdateRolePermissionSchema = z.object({
  roleId: z.string(),
  permissionsIds: z.array(z.string()),
});

export type Role = z.infer<typeof RoleSchema>;
export type CreateRoleRequest = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleRequest = z.infer<typeof UpdateRoleSchema>;
export type DeleteRoleRequest = z.infer<typeof DeleteRoleSchema>;
export type RoleWithPermissions = z.infer<typeof RoleWithPermissionsSchema>;
export type updateRolePermission = z.infer<typeof UpdateRolePermissionSchema>;
