import { type ReactTable, type RowData } from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { type DataTableFeatures } from "./features";

interface DataTablePaginationProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  const items: (number | "ellipsis")[] = [];

  for (let i = 0; i < total; i++) {
    if (i === 0 || i === total - 1 || Math.abs(i - current) <= 1) {
      items.push(i);
    } else if (items[items.length - 1] !== "ellipsis") {
      items.push("ellipsis");
    }
  }

  return items;
}

export function DataTablePagination<TData extends RowData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.state.pagination;
  const pageCount = table.getPageCount();
  const rowCount = table.getRowCount();
  const from = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, rowCount);

  const pageSizeSelector = (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Per halaman</span>
      <Select
        value={`${pageSize}`}
        onValueChange={(value) => table.setPageSize(Number(value))}
      >
        <SelectTrigger size="sm" className="w-[72px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent side="top">
          {[10, 20, 50].map((size) => (
            <SelectItem key={size} value={`${size}`}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground tabular-nums">
          {rowCount > 0
            ? `Menampilkan ${from}–${to} dari ${rowCount}`
            : "Tidak ada data"}
        </p>
        <div className="sm:hidden">{pageSizeSelector}</div>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <div className="hidden sm:block">{pageSizeSelector}</div>

        <Pagination className="mx-0 w-auto">
          <PaginationContent className="flex-wrap justify-center">
            <PaginationItem>
              <PaginationPrevious
                onClick={
                  table.getCanPreviousPage()
                    ? () => table.previousPage()
                    : undefined
                }
                aria-disabled={!table.getCanPreviousPage()}
                className={
                  !table.getCanPreviousPage()
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {pageCount > 0
              ? getPageItems(pageIndex, pageCount).map((item, index) =>
                  item === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        onClick={() => table.setPageIndex(item)}
                        isActive={item === pageIndex}
                        className="cursor-pointer"
                      >
                        {item + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )
              : null}

            <PaginationItem>
              <PaginationNext
                onClick={
                  table.getCanNextPage() ? () => table.nextPage() : undefined
                }
                aria-disabled={!table.getCanNextPage()}
                className={
                  !table.getCanNextPage()
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
