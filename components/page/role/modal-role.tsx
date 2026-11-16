"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CreateRoleRequest } from "@/lib/types/role-types";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ModalRole = ({
  onOpenModal,
  setLoading,
  successCreate,
}: {
  onOpenModal: () => void;
  setLoading: (loading: boolean) => void;
  successCreate: (roleId: string) => void;
}) => {
  const [newRoleName, setNewRoleName] = useState<string>("");
  const [newRoleDesc, setNewRoleDesc] = useState<string>("");

  async function handleCreateRole() {
    setLoading(true);
    try {
      const body: CreateRoleRequest = {
        name: newRoleName,
        description: newRoleDesc,
      };

      const response = await fetch("/api/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data moving");
      }

      console.log("Response Data:", result.data);
      successCreate(result.data.id);
      return result.data;
    } catch (error) {
      console.error("Error:", error);

      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-role-title"
      onClick={onOpenModal}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-card p-4 shadow-2xl sm:max-w-sm sm:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="create-role-title" className="text-lg font-semibold">
              Tambah Role Baru
            </h2>
            <p className="text-xs text-muted-foreground">
              Tambahkan role dan deskripsi akses pengguna.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Tutup"
            onClick={onOpenModal}
          >
            <X className="size-4" />
          </Button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateRole();
          }}
          className="space-y-4"
        >
          <Field>
            <FieldLabel htmlFor="role-name">Nama Role</FieldLabel>
            <Input
              id="role-name"
              type="text"
              required
              autoFocus
              value={newRoleName}
              onChange={(event) => setNewRoleName(event.target.value)}
              placeholder="Misalnya: Supervisor"
              className="h-10"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="role-description">Deskripsi Ringkas</FieldLabel>
            <Input
              id="role-description"
              type="text"
              value={newRoleDesc}
              onChange={(event) => setNewRoleDesc(event.target.value)}
              placeholder="Misalnya: Meninjau laporan dan approval"
              className="h-10"
            />
          </Field>

          <Separator />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenModal}
            >
              Batal
            </Button>

            <Button type="submit" size="sm">
              Buat Role
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
