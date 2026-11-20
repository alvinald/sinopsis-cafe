"use client";
import { CardRequest } from "@/components/page/moving-request/card-request";
import { ConfirmDialog } from "@/components/page/moving-request/confirm-dialog";
import { DateRangeFilter } from "@/components/page/moving-request/date-range-filter";
import { PageHeader } from "@/components/page/page-header";
import { DetailPopup } from "@/components/page/moving-request/detail-popup";
import MovingForm from "@/components/page/moving-request/moving-form-dialog";
import StatusTabs from "@/components/page/moving-request/status-tabs";
import { Button } from "@/components/ui/button";
import {
  Item,
  Moving,
  MovingStatus,
  UpdateMovingStatusSchema,
} from "@/lib/types/moving-types";
import { endOfDay, format, parseISO, startOfDay, subMonths } from "date-fns";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { can } from "@/lib/rbac";
import { authClient } from "@/lib/auth-client";
import { LoadingScreen } from "@/components/loading";
import { useRouter } from "next/navigation";

const STATUS_META: Record<
  MovingStatus,
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
    hint: "Stok gudang asal berkurang",
    dot: "bg-blue-500",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
  },
  RECEIVED: {
    label: "Diterima",
    hint: "Stok gudang tujuan bertambah",
    dot: "bg-emerald-500",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  CANCELLED: {
    label: "Dibatalkan",
    hint: "Request dibatalkan, barang tidak diproses",
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

export default function MovingRequestPage() {
  const [movings, setMovings] = useState<Moving[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [updatedData, setUpdatedData] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedMoving, setSelectedMoving] = useState<Moving | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeStatus, setActiveStatus] = useState<MovingStatus>("PENDING");
  const [dateRange, setDateRange] = useState(getDefaultDateRange);

  const [note, setNote] = useState("");
  const [lines, setLines] = useState<{ itemId: string; qty: number }[]>([
    { itemId: "", qty: 1 },
  ]);

  const [confirmMove, setConfirmMove] = useState<{
    id: string;
    status: MovingStatus;
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
    if (!can(session.permissions, "MOVING:VIEW")) {
      router.replace("/forbidden");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    // Fetch data jadwal shift dari API
    const fetchMovingReq = async () => {
      try {
        const response = await fetch(`/api/moving-request`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data moving request");
        }
        const data: Moving[] = await response.json();
        setMovings(data);

        setUpdatedData(false);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setUpdatedData(false);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/items`);
        if (!response.ok) {
          throw new Error("Gagal mengambil data jadwal shift");
        }
        const data: Item[] = await response.json();
        setItems(data);

        setUpdatedData(false);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setUpdatedData(false);
      }
    };
    setLoading(true);
    fetchItems();
    fetchMovingReq();
    setLoading(false);
  }, [updatedData]);

  const filteredMovings = useMemo(() => {
    const fromDate = dateRange.from
      ? startOfDay(parseISO(dateRange.from))
      : null;
    const toDate = dateRange.to ? endOfDay(parseISO(dateRange.to)) : null;

    return movings.filter((moving) => {
      const createdAt = new Date(moving.createdAt);

      if (fromDate && createdAt < fromDate) return false;
      if (toDate && createdAt > toDate) return false;

      return true;
    });
  }, [movings, dateRange]);

  const groupedMovings: Record<MovingStatus, Moving[]> = useMemo(() => {
    const result: Record<MovingStatus, Moving[]> = {
      PENDING: [],
      SENT: [],
      RECEIVED: [],
      CANCELLED: [],
    };
    for (const moving of filteredMovings) result[moving.status].push(moving);
    return result;
  }, [filteredMovings]);

  function requestMove(
    id: string,
    status: MovingStatus,
    requestMove: string,
    description: string,
    buttonText: string,
  ) {
    setConfirmMove({
      id,
      status,
      title: requestMove,
      description: description,
      buttonText: buttonText,
    });
    onChangeConfirm();
  }

  function openDetail(moving: Moving) {
    setIsConfirmOpen(false);
    setIsFormOpen(false);
    setSelectedMoving(moving);
    setIsDetailOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setSelectedMoving(null);
    setUpdatedData(true);
    setNote("");
    setLines([{ itemId: "", qty: 1 }]);
  }

  function openForm(moving: Moving | null) {
    setSelectedMoving(moving);
    setNote("");
    setLines([{ itemId: "", qty: 1 }]);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  }

  function onChangeConfirm() {
    setIsConfirmOpen(!isConfirmOpen);
    // if (!confirmOpen) {
    //   setDetailOpen(false);
    // }
  }

  function onUpdateStatus() {
    async function updateStatus(status: MovingStatus) {
      try {
        const body: UpdateMovingStatusSchema = {
          status: status,
        };

        const response = await fetch(`/api/moving-request/${confirmMove?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal menyimpan data moving");
        }

        toast.success("Success", { description: "Data berhasil dibuat!" });
        onChangeConfirm();
        setConfirmMove(null);
        setUpdatedData(true);
        return result.data;
      } catch (err: unknown) {
        // Type Guard
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan";

        console.error("Log error:", err);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    if (confirmMove) {
      if (confirmMove.status === "PENDING") {
        updateStatus("SENT");
      } else {
        updateStatus("RECEIVED");
      }
    }
  }

  function onCancelTransaction() {
    async function cancelTransaction() {
      try {
        const body: UpdateMovingStatusSchema = {
          status: "CANCELLED",
        };

        const response = await fetch(
          `/api/moving-request/${selectedMoving?.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Gagal menyimpan data moving");
        }

        toast.success("Success", { description: "Data berhasil dibuat!" });
        setIsDetailOpen(false);
        setSelectedMoving(null);
        setUpdatedData(true);
        return result.data;
      } catch (err: unknown) {
        // Type Guard
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan";

        console.error("Log error:", err);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    }

    if (selectedMoving) {
      console.log("Cancel transaction:", selectedMoving);
      cancelTransaction();
    }
  }
  if (loading || isPending) {
    return <LoadingScreen />; // atau return null / skeleton
  }
  return (
    <div className="py-4 md:py-6">
      <div className="w-full px-4 lg:px-6">
        <PageHeader
          className="mb-4"
          title="Moving Item"
          description="Kelola request pindah item dari gudang ke lokasi cafe."
          actions={
            <Button
              onClick={() => openForm(null)}
              size="sm"
              className="w-full sm:w-auto"
            >
              <Plus className="size-4" />
              Buat Request
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
        />

        {/* Papan status */}
        <StatusTabs
          active={activeStatus}
          counts={{
            PENDING: groupedMovings.PENDING.length,
            SENT: groupedMovings.SENT.length,
            RECEIVED: groupedMovings.RECEIVED.length,
            CANCELLED: groupedMovings.CANCELLED.length,
          }}
          onChange={setActiveStatus}
          statusMeta={STATUS_META}
        />

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {groupedMovings[activeStatus].map((moving) => (
            <CardRequest
              key={moving.id}
              canSent={can(session?.permissions, "MOVING:SENT")}
              moving={moving}
              onOpen={() => openDetail(moving)}
              onEdit={
                moving.status === "PENDING" ? () => openForm(moving) : undefined
              }
              onMove={() =>
                requestMove(
                  moving.id,
                  moving.status,
                  "Konfirmasi Perubahan Status",
                  "Apakah Anda yakin ingin mengubah status?",
                  "Ya, ubah status",
                )
              }
            />
          ))}

          {groupedMovings[activeStatus].length === 0 && (
            <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
              Tidak ada dokumen pada status ini untuk rentang tanggal yang
              dipilih.
            </div>
          )}
        </div>
      </div>
      {isFormOpen && (
        <MovingForm
          closeForm={closeForm}
          items={items}
          moving={selectedMoving}
        />
      )}

      {isDetailOpen && (
        <DetailPopup
          statusMeta={STATUS_META}
          moving={selectedMoving as Moving}
          onClose={closeForm}
          onCancelTransaction={onCancelTransaction}
        />
      )}

      <ConfirmDialog
        open={isConfirmOpen}
        title={confirmMove?.title || ""}
        description={confirmMove?.description || ""}
        buttonText={confirmMove?.buttonText || ""}
        onOpenChange={onChangeConfirm}
        onConfirm={onUpdateStatus}
      />
    </div>
  );
}
