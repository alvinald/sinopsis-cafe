import { type Column, type RowData } from "@tanstack/react-table"
import { cn } from "cn"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { type DataTableFeatures } from "./features"

interface DataTableColumnHeaderProps<TData extends RowData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<DataTableFeatures, TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  const isSorted = column.getIsSorted()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "-ml-2 h-7 gap-1 px-2 font-medium text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={() => column.toggleSorting()}
    >
      <span>{title}</span>
      {isSorted === "asc" ? (
        <ArrowUp className="size-3.5" />
      ) : isSorted === "desc" ? (
        <ArrowDown className="size-3.5" />
      ) : (
        <ChevronsUpDown className="size-3.5 opacity-50" />
      )}
    </Button>
  )
}