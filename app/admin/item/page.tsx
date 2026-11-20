"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/datatable";
import { createItemColumns } from "@/components/page/item/columns";
import { ItemFormDialog } from "@/components/page/item/item-form-dialog";
import { PageHeader } from "@/components/page/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DeleteItemRequest,
  type CreateItemRequest,
  type Item,
  type UpdateItemRequest,
} from "@/lib/types/item-types";
import { ApiError, ValidationError } from "@/lib/types/validation-types";
import { can } from "@/lib/rbac";
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/loading";

type ApiResult = {
  error?: string;
  message?: string;
  data?: Item;
};

export default function ItemPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemForm, setItemForm] = useState<
    { mode: "create" } | { mode: "edit"; item: Item } | null
  >(null);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    // Pastikan path properti permissions sesuai struktur session kamu
    if (!can(session.permissions, "ITEM:VIEW")) {
      router.replace("/forbidden");
    }
  }, [isPending, session, router]);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch("/api/items");

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        throw new Error(body?.error ?? "Gagal mengambil data item");
      }

      const data = (await response.json()) as Item[];
      setItems(data);
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      return [];
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      await fetchItems();
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [fetchItems]);

  const handleDelete = useCallback(
    async (item: Item) => {
      const body: DeleteItemRequest = {
        id: item.id,
      };
      const response = await fetch("/api/items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(null),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | ValidationError
          | ApiError
          | null;

        toast.error("Error", {
          description: `Data gagal dihapus`,
        });
        throw new Error(body?.message);
      }

      fetchItems();
      toast.success("Item dihapus", {
        description: `${item.name} berhasil dihapus.`,
      });
    },
    [fetchItems],
  );

  const handleSaveItem = useCallback(
    async (
      mode: "create" | "edit",
      values: CreateItemRequest | UpdateItemRequest,
    ) => {
      const isCreate = mode === "create";
      const id = itemForm?.mode === "edit" ? itemForm.item.id : null;

      if (!isCreate && !id) {
        throw new Error("Item tidak ditemukan");
      }

      const response = await fetch("/api/items", {
        method: isCreate ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response
        .json()
        .catch(() => null)) as ApiResult | null;

      if (!response.ok) {
        throw new Error(
          result?.error ??
            (isCreate ? "Gagal menambahkan item" : "Gagal memperbarui item"),
        );
      }

      setItemForm(null);
      toast.success(isCreate ? "Item ditambahkan" : "Item diperbarui", {
        description: `${values.name} berhasil disimpan.`,
      });
      await fetchItems();
    },
    [fetchItems, itemForm],
  );

  const columns = useMemo(
    () =>
      createItemColumns({
        onEdit: (item) => setItemForm({ mode: "edit", item }),
        onDelete: handleDelete,
        permissions: session?.permissions,
      }),
    [handleDelete, session?.permissions],
  );

  if (loading || isPending) {
    return <LoadingScreen />; // atau return null / skeleton
  }

  return (
    <div className="flex flex-1 flex-col py-4 md:py-6">
      <div className="w-full space-y-3 px-4 lg:px-6">
        <PageHeader
          title="Item"
          description="Daftar item inventory beserta stok dan satuannya."
          badge={
            <Badge variant="secondary">
              {loading ? "Memuat..." : `${items.length} item`}
            </Badge>
          }
          actions={
            can(session?.permissions, "ITEM:CREATE") && (
              <Button
                className="w-full gap-2 rounded-xl sm:w-auto"
                onClick={() => setItemForm({ mode: "create" })}
              >
                <Plus className="size-4" />
                Tambah Item
              </Button>
            )
          }
        />

        {error ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={items}
            loading={loading}
            getRowId={(row) => row.id}
            searchPlaceholder="Cari SKU, nama, atau satuan..."
            emptyMessage="Belum ada item."
          />
        )}
      </div>

      {itemForm ? (
        <ItemFormDialog
          key={itemForm.mode === "edit" ? itemForm.item.id : "create-item"}
          mode={itemForm.mode}
          item={itemForm.mode === "edit" ? itemForm.item : null}
          onClose={() => setItemForm(null)}
          onSave={handleSaveItem}
        />
      ) : null}
    </div>
  );
}
