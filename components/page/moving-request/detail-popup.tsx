import { Button } from "@/components/ui/button";
import { MovingStatus } from "@/lib/generated/prisma/enums";
import { Moving } from "@/lib/types/moving-types";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Ban, X } from "lucide-react";
import { useState } from "react";

export function DetailPopup({
  statusMeta,
  moving,
  onClose,
  onCancelTransaction,
}: {
  statusMeta: Record<
    MovingStatus,
    { label: string; hint: string; dot: string; badge: string }
  >;
  moving: Moving;
  onClose: () => void;
  onCancelTransaction: () => void;
}) {
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!moving) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-moving-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-border bg-card p-4 shadow-2xl sm:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-medium text-muted-foreground">
              {moving.number}
            </p>
            <h2 id="detail-moving-title" className="text-lg font-semibold">
              Detail Request
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                statusMeta[moving.status].badge,
              )}
            >
              {statusMeta[moving.status].label}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Tutup"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {moving.note && (
          <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm">
            {moving.note}
          </p>
        )}

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div>
            <dt className="text-muted-foreground">Dibuat oleh</dt>
            <dd className="font-medium">{moving.createdBy.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Dibuat</dt>
            <dd className="font-medium tabular-nums">
              {formatDate(moving.createdAt, "dd MMM yyyy HH:mm")}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Dikirim</dt>
            <dd className="font-medium tabular-nums">
              {moving.sentAt
                ? formatDate(moving.sentAt, "dd MMM yyyy HH:mm")
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Diterima</dt>
            <dd className="font-medium tabular-nums">
              {moving.receivedAt
                ? formatDate(moving.receivedAt, "dd MMM yyyy HH:mm")
                : "—"}
            </dd>
          </div>
        </dl>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <h3 className="text-xs font-medium text-muted-foreground">
              Item dalam request
            </h3>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {moving.items.length} item ·{" "}
              {moving.items.reduce((sum, line) => sum + line.qty, 0)} unit
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[420px] text-sm">
              <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Item</th>
                  <th className="px-3 py-2 font-medium">SKU</th>
                  <th className="px-3 py-2 text-right font-medium">Qty</th>
                  <th className="px-3 py-2 text-right font-medium">Stok</th>
                </tr>
              </thead>
              <tbody>
                {moving.items.map((line) => (
                  <tr key={line.id} className="border-t border-border">
                    <td className="px-3 py-2 font-medium">{line.item.name}</td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {line.item.sku}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {line.qty} {line.item.unit}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">
                      {line.item.stock} {line.item.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
          {/* Batalkan transaksi */}
          {moving.status !== "CANCELLED" &&
            moving.status !== "RECEIVED" &&
            (confirmCancel ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Batalkan transaksi ini?
                </span>
                <Button
                  type="button"
                  size="sm"
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={() => onCancelTransaction()}
                >
                  Ya, batalkan
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={() => setConfirmCancel(true)}
              >
                <Ban className="size-4" />
                Batalkan Transaksi
              </Button>
            ))}

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
