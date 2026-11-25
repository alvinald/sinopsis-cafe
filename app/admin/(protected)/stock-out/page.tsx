"use client";
import { CardRequest } from "@/components/page/stock-out/card-request";
import { ConfirmDialog } from "@/components/page/stock-out/confirm-dialog";
import { DateRangeFilter } from "@/components/page/stock-out/date-range-filter";
import { PageHeader } from "@/components/page/page-header";
import { DetailPopup } from "@/components/page/stock-out/detail-popup";
import StockOutForm from "@/components/page/stock-out/stock-out-form-dialog";
import StatusTabs from "@/components/page/stock-out/status-tabs";
import { Button } from "@/components/ui/button";
import {
  Item,
  StockOut,
  StockOutStatus,
  UpdateStockOutStatusSchema,
} from "@/lib/types/stock-out-types";
import { endOfDay, format, parseISO, startOfDay, subMonths } from "date-fns";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { can } from "@/lib/rbac";
import { authClient } from "@/lib/auth-client";
import { LoadingScreen } from "@/components/loading";
import { exportToExcel } from "@/lib/export-excel";
import { useRouter } from "next/navigation";

const STATUS_META: Record<
  StockOutStatus,
  { label: string; hint: string; dot: string; badge: string }
> = {
  PENDING: {
    label: "Menunggu",
    hint: "Dibuat, barang belum dikirim",
    dot: "bg-amber-500",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
  },
  SENT: {
    label: "Dikirim",
    hint: "Barang dikirim, stok belum berkurang",
    dot: "bg-blue-500",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
  },
  RECEIVED: {
    label: "Diterima",
    hint: "Diterima, stok berkurang",
    dot: "bg-emerald-500",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  CANCELLED: {
    label: "Dibatalkan",
    hint: "Stock out dibatalkan, barang tidak diproses",
    dot: "bg-red-500",
    badge: "border-red-200 bg-red-50 text-red-700",
  },
};

function getDefaultDateRange() {
  const today = new Date();

  return {
    from: format(subMonths(today, 1), "yyyy-MM-dd"),
    to: format(today, "yyyy-MM-dd"),
  };
}

export default function StockOutPage() {
  const [stockOuts, setStockOuts] = useState<StockOut[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedStockOut, setSelectedStockOut] = useState<StockOut | null>(null);

  const [actionLoading, setActionLoading] = useState(false);

  const [activeStatus, setActiveStatus] = useState<StockOutStatus>("PENDING");
  const [dateRange, setDateRange] = useState(getDefaultDateRange);

  const [confirmMove, setConfirmMove] = useState<{
    id: string;
    status: StockOutStatus;
    title: string;
    description: string;
    buttonText: string;
  } | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    // Pastikan path properti permissions sesuai struktur session kamu
    if (!can(session.permissions, "STOCKOUT:VIEW")) {
      router.replace("/forbidden");
    }
  }, [isPending, session, router]);

  const fetchData = useCallback(async () => {
    try {
      const [stockOutsResponse, itemsResponse] = await Promise.all([
        fetch("/api/stock-out"),
        fetch("/api/items"),
      ]);

      if (!stockOutsResponse.ok) {
        throw new Error("Gagal mengambil data stock-out");
      }
      if (!itemsResponse.ok) {
        throw new Error("Gagal mengambil data item");
      }

      const [stockOutsData, itemsData] = await Promise.all([
        stockOutsResponse.json() as Promise<StockOut[]>,
        itemsResponse.json() as Promise<Item[]>,
      ]);

      setStockOuts(stockOutsData);
      setItems(itemsData);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });
  }, [fetchData]);

  const filteredStockOuts = useMemo(() => {
    const fromDate = dateRange.from
      ? startOfDay(parseISO(dateRange.from))
      : null;
    const toDate = dateRange.to ? endOfDay(parseISO(dateRange.to)) : null;

    return stockOuts.filter((stockOut) => {
      const createdAt = new Date(stockOut.createdAt);

      if (fromDate && createdAt < fromDate) return false;
      if (toDate && createdAt > toDate) return false;

      return true;
    });
  }, [stockOuts, dateRange]);

  const groupedStockOuts: Record<StockOutStatus, StockOut[]> = useMemo(() => {
    const result: Record<StockOutStatus, StockOut[]> = {
      PENDING: [],
      SENT: [],
      RECEIVED: [],
      CANCELLED: [],
    };
    for (const stockOut of filteredStockOuts) result[stockOut.status].push(stockOut);
    return result;
  }, [filteredStockOuts]);

  function handleExport() {
    if (filteredStockOuts.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    const formatDate = (value: string | null) =>
      value ? format(new Date(value), "dd/MM/yyyy HH:mm") : "";

    type ExportRow = {
      no: number | "";
      nomor: string;
      tanggalDibuat: string;
      tanggalDikirim: string;
      tanggalDiterima: string;
      tanggalDibatalkan: string;
      status: string;
      dibuatOleh: string;
      dikirimOleh: string;
      diterimaOleh: string;
      dibatalkanOleh: string;
      catatan: string;
      item: string;
      qty: number | "";
      satuan: string;
    };

    const columns = [
      { header: "No", key: "no", width: 6 },
      { header: "Tanggal", key: "tanggalDibuat", width: 20 },
      { header: "Nomor", key: "nomor", width: 22 },
      { header: "Item", key: "item", width: 28 },
      { header: "Qty", key: "qty", width: 8 },
      { header: "Satuan", key: "satuan", width: 10 },
      { header: "Catatan", key: "catatan", width: 30 },
      { header: "Dibuat Oleh", key: "dibuatOleh", width: 20 },
      { header: "Tanggal Dibuat", key: "tanggalDibuat", width: 20 },
      { header: "Dikirim Oleh", key: "dikirimOleh", width: 20 },
      { header: "Tanggal Dikirim", key: "tanggalDikirim", width: 20 },
      { header: "Diterima Oleh", key: "diterimaOleh", width: 20 },
      { header: "Tanggal Diterima", key: "tanggalDiterima", width: 20 },
      { header: "Dibatalkan Oleh", key: "dibatalkanOleh", width: 20 },
      { header: "Tanggal Dibatalkan", key: "tanggalDibatalkan", width: 20 },
    ] as const;

    const rowsByStatus: Record<StockOutStatus, ExportRow[]> = {
      PENDING: [],
      SENT: [],
      RECEIVED: [],
      CANCELLED: [],
    };

    for (const stockOut of filteredStockOuts) {
      const no = rowsByStatus[stockOut.status].length + 1;
      const base = {
        no,
        nomor: stockOut.number,
        tanggalDibuat: formatDate(stockOut.createdAt),
        tanggalDikirim: formatDate(stockOut.sentAt),
        tanggalDiterima: formatDate(stockOut.receivedAt),
        tanggalDibatalkan: formatDate(stockOut.cancelledAt),
        status: STATUS_META[stockOut.status].label,
        dibuatOleh: stockOut.createdBy.name,
        dikirimOleh: stockOut.sentBy?.name ?? "",
        diterimaOleh: stockOut.receivedBy?.name ?? "",
        dibatalkanOleh: stockOut.cancelledBy?.name ?? "",
        catatan: stockOut.note ?? "",
      };

      if (stockOut.items.length === 0) {
        rowsByStatus[stockOut.status].push({
          ...base,
          item: "",
          qty: "",
          satuan: "",
        });
        continue;
      }

      stockOut.items.forEach((line, itemIndex) => {
        rowsByStatus[stockOut.status].push({
          ...base,
          no: itemIndex === 0 ? no : "",
          item: line.item.name,
          qty: line.qty,
          satuan: line.item.unit,
        });
      });
    }

    const statusOrder: StockOutStatus[] = [
      "PENDING",
      "SENT",
      "RECEIVED",
      "CANCELLED",
    ];

    exportToExcel({
      fileName: `stock-out_${dateRange.from || "all"}_${dateRange.to || "all"}`,
      sheets: statusOrder.map((status) => ({
        sheetName: STATUS_META[status].label,
        data: rowsByStatus[status],
        columns: columns.map((column) => ({
          header: column.header,
          key: column.key,
          width: column.width,
        })),
      })),
    });

    toast.success("Export berhasil", {
      description: `${filteredStockOuts.length} transaksi diekspor ke 4 sheet.`,
    });
  }

  function requestMove(
    id: string,
    status: StockOutStatus,
    title: string,
    description: string,
    buttonText: string,
  ) {
    setConfirmMove({
      id,
      status,
      title,
      description,
      buttonText,
    });
    setIsConfirmOpen(true);
  }

  function openDetail(stockOut: StockOut) {
    setIsConfirmOpen(false);
    setIsFormOpen(false);
    setSelectedStockOut(stockOut);
    setIsDetailOpen(true);
  }

  async function closeForm(refresh = false) {
    if (refresh) await fetchData();

    setIsFormOpen(false);
    setSelectedStockOut(null);
  }

  function openForm(stockOut: StockOut | null) {
    setSelectedStockOut(stockOut);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  }

  function closeConfirm() {
    setIsConfirmOpen(false);
    setConfirmMove(null);
  }

  async function onUpdateStatus() {
    if (!confirmMove || actionLoading) return;

    setActionLoading(true);
    try {
      const nextStatus: StockOutStatus =
        confirmMove.status === "PENDING" ? "SENT" : "RECEIVED";
      const body: UpdateStockOutStatusSchema = { status: nextStatus };

      const response = await fetch(`/api/stock-out/${confirmMove.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data stock-out");
      }

      await fetchData();

      toast.success("Success", { description: "Status berhasil diperbarui." });
      closeConfirm();
      return result.data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";

      console.error("Log error:", err);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  }

  async function onCancelTransaction() {
    if (!selectedStockOut || actionLoading) return;

    setActionLoading(true);
    try {
      const body: UpdateStockOutStatusSchema = { status: "CANCELLED" };

      const response = await fetch(`/api/stock-out/${selectedStockOut.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data stock-out");
      }

      await fetchData();

      toast.success("Success", { description: "Status berhasil diperbarui." });
      setIsDetailOpen(false);
      setSelectedStockOut(null);
      return result.data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";

      console.error("Log error:", err);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  }
  if (isPending) {
    return <LoadingScreen />; // atau return null / skeleton
  }
  return (
    <div className="py-4 md:py-6">
      <div className="w-full px-4 lg:px-6">
        <PageHeader
          className="mb-4"
          title="Stock-out"
          description="Kelola stock-out dari gudang ke lokasi cafe."
          actions={
            <Button
              onClick={() => openForm(null)}
              size="sm"
              className="w-full sm:w-auto"
            >
              <Plus className="size-4" />
              Buat Stock-out
            </Button>
          }
        />

        <DateRangeFilter
          className="mb-3"
          from={dateRange.from}
          to={dateRange.to}
          onFromChange={(from) => setDateRange((prev) => ({ ...prev, from }))}
          onToChange={(to) => setDateRange((prev) => ({ ...prev, to }))}
          onReset={() => setDateRange(getDefaultDateRange())}
          onExport={handleExport}
          exportDisabled={isPending || filteredStockOuts.length === 0}
        />

        {/* Papan status */}
        <StatusTabs
          active={activeStatus}
          counts={{
            PENDING: groupedStockOuts.PENDING.length,
            SENT: groupedStockOuts.SENT.length,
            RECEIVED: groupedStockOuts.RECEIVED.length,
            CANCELLED: groupedStockOuts.CANCELLED.length,
          }}
          onChange={setActiveStatus}
          statusMeta={STATUS_META}
        />

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {groupedStockOuts[activeStatus].map((stockOut) => (
            <CardRequest
              key={stockOut.id}
              canSent={can(session?.permissions, "STOCKOUT:SENT")}
              stockOut={stockOut}
              onOpen={() => openDetail(stockOut)}
              onEdit={
                stockOut.status === "PENDING" ? () => openForm(stockOut) : undefined
              }
              onMove={(id, status, title, description, buttonText) =>
                requestMove(id, status, title, description, buttonText)
              }
            />
          ))}

          {groupedStockOuts[activeStatus].length === 0 && (
            <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
              Tidak ada dokumen pada status ini untuk rentang tanggal yang
              dipilih.
            </div>
          )}
        </div>
      </div>
      {isFormOpen && (
        <StockOutForm
          closeForm={closeForm}
          items={items}
          stockOut={selectedStockOut}
        />
      )}

      {isDetailOpen && (
        <DetailPopup
          statusMeta={STATUS_META}
          stockOut={selectedStockOut as StockOut}
          loading={actionLoading}
          onClose={closeForm}
          onCancelTransaction={onCancelTransaction}
        />
      )}

      <ConfirmDialog
        open={isConfirmOpen}
        title={confirmMove?.title || ""}
        description={confirmMove?.description || ""}
        buttonText={confirmMove?.buttonText || ""}
        loading={actionLoading}
        onOpenChange={(open) => {
          if (!open) closeConfirm();
        }}
        onConfirm={onUpdateStatus}
      />
    </div>
  );
}
