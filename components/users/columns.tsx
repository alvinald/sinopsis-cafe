"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { roles, User } from "@/lib/user-types"
import { DataTableColumnHeader } from "@/components/data-table/column-header"
import { type DataTableFeatures } from "@/components/data-table/features"
import { DeleteButton, EditButton } from "../data-table/action-button"
import { Badge } from "../ui/badge"


const columnHelper = createColumnHelper<DataTableFeatures, User>()

function formatDate(value: Date | string | number) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("id-ID")
}

type ColumnActionsProps = {
  onDelete?: (id: string) => Promise<void> | undefined
}

export const getColumns = ({ onDelete }: ColumnActionsProps = {}) =>
  columnHelper.columns([
    columnHelper.display({ 
      id: "actions", 
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            <EditButton href={`/admin/users/${row.original.id}`} />
            <DeleteButton 
              onDelete={async () => {
                await onDelete?.( row.original.id );
              }} 
            />
          </div>
        )
      },
    }),
    columnHelper.display({
      id: 'rowNumber',
      header: 'No',
      cell: ({ row }) => {
        const displayIndex = row.getDisplayIndex()
        return displayIndex === -1 ? '' : displayIndex + 1
      },
    }),
    columnHelper.accessor("role", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ getValue }) => {
        const roleValue = getValue();
        const roleObj = roles.find((r) => r.value === roleValue);

        return (
          <Badge 
            className={roleValue === "admin" ? "bg-purple-200 text-purple-700 dark:bg-purple-950 dark:text-purple-300" : "bg-blue-200 text-blue-700 dark:bg-blue-950 dark:text-blue-300"}>
            {roleObj?.label ?? roleValue}
          </Badge>
        );
      },
    }),
    columnHelper.accessor("name", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama" />
      ),
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    }),
    columnHelper.accessor("createdAt", {
      enableGlobalFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dibuat" />
      ),
      cell: ({ row }) => formatDate(row.original.createdAt),
    }),
    columnHelper.accessor("updatedAt", {
      enableGlobalFilter: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Diperbarui" />
      ),
      cell: ({ row }) => formatDate(row.original.updatedAt),
    }),
  ]
)