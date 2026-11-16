import { z } from "zod";
import { JobTitleSchema, JobTitleWithDeptSchema } from "./job-title-types";
import { RoleSchema } from "./role-types";
import { DepartmentSchema } from "./department-types";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(["ACTIVE", "INACTIVE"]),

  isScheduled: z.boolean(),
  isDeleted: z.boolean(),

  // Status Keaktifan & Resign
  resignedDate: z.string().nullable().nullable,
  resignReason: z.string().nullable(),
});

export const UsersListSchema = UserSchema.extend({
  jobTitle: JobTitleSchema.nullable(),
  department: DepartmentSchema.nullable(),
  role: RoleSchema.nullable(),
});

export const CreateUserRequestSchema = z.object({
  name: z.string(),
  email: z.email(),
  jobTitle: z.string(),
  role: z.string(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const UpdateUserRequestSchema = CreateUserRequestSchema.extend({
  id: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type UsersList = z.infer<typeof UsersListSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
