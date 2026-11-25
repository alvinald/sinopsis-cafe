import { Button } from "@/components/ui/button";
import { StockIn, StockInStatus } from "@/lib/types/stock-in-types";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Ban, Loader2, X } from "lucide-react";
import { useState } from "react";

const STATUS_META: Record<
  StockInStatus,
  { label: string; className: string }
> = {
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
};

export function StockInDetailDialog({
  stockIn,
  loading = false,
  onClose,
  onUpdateStatus,
}: {
  stockIn: StockIn;
  loading?: boolean;
  onClose: () => void;
  onUpdateStatus: (status: StockInStatus) => void | Promise<void>;
}) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const totalQty = stockIn.items.reduce((sum, line) => sum + line.qty, 0);
  const statusMeta = STATUS_META[stockIn.status];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-stock-in-title"
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
              {stockIn.number}
            </p>
            <h2 id="detail-stock-in-title" className="text-lg font-semibold">
              Detail Barang Masuk
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                statusMeta.className,
              )}
            >
              {statusMeta.label}
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

        {stockIn.note && (
          <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm">
            {stockIn.note}
          </p>
        )}

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div>
            <dt className="text-muted-foreground">Dibuat oleh</dt>
            <dd className="font-medium">{stockIn.createdBy.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Dibuat</dt>
            <dd className="font-medium tabular-nums">
              {formatDate(stockIn.createdAt, "dd MMM yyyy HH:mm")}
            </dd>
          </div>
          {stockIn.status === "RECEIVED" && (
            <div>
              <dt className="text-muted-foreground">Diterima</dt>
              <dd className="font-medium tabular-nums">
                {stockIn.receivedAt
                  ? formatDate(stockIn.receivedAt, "dd MMM yyyy HH:mm")
                  : "—"}
              </dd>
            </div>
          )}
          {stockIn.status === "CANCELLED" && (
            <>
              <div>
                <dt className="text-muted-foreground">Dibatalkan oleh</dt>
                <dd className="font-medium">
                  {stockIn.cancelledBy?.name ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Tanggal batal</dt>
                <dd className="font-medium tabular-nums">
                  {stockIn.cancelledAt
                    ? formatDate(stockIn.cancelledAt, "dd MMM yyyy HH:mm")
                    : "—"}
                </dd>
              </div>
            </>
          )}
        </dl>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between">
            <h3 className="text-xs font-medium text-muted-foreground">
              Item barang masuk
            </h3>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {stockIn.items.length} item · {totalQty} unit
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
                {stockIn.items.map((line) => (
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
          {stockIn.status === "PENDING" &&
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
                  onClick={() => void onUpdateStatus("CANCELLED")}
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Ya, batalkan"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={loading}
                  onClick={() => setConfirmCancel(false)}
                >
                  Tidak
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
