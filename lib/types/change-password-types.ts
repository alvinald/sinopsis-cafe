import { z } from "zod";

export const ChangePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
    newPassword: z.string().min(8, "Password baru minimal 8 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  })
  .refine((values) => values.currentPassword !== values.newPassword, {
    message: "Password baru tidak boleh sama dengan password saat ini",
    path: ["newPassword"],
  });

export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
