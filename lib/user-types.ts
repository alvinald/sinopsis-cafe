import { z } from "zod"

export type RoleOption = {
  value: string;
  label: string;
};

export const roles: RoleOption[] = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
]

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.string().min(1).refine((val) => roles.some((r) => r.value === val)),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const createUserSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi"),
  email: z.string().trim().email("Email tidak valid"),
  role: z.string().min(1).refine(
    (val) => roles.some((r) => r.value === val), 
    { message: "Role tidak valid" }
  ),
  password: z.string().min(8, "Password minimal 8 karakter"),
})

export const updateUserSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi"),
  email: z.string().trim().email("Email tidak valid"),
  role: z.string().min(1).refine(
    (val) => roles.some((r) => r.value === val), 
    { message: "Role tidak valid" }
  ),
})

export const deleteUserSchema = z.object({
  id: z.string().trim().min(1, "ID tidak ditemukan"),
})

export type User = z.infer<typeof userSchema>
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type DeleteUserInput = z.infer<typeof deleteUserSchema>