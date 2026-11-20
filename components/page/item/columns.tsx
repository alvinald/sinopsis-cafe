"use client";

import { createColumnHelper } from "@tanstack/react-table";

import { DeleteButton, EditButton } from "@/components/action-button";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { type DataTableFeatures } from "@/components/data-table/features";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type Item } from "@/lib/types/item-types";
import { can } from "@/lib/rbac";

const columnHelper = createColumnHelper<DataTableFeatures, Item>();

type ItemColumnActions = {
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => Promise<void>;
  permissions: string[] | undefined;
};

export function createItemColumns({
  onEdit,
  onDelete,
  permissions,
}: ItemColumnActions) {
  const canEdit = can(permissions, "ITEM:UPDATE");
  const canDelete = can(permissions, "ITEM:DELETE");

  return columnHelper.columns([
    columnHelper.accessor("sku", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="SKU" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.sku}
        </span>
      ),
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama Item" />
      ),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    }),
    columnHelper.accessor("unit", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Satuan" />
      ),
      cell: ({ row }) => <Badge variant="outline">{row.original.unit}</Badge>,
    }),
    columnHelper.accessor("stock", {
      header: ({ column }) => (
        <div className="flex justify-end">
          <DataTableColumnHeader column={column} title="Stok" />
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={cn(
            "text-right font-medium tabular-nums",
            row.original.stock === 0 && "text-destructive",
          )}
        >
          {row.original.stock}
        </div>
      ),
    }),
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.status ?? !row.original.isDeleted;

        return (
          <Badge
            variant="outline"
            className={cn(
              "gap-1.5",
              isActive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                isActive ? "bg-emerald-500" : "bg-muted-foreground",
              )}
            />
            {isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Aksi</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          {canEdit && (
            <EditButton
              label="Edit item"
              onClick={() => onEdit(row.original)}
            />
          )}
          {canDelete && (
            <DeleteButton
              label="Hapus item"
              title={`Hapus ${row.original.name}?`}
              description="Item akan dihapus permanen dari daftar item."
              onDelete={() => onDelete(row.original)}
            />
          )}
        </div>
      ),
    }),
  ]);
}
