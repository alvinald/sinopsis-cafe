import { Button } from "@/components/ui/button";
import { StockIn } from "@/lib/types/stock-in-types";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { CheckCheck, Eye, Pencil } from "lucide-react";

export function StockInCard({
  stockIn,
  onOpen,
  onEdit,
  onReceive,
}: {
  stockIn: StockIn;
  onOpen: () => void;
  onEdit?: () => void;
  onReceive?: () => void;
}) {
  const totalQty = stockIn.items.reduce((sum, line) => sum + line.qty, 0);
  const isPending = stockIn.status === "PENDING";
  const statusMeta = {
    PENDING: {
      label: "Menunggu",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    RECEIVED: {
      label: "Diterima",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    CANCELLED: {
      label: "Dibatalkan",
      className: "border-red-200 bg-red-50 text-red-700",
    },
  }[stockIn.status];

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-3 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-medium tracking-tight text-muted-foreground">
            {stockIn.number}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold">
            {stockIn.note ?? "Tanpa catatan"}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
            statusMeta.className,
          )}
        >
          {statusMeta.label}
        </span>
      </div>

      <ul className="mt-2 flex-1 space-y-1">
        {stockIn.items.map((line) => (
          <li
            key={line.id}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="truncate text-muted-foreground">
              {line.item.name}
            </span>
            <span className="shrink-0 font-medium tabular-nums">
              {line.qty} {line.item.unit}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
        <div className="min-w-0 text-[11px] text-muted-foreground">
          <p className="truncate">{stockIn.createdBy.name}</p>
          <p className="tabular-nums">
            {formatDate(stockIn.createdAt, "dd MMM yyyy")} ·{" "}
            {stockIn.items.length} item · {totalQty} unit
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {isPending && onReceive && (
            <Button
              type="button"
              size="xs"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={(event) => {
                event.stopPropagation();
                onReceive();
              }}
            >
              <CheckCheck className="size-3.5" />
              Terima
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon-xs"
            aria-label={`Lihat detail ${stockIn.number}`}
            onClick={onOpen}
          >
            <Eye className="size-3.5" />
          </Button>
          {onEdit && (
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              aria-label={`Edit ${stockIn.number}`}
              onClick={onEdit}
            >
              <Pencil className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
