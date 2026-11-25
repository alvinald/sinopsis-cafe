"use client";

import { Button } from "@/components/ui/button";
import { can } from "@/lib/rbac";
import { DeleteRoleRequest, RoleWithPermissions } from "@/lib/types/role-types";
import { Check, Trash } from "lucide-react";
import { useState } from "react";

export function RoleHeader({
  activeRole,
  setLoading,
  loading,
  successDelete,
  onSaveRolePermissions,
  permissions,
}: {
  activeRole: RoleWithPermissions | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  successDelete: () => void;
  onSaveRolePermissions: () => void;
  permissions: string[] | undefined;
}) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const canDelete = can(permissions, "ROLE:DELETE");
  const canUpdate = can(permissions, "ROLE:UPDATE");

  async function handleDeleteRole() {
    if (!activeRole) return;

    setLoading(true);
    try {
      const body: DeleteRoleRequest = {
        id: activeRole.id,
      };

      const response = await fetch("/api/role", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data moving");
      }

      successDelete();
      return result.data;
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold">{activeRole?.name}</h2>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">
            {activeRole?.permissions.length || 0} Akses Aktif
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-0.5">{activeRole?.description}</p>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {canDelete &&
          activeRole &&
          (confirmCancel ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Batalkan transaksi ini?
              </span>
              <Button
                type="button"
                size="sm"
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() => {
                  handleDeleteRole();
                }}
                disabled={loading}
              >
                Ya, Hapus
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setConfirmCancel(false);
                }}
                disabled={loading}
              >
                Batal
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmCancel(true)}
              disabled={loading}
            >
              <Trash className="size-4" />
              Hapus Role
            </Button>
          ))}

        {canUpdate && activeRole && !confirmCancel && (
          <Button
            onClick={onSaveRolePermissions}
            className="px-4 py-2 sm:py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            disabled={loading}
          >
            <Check className="w-3.5 h-3.5" /> Simpan
          </Button>
        )}
      </div>
    </div>
  );
}
