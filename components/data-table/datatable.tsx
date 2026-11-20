"use client";

import * as React from "react";
import {
  useTable,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Inbox, Loader2, Search } from "lucide-react";

import { features, type DataTableFeatures } from "./features";
import { DataTablePagination } from "./pagination";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  enableSearch?: boolean;
  searchPlaceholder?: string;
  toolbar?: React.ReactNode;
  emptyMessage?: string;
  getRowId?: (row: TData) => string;
  // Server-side (manual) mode. When set, sorting/pagination/globalFilter
  // values and callbacks below must be provided by the parent.
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  rowCount?: number;
  loading?: boolean;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  onRowDeleted?: (id: string) => void;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  enableSearch = true,
  searchPlaceholder = "Cari...",
  toolbar,
  emptyMessage = "Tidak ada data.",
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
  const [internalSorting, setInternalSorting] = React.useState<SortingState>(
    [],
  );
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState("");
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const sorting = sortingProp ?? internalSorting;
  const onSortingChange: OnChangeFn<SortingState> =
    onSortingChangeProp ?? setInternalSorting;
  const globalFilter = globalFilterProp ?? internalGlobalFilter;
  const onGlobalFilterChange =
    onGlobalFilterChangeProp ?? setInternalGlobalFilter;
  const pagination = paginationProp ?? internalPagination;
  const onPaginationChange: OnChangeFn<PaginationState> =
    onPaginationChangeProp ?? setInternalPagination;

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
    meta: { onRowDeleted },
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {(enableSearch || toolbar) && (
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          {enableSearch && (
            <InputGroup className="sm:max-w-xs">
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(event) => {
                  onGlobalFilterChange(event.target.value);
                  onPaginationChange((prev) => ({ ...prev, pageIndex: 0 }));
                }}
              />
            </InputGroup>
          )}

          {toolbar ? (
            <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
              {toolbar}
            </div>
          ) : null}
        </div>
      )}

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-[1px]">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/40 hover:bg-muted/40"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="h-9 px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase"
                  >
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
                    <TableCell key={cell.id} className="px-4 py-3">
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-40 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Inbox className="size-7 opacity-60" />
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="border-t border-border">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
