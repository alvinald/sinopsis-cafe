"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChangePasswordRequestSchema } from "@/lib/types/change-password-types";

type ChangePasswordPayload = {
  message?: string;
};

export function ChangePasswordForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace("/login");
          },
        },
      });
    } finally {
      setLoggingOut(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const parsed = ChangePasswordRequestSchema.safeParse({
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Data tidak valid");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const payload = (await response.json().catch(
        () => null,
      )) as ChangePasswordPayload | null;

      if (!response.ok) {
        toast.error(payload?.message || "Gagal mengubah password");
        return;
      }

      toast.success(payload?.message || "Password berhasil diubah");
      form.reset();
      router.refresh();
      router.replace("/admin/dashboard");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Card className="w-full rounded-2xl">
        <CardHeader className="border-b">
          <CardTitle>Ubah Password</CardTitle>
          <CardDescription>
            Masukkan password saat ini, lalu tentukan password baru Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {session?.mustChangePassword && (
            <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Password Anda masih default. Ubah password dulu sebelum
              melanjutkan.
            </p>
          )}
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="currentPassword">
                Password Saat Ini
              </FieldLabel>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                placeholder="Masukkan password saat ini"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="newPassword">Password Baru</FieldLabel>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Minimal 8 karakter"
                required
              />
              <FieldDescription>Minimal 8 karakter.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">
                Konfirmasi Password Baru
              </FieldLabel>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Ulangi password baru"
                required
              />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {session?.mustChangePassword && (
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-xl sm:mr-auto sm:w-auto"
              onClick={handleLogout}
              disabled={saving || loggingOut}
            >
              <LogOutIcon />
              {loggingOut ? "Keluar..." : "Keluar"}
            </Button>
          )}
          <Button
            type="submit"
            className="w-full rounded-xl sm:w-auto"
            disabled={saving || loggingOut}
          >
            {saving ? "Menyimpan..." : "Simpan Password"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
