import { Button } from "@/components/ui/button";
import { Moving } from "@/lib/types/moving-types";
import { cn } from "@/lib/utils";
import { Eye, Pencil } from "lucide-react";
import CardAction from "./card-action";
import { MovingStatus } from "@/lib/generated/prisma/enums";
import { formatDate } from "date-fns";

export function CardRequest({
  moving,
  onMove,
  onOpen,
  onEdit,
}: {
  moving: Moving;
  onMove: (
    id: string,
    status: MovingStatus,
    title: string,
    description: string,
    buttonText: string,
  ) => void;
  onOpen?: () => void;
  onEdit?: () => void;
}) {
  const totalQty = moving.items.reduce((sum, line) => sum + line.qty, 0);

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-3 transition-shadow shadow-xs hover:shadow-sm">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-medium tracking-tight text-muted-foreground">
            {moving.number}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold">
            {moving.note ?? "Tanpa catatan"}
          </p>
        </div>
      </div>

      {/* Semua item dalam request ini */}
      <ul className="mt-2 flex-1 space-y-1">
        {moving.items.map((line) => (
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

      {/* Meta + aksi */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
        <div className="min-w-0 text-[11px] text-muted-foreground">
          <p className="truncate">{moving.createdBy.name}</p>
          <p className="tabular-nums">
            {formatDate(moving.createdAt, "dd MMM yyyy")} ·{" "}
            {moving.items.length} item · {totalQty} unit
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {onOpen && (
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              aria-label={`Lihat detail ${moving.number}`}
              onClick={onOpen}
            >
              <Eye className="size-3.5" />
            </Button>
          )}
          {onEdit && (
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              aria-label={`Edit ${moving.number}`}
              onClick={onEdit}
            >
              <Pencil className="size-3.5" />
            </Button>
          )}
          <CardAction
            key={moving.id}
            moving={moving}
            onMove={(id, status) =>
              onMove(
                id,
                status,
                "Konfirmasi Perubahan Status",
                "Apakah Anda yakin ingin mengubah status?",
                "Ya, ubah status",
              )
            }
          ></CardAction>
        </div>
      </div>
    </article>
  );
}
