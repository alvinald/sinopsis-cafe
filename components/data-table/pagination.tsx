import { type ReactTable, type RowData } from "@tanstack/react-table"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { type DataTableFeatures } from "./features"

interface DataTablePaginationProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>
}

function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  const items: (number | "ellipsis")[] = []
  for (let i = 0; i < total; i++) {
    if (i === 0 || i === total - 1 || Math.abs(i - current) <= 1) {
      items.push(i)
    } else if (items[items.length - 1] !== "ellipsis") {
      items.push("ellipsis")
    }
  }
  return items
}

export function DataTablePagination<TData extends RowData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { pageIndex } = table.state.pagination
  const pageCount = table.getPageCount()

  return (
    <div className="flex flex-col items-center justify-between gap-3 px-2 pt-2 pb-1 mt-2 sm:flex-row">
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Rows per page</p>
        <Select
          value={`${table.state.pagination.pageSize}`}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="h-8 w-16">
            <SelectValue placeholder={table.state.pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={table.getCanPreviousPage() ? () => table.previousPage() : undefined}
              aria-disabled={!table.getCanPreviousPage()}
              className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                )
              )
            : null}

          <PaginationItem>
            <PaginationNext
              onClick={table.getCanNextPage() ? () => table.nextPage() : undefined}
              aria-disabled={!table.getCanNextPage()}
              className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}