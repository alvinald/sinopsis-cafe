import { Button } from "@/components/ui/button";
import { StockOutStatus } from "@/lib/generated/prisma/enums";
import { StockOut } from "@/lib/types/stock-out-types";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Ban, Loader2, X } from "lucide-react";
import { useState } from "react";

export function DetailPopup({
  statusMeta,
  stockOut,
  loading = false,
  onClose,
  onCancelTransaction,
}: {
  statusMeta: Record<
    StockOutStatus,
    { label: string; hint: string; dot: string; badge: string }
  >;
  stockOut: StockOut;
  loading?: boolean;
  onClose: () => void;
  onCancelTransaction: () => void;
}) {
  const [confirmCancel, setConfirmCancel] = useState(false);

  if (!stockOut) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-stockOut-title"
      onClick={() => {
        if (!loading) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-border bg-card p-4 shadow-2xl sm:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-medium text-muted-foreground">
              {stockOut.number}
            </p>
            <h2 id="detail-stockOut-title" className="text-lg font-semibold">
              Detail Stock-out
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                statusMeta[stockOut.status].badge,
              )}
            >
              {statusMeta[stockOut.status].label}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Tutup"
              disabled={loading}
              onClick={() => {
                setConfirmCancel(false);
                onClose();
              }}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {stockOut.note && (
          <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm">
            {stockOut.note}
          </p>
        )}

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div>
            <dt className="text-muted-foreground">Dibuat</dt>
            <dd className="font-medium tabular-nums">
              {stockOut.createdAt && stockOut.createdBy?.name
                ? `${stockOut.createdBy.name} - ${formatDate(stockOut.createdAt, "dd MMM yyyy HH:mm")}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Dikirim</dt>
            <dd className="font-medium tabular-nums">
              {stockOut.sentAt && stockOut.sentBy?.name
                ? `${stockOut.sentBy.name} - ${formatDate(stockOut.sentAt, "dd MMM yyyy HH:mm")}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Diterima</dt>
            <dd className="font-medium tabular-nums">
              {stockOut.receivedAt && stockOut.receivedBy?.name
                ? `${stockOut.receivedBy.name} - ${formatDate(stockOut.receivedAt, "dd MMM yyyy HH:mm")}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Dibatalkan</dt>
            <dd className="font-medium tabular-nums">
              {stockOut.cancelledAt && stockOut.cancelledBy?.name
                ? `${stockOut.cancelledBy.name} - ${formatDate(stockOut.cancelledAt, "dd MMM yyyy HH:mm")}`
                : "—"}
            </dd>
          </div>
        </dl>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <h3 className="text-xs font-medium text-muted-foreground">
              Item dalam stock-out
            </h3>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {stockOut.items.length} item ·{" "}
              {stockOut.items.reduce((sum, line) => sum + line.qty, 0)} unit
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
                {stockOut.items.map((line) => (
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
          {stockOut.status !== "CANCELLED" &&
            stockOut.status !== "RECEIVED" &&
            (confirmCancel ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Batalkan transaksi ini?
                </span>
                <Button
                  type="button"
                  size="sm"
                  disabled={loading}
                  className="bg-destructive text-white hover:bg-destructive/90"
                  onClick={() => onCancelTransaction()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Membatalkan...
                    </>
                  ) : (
                    "Ya, batalkan"
                  )}
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={onClose}
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
