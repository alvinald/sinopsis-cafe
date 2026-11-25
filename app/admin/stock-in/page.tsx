"use client";

import { LoadingScreen } from "@/components/loading";
import { ConfirmDialog } from "@/components/page/moving-request/confirm-dialog";
import { PageHeader } from "@/components/page/page-header";
import { DateRangeFilter } from "@/components/page/stock-in/date-range-filter";
import { StockInCard } from "@/components/page/stock-in/stock-in-card";
import { StockInDetailDialog } from "@/components/page/stock-in/stock-in-detail-dialog";
import StockInFormDialog from "@/components/page/stock-in/stock-in-form-dialog";
import StatusTabs from "@/components/page/stock-in/status-tabs";
import { Button } from "@/components/ui/button";
import { exportToExcel } from "@/lib/export-excel";
import { Item } from "@/lib/types/item-types";
import { StockIn, StockInStatus } from "@/lib/types/stock-in-types";
import { endOfDay, format, parseISO, startOfDay, subMonths } from "date-fns";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const STATUS_META: Record<
  StockInStatus,
  { label: string; hint: string; dot: string; badge: string }
> = {
  PENDING: {
    label: "Menunggu",
    hint: "Stok belum berubah",
    dot: "bg-amber-500",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
  },
  RECEIVED: {
    label: "Diterima",
    hint: "Stok bertambah",
    dot: "bg-emerald-500",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  CANCELLED: {
    label: "Dibatalkan",
    hint: "Dibatalkan sebelum diterima",
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

export default function StockInPage() {
  const [stockIns, setStockIns] = useState<StockIn[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [dateRange, setDateRange] = useState(getDefaultDateRange);
  const [activeStatus, setActiveStatus] = useState<StockInStatus>("PENDING");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedStockIn, setSelectedStockIn] = useState<StockIn | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const [stockInResponse, itemsResponse] = await Promise.all([
          fetch("/api/stock-in"),
          fetch("/api/items"),
        ]);

        if (!stockInResponse.ok) {
          throw new Error("Gagal mengambil data barang masuk");
        }
        if (!itemsResponse.ok) {
          throw new Error("Gagal mengambil data item");
        }

        const [stockInData, itemsData] = await Promise.all([
          stockInResponse.json() as Promise<StockIn[]>,
          itemsResponse.json() as Promise<Item[]>,
        ]);

        if (!active) return;
        setStockIns(stockInData);
        setItems(itemsData);
      } catch (err) {
        if (!active) return;
        console.error("Error fetching data:", err);
        toast.error("Gagal memuat data");
      } finally {
        if (active) setLoading(false);
      }
    }

    void fetchData();
    return () => {
      active = false;
    };
  }, []);

  const filteredStockIns = useMemo(() => {
    const fromDate = dateRange.from
      ? startOfDay(parseISO(dateRange.from))
      : null;
    const toDate = dateRange.to ? endOfDay(parseISO(dateRange.to)) : null;

    return stockIns.filter((stockIn) => {
      const createdAt = new Date(stockIn.createdAt);
      if (fromDate && createdAt < fromDate) return false;
      if (toDate && createdAt > toDate) return false;
      return true;
    });
  }, [stockIns, dateRange]);

  const groupedStockIns = useMemo(() => {
    const result: Record<StockInStatus, StockIn[]> = {
      PENDING: [],
      RECEIVED: [],
      CANCELLED: [],
    };

    for (const stockIn of filteredStockIns) result[stockIn.status].push(stockIn);
    return result;
  }, [filteredStockIns]);

  function handleExport() {
    if (filteredStockIns.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    const formatDateTime = (value: string | null) =>
      value ? format(new Date(value), "dd/MM/yyyy HH:mm") : "";

    type ExportRow = {
      no: number | "";
      nomor: string;
      tanggalMasuk: string;
      status: string;
      dibuatOleh: string;
      catatan: string;
      item: string;
      qty: number | "";
      satuan: string;
    };

    const rows: ExportRow[] = [];

    filteredStockIns.forEach((stockIn, index) => {
      const base = {
        no: index + 1,
        nomor: stockIn.number,
        tanggalMasuk: formatDateTime(stockIn.receivedAt),
        status:
          stockIn.status === "PENDING"
            ? "Menunggu"
            : stockIn.status === "RECEIVED"
              ? "Diterima"
              : "Dibatalkan",
        dibuatOleh: stockIn.createdBy.name,
        catatan: stockIn.note ?? "",
      };

      if (stockIn.items.length === 0) {
        rows.push({ ...base, item: "", qty: "", satuan: "" });
        return;
      }

      stockIn.items.forEach((line, itemIndex) => {
        rows.push({
          ...base,
          no: itemIndex === 0 ? index + 1 : "",
          item: line.item.name,
          qty: line.qty,
          satuan: line.item.unit,
        });
      });
    });

    exportToExcel({
      fileName: `stock-in_${dateRange.from || "all"}_${dateRange.to || "all"}`,
      sheets: [
        {
          sheetName: "Barang Masuk",
          data: rows,
          columns: [
            { header: "No", key: "no", width: 6 },
            { header: "Nomor", key: "nomor", width: 22 },
            { header: "Tanggal Diterima", key: "tanggalMasuk", width: 20 },
            { header: "Status", key: "status", width: 12 },
            { header: "Dibuat Oleh", key: "dibuatOleh", width: 20 },
            { header: "Catatan", key: "catatan", width: 30 },
            { header: "Item", key: "item", width: 28 },
            { header: "Qty", key: "qty", width: 8 },
            { header: "Satuan", key: "satuan", width: 10 },
          ],
        },
      ],
    });

    toast.success("Export berhasil", {
      description: `${filteredStockIns.length} transaksi diekspor.`,
    });
  }

  async function refreshData() {
    const [stockInResponse, itemsResponse] = await Promise.all([
      fetch("/api/stock-in"),
      fetch("/api/items"),
    ]);

    if (!stockInResponse.ok) throw new Error("Gagal mengambil data barang masuk");
    if (!itemsResponse.ok) throw new Error("Gagal mengambil data item");

    const [stockInData, itemsData] = await Promise.all([
      stockInResponse.json() as Promise<StockIn[]>,
      itemsResponse.json() as Promise<Item[]>,
    ]);

    setStockIns(stockInData);
    setItems(itemsData);
  }

  async function closeForm(refresh = false) {
    if (refresh) await refreshData();
    setIsFormOpen(false);
    setSelectedStockIn(null);
  }

  function openForm(stockIn: StockIn | null) {
    setSelectedStockIn(stockIn);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  }

  function openDetail(stockIn: StockIn) {
    setSelectedStockIn(stockIn);
    setIsFormOpen(false);
    setIsDetailOpen(true);
  }

  function requestReceive(stockIn: StockIn) {
    setSelectedStockIn(stockIn);
    setIsDetailOpen(false);
    setIsConfirmOpen(true);
  }

  function closeConfirm() {
    setIsConfirmOpen(false);
  }

  async function onUpdateStatus(status: StockInStatus) {
    if (!selectedStockIn || actionLoading) return;

    setActionLoading(true);
    try {
      const response = await fetch(`/api/stock-in/${selectedStockIn.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error || "Gagal memperbarui barang masuk");
      }

      await refreshData();
      toast.success(
        status === "RECEIVED"
          ? "Barang masuk berhasil diterima"
          : "Barang masuk berhasil dibatalkan",
      );
      setIsDetailOpen(false);
      closeConfirm();
      setSelectedStockIn(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      console.error("Log error:", err);
      toast.error(message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="py-4 md:py-6">
      <div className="w-full px-4 lg:px-6">
        <PageHeader
          className="mb-4"
          title="Barang Masuk"
          description="Kelola transaksi barang masuk dan penambahan stok."
          actions={
            <Button
              onClick={() => openForm(null)}
              size="sm"
              className="w-full sm:w-auto"
              disabled={actionLoading}
            >
              <Plus className="size-4" />
              Tambah Barang Masuk
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
          exportDisabled={loading || filteredStockIns.length === 0}
        />

        <StatusTabs
          active={activeStatus}
          counts={{
            PENDING: groupedStockIns.PENDING.length,
            RECEIVED: groupedStockIns.RECEIVED.length,
            CANCELLED: groupedStockIns.CANCELLED.length,
          }}
          onChange={setActiveStatus}
          statusMeta={STATUS_META}
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {groupedStockIns[activeStatus].map((stockIn) => (
            <StockInCard
              key={stockIn.id}
              stockIn={stockIn}
              onOpen={() => openDetail(stockIn)}
              onEdit={
                stockIn.status === "PENDING"
                  ? () => openForm(stockIn)
                  : undefined
              }
              onReceive={
                stockIn.status === "PENDING" && !actionLoading
                  ? () => requestReceive(stockIn)
                  : undefined
              }
            />
          ))}

          {groupedStockIns[activeStatus].length === 0 && (
            <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
              Tidak ada dokumen pada status ini untuk rentang tanggal yang
              dipilih.
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <StockInFormDialog
          stockIn={selectedStockIn}
          items={items}
          closeForm={closeForm}
        />
      )}

      {isDetailOpen && selectedStockIn && (
        <StockInDetailDialog
          stockIn={selectedStockIn}
          loading={actionLoading}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedStockIn(null);
          }}
          onUpdateStatus={onUpdateStatus}
        />
      )}

      <ConfirmDialog
        open={isConfirmOpen}
        title="Konfirmasi Penerimaan"
        description={`Terima ${selectedStockIn?.number ?? "barang masuk"} ini? Stok akan bertambah.`}
        buttonText="Ya, terima"
        loading={actionLoading}
        onOpenChange={(open) => {
          if (!open) closeConfirm();
        }}
        onConfirm={() => onUpdateStatus("RECEIVED")}
      />
    </div>
  );
}
