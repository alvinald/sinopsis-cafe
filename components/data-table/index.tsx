"use client"

import * as React from "react"
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { features, type DataTableFeatures } from "./features"
import { DataTablePagination } from "./pagination"

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  enableSearch?: boolean
  searchPlaceholder?: string
  toolbar?: React.ReactNode
  getRowId?: (row: TData) => string
  // Server-side (manual) mode. When set, sorting/pagination/globalFilter
  // values and callbacks below must be provided by the parent.
  manualPagination?: boolean
  manualSorting?: boolean
  manualFiltering?: boolean
  rowCount?: number
  loading?: boolean
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  globalFilter?: string
  onGlobalFilterChange?: (value: string) => void,
  onRowDeleted?: (id: string) => void 
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  enableSearch = true,
  searchPlaceholder = "Search...",
  toolbar,
  getRowId,
  manualPagination,
  manualSorting,
  manualFiltering,
  rowCount,
  loading = false,
  sorting: sortingProp,
  onSortingChange: onSortingChangeProp,
  pagination: paginationProp,
  onPaginationChange: onPaginationChangeProp,
  globalFilter: globalFilterProp,
  onGlobalFilterChange: onGlobalFilterChangeProp,
  onRowDeleted, 
}: DataTableProps<TData>) {
  const [internalSorting, setInternalSorting] =
    React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState("")
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const sorting = sortingProp ?? internalSorting
  const onSortingChange: OnChangeFn<SortingState> =
    onSortingChangeProp ?? setInternalSorting
  const globalFilter = globalFilterProp ?? internalGlobalFilter
  const onGlobalFilterChange =
    onGlobalFilterChangeProp ?? setInternalGlobalFilter
  const pagination = paginationProp ?? internalPagination
  const onPaginationChange: OnChangeFn<PaginationState> =
    onPaginationChangeProp ?? setInternalPagination

  const table = useTable({
    features,
    data,
    columns,
    getRowId,
    manualPagination,
    manualSorting,
    manualFiltering,
    rowCount,
    enableMultiSort: false,
    onSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange,
    onPaginationChange,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      rowSelection,
    },
    meta: { onRowDeleted }
    
  })

  return (
    <div>
      {(enableSearch || toolbar) && (
        <div className="flex items-center justify-between gap-3 py-4">
          {enableSearch && (
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(event) => {
                onGlobalFilterChange(event.target.value)
                onPaginationChange((prev) => ({ ...prev, pageIndex: 0 }))
              }}
              className="max-w-sm"
            />
          )}
          {toolbar}
        </div>
      )}

      <div className={cn( "transition-opacity", loading ? "pointer-events-none opacity-50" :"opacity-100" )}>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DataTablePagination table={table} />
      </div>
    </div>
  )
}