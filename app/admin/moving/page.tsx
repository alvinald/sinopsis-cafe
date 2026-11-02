"use client";

import { useMemo, useState, type ReactNode } from "react";

import {
  Ban,
  CheckCheck,
  Eye,
  PackageCheck,
  Pencil,
  Plus,
  RotateCcw,
  Send,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Item, Moving, MovingStatus } from "@/lib/types/moving-types";

// ---------------------------------------------------------------------------
// Model data (mengikuti schema Prisma yang diberikan)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Data contoh
// ---------------------------------------------------------------------------

const ITEMS: Record<string, Item> = {
  itmKopi: {
    id: "itmKopi",
    sku: "ITM-001",
    name: "Biji Kopi Arabika",
    unit: "kg",
    stock: 24,
    isActive: true,
  },
  itmSusu: {
    id: "itmSusu",
    sku: "ITM-002",
    name: "Susu UHT",
    unit: "liter",
    stock: 40,
    isActive: true,
  },
  itmGula: {
    id: "itmGula",
    sku: "ITM-003",
    name: "Gula Aren",
    unit: "kg",
    stock: 18,
    isActive: true,
  },
  itmCup: {
    id: "itmCup",
    sku: "ITM-004",
    name: "Cup 12oz",
    unit: "pcs",
    stock: 500,
    isActive: true,
  },
  itmMatcha: {
    id: "itmMatcha",
    sku: "ITM-005",
    name: "Matcha Powder",
    unit: "kg",
    stock: 6,
    isActive: true,
  },
  itmButter: {
    id: "itmButter",
    sku: "ITM-006",
    name: "Butter",
    unit: "kg",
    stock: 12,
    isActive: true,
  },
};

function movingItem(id: string, movingId: string, itemId: string, qty: number) {
  return { id, movingId, itemId, qty, item: ITEMS[itemId] };
}

const INITIAL_MOVINGS: Moving[] = [
  {
    id: "mov1",
    number: "MV-20261022-0001",
    status: "PENDING",
    note: "Restock bar mingguan",
    createdAt: "2026-10-22T08:15:00.000Z",
    sentAt: null,
    receivedAt: null,
    createdBy: { id: "u1", name: "Alfin" },
    items: [
      movingItem("mi1", "mov1", "itmKopi", 5),
      movingItem("mi2", "mov1", "itmSusu", 10),
    ],
  },
  {
    id: "mov2",
    number: "MV-20261022-0002",
    status: "PENDING",
    note: "Kirim ke outlet cabang",
    createdAt: "2026-10-22T09:40:00.000Z",
    sentAt: null,
    receivedAt: null,
    createdBy: { id: "u2", name: "Sari" },
    items: [
      movingItem("mi3", "mov2", "itmCup", 100),
      movingItem("mi4", "mov2", "itmMatcha", 2),
    ],
  },
  {
    id: "mov3",
    number: "MV-20261021-0003",
    status: "SENT",
    note: "Transfer bahan dessert",
    createdAt: "2026-10-21T13:05:00.000Z",
    sentAt: "2026-10-21T14:20:00.000Z",
    receivedAt: null,
    createdBy: { id: "u3", name: "Budi" },
    items: [
      movingItem("mi5", "mov3", "itmButter", 4),
      movingItem("mi6", "mov3", "itmGula", 3),
    ],
  },
  {
    id: "mov4",
    number: "MV-20261021-0004",
    status: "SENT",
    note: null,
    createdAt: "2026-10-21T15:30:00.000Z",
    sentAt: "2026-10-21T16:00:00.000Z",
    receivedAt: null,
    createdBy: { id: "u1", name: "Alfin" },
    items: [movingItem("mi7", "mov4", "itmSusu", 8)],
  },
  {
    id: "mov5",
    number: "MV-20261020-0005",
    status: "RECEIVED",
    note: "Pengiriman rutin",
    createdAt: "2026-10-20T07:10:00.000Z",
    sentAt: "2026-10-20T08:00:00.000Z",
    receivedAt: "2026-10-20T10:45:00.000Z",
    createdBy: { id: "u2", name: "Sari" },
    items: [
      movingItem("mi8", "mov5", "itmKopi", 3),
      movingItem("mi9", "mov5", "itmCup", 150),
    ],
  },
];

// ---------------------------------------------------------------------------
// Konfigurasi kolom status
// ---------------------------------------------------------------------------

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

const STATUSES: MovingStatus[] = ["PENDING", "SENT", "RECEIVED"];

// ---------------------------------------------------------------------------
// Halaman
// ---------------------------------------------------------------------------

export default function MovingPage() {
  const [movings, setMovings] = useState<Moving[]>(INITIAL_MOVINGS);
  const [activeStatus, setActiveStatus] = useState<MovingStatus>("PENDING");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmMove, setConfirmMove] = useState<{
    id: string;
    status: MovingStatus;
  } | null>(null);

  // Satu request (Moving) boleh berisi banyak item sekaligus.
  const [note, setNote] = useState("");
  const [lines, setLines] = useState<{ itemId: string; qty: number }[]>([
    { itemId: "", qty: 1 },
  ]);

  function addLineFn() {
    setLines((prev) => [...prev, { itemId: "", qty: 1 }]);
  }

  const grouped = useMemo(() => {
    const result: Record<MovingStatus, Moving[]> = {
      PENDING: [],
      SENT: [],
      RECEIVED: [],
      CANCELLED: [],
    };
    for (const moving of movings) result[moving.status].push(moving);
    return result;
  }, [movings]);

  const detail = movings.find((moving) => moving.id === detailId) ?? null;

  // Proses hanya boleh maju: PENDING → SENT → RECEIVED.

  // Minta konfirmasi sebelum status diubah.
  function requestMove(id: string, status: MovingStatus) {
    setConfirmMove({ id, status });
  }

  void requestMove;
  void confirmMove;

  // Tutup form sekaligus bersihkan isiannya (dipakai tombol Batal).
  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setNote("");
    setLines([{ itemId: "", qty: 1 }]);
  }

  function openCreate() {
    setEditingId(null);
    setNote("");
    setLines([{ itemId: "", qty: 1 }]);
    setIsFormOpen(true);
  }

  // Edit hanya untuk transaksi yang masih PENDING.
  function openEdit(moving: Moving) {
    if (moving.status !== "PENDING") return;

    setDetailId(null);
    setConfirmCancel(false);
    setEditingId(moving.id);
    setNote(moving.note ?? "");
    setLines(
      moving.items.length > 0
        ? moving.items.map((line) => ({ itemId: line.item.id, qty: line.qty }))
        : [{ itemId: "", qty: 1 }],
    );
    setIsFormOpen(true);
  }

  function openDetail(id: string) {
    setConfirmCancel(false);
    setDetailId(id);
  }

  function closeDetail() {
    setDetailId(null);
    setConfirmCancel(false);
  }

  // Batalkan transaksi = hapus request dari daftar.
  function cancelRequest(id: string) {
    setMovings((prev) => prev.filter((moving) => moving.id !== id));
    closeDetail();
  }

  // Hanya baris yang sudah dipilih itemnya dan qty-nya valid.
  const filledLines = lines.filter((line) => line.itemId && line.qty > 0);
  const hasDuplicateItem =
    new Set(filledLines.map((line) => line.itemId)).size !== filledLines.length;
  const canSubmit = filledLines.length > 0 && !hasDuplicateItem;

  function updateLine(
    index: number,
    patch: Partial<{ itemId: string; qty: number }>,
  ) {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    );
  }

  function removeLine(index: number) {
    setLines((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
    );
  }

  function submitRequest() {
    if (!canSubmit) return;

    // Mode edit: perbarui request yang ada. Hanya boleh saat PENDING.
    if (editingId) {
      setMovings((prev) =>
        prev.map((moving) => {
          if (moving.id !== editingId || moving.status !== "PENDING") {
            return moving;
          }

          return {
            ...moving,
            note: note.trim() || null,
            items: filledLines.map((line, index) => ({
              id: `${moving.id}-${index}`,
              movingId: moving.id,
              itemId: line.itemId,
              qty: line.qty,
              item: ITEMS[line.itemId],
            })),
          };
        }),
      );
      closeForm();
      return;
    }

    const now = new Date();
    const id = `mov-${now.getTime()}`;

    const moving: Moving = {
      id,
      number: `MV-${formatNumberDate(now)}-${String(movings.length + 1).padStart(4, "0")}`,
      status: "PENDING",
      note: note.trim() || null,
      createdAt: now.toISOString(),
      sentAt: null,
      receivedAt: null,
      createdBy: { id: "me", name: "Alfin" },
      items: filledLines.map((line, index) => ({
        id: `${id}-${index}`,
        movingId: id,
        itemId: line.itemId,
        qty: line.qty,
        item: ITEMS[line.itemId],
      })),
    };

    setMovings((prev) => [moving, ...prev]);
    setActiveStatus("PENDING");
    closeForm();
  }

  return (
    <div className="py-4 md:py-6">
      <div className="mx-auto w-full max-w-6xl px-4 lg:px-6">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Moving Item</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Satu request bisa berisi banyak item. Pindahkan dokumen antar
              status lewat tab, atau pakai tombol aksi di tiap kartu.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={openCreate} size="sm">
              <Plus className="size-4" />
              Buat Request
            </Button>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <div className="flex flex-wrap justify-center gap-2">
            {/* Tombol-tombol status */}
          </div>
        </div>
        {/* Papan status */}
        <StatusTabs
          active={activeStatus}
          counts={{
            PENDING: grouped.PENDING.length,
            SENT: grouped.SENT.length,
            RECEIVED: grouped.RECEIVED.length,
            CANCELLED: grouped.RECEIVED.length,
          }}
          onChange={setActiveStatus}
        />

        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {grouped[activeStatus].map((moving) => (
            <MovingCard
              key={moving.id}
              moving={moving}
              onOpen={() => openDetail(moving.id)}
              onEdit={
                moving.status === "PENDING" ? () => openEdit(moving) : undefined
              }
              action={<CardAction moving={moving} onMove={requestMove} />}
            />
          ))}

          {grouped[activeStatus].length === 0 && (
            <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
              Belum ada dokumen di status ini.
            </div>
          )}
        </div>
      </div>

      {/* Form buat request: satu request dapat berisi banyak item */}
      {isFormOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-moving-title"
          onClick={closeForm}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card p-4 shadow-2xl sm:rounded-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="create-moving-title" className="text-lg font-semibold">
                  {editingId ? "Edit Request" : "Buat Request"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {editingId
                    ? "Ubah item pada request ini. Hanya bisa saat status Menunggu."
                    : "Satu request dapat berisi beberapa item."}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Tutup"
                onClick={closeForm}
              >
                <X className="size-4" />
              </Button>
            </div>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">
                Catatan (opsional)
              </span>
              <input
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="mis. Restock bar mingguan"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </label>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Item
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {filledLines.length} item ·{" "}
                  {filledLines.reduce((sum, line) => sum + line.qty, 0)} unit
                </span>
              </div>

              <div className="space-y-2">
                {lines.map((line, index) => {
                  const selected = line.itemId ? ITEMS[line.itemId] : null;

                  return (
                    <div key={index} className="flex items-center gap-2">
                      <select
                        aria-label={`Item baris ${index + 1}`}
                        value={line.itemId}
                        onChange={(event) =>
                          updateLine(index, { itemId: event.target.value })
                        }
                        className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-background px-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="">Pilih item…</option>
                        {Object.values(ITEMS).map((item) => {
                          const usedByOther = lines.some(
                            (other, otherIndex) =>
                              otherIndex !== index && other.itemId === item.id,
                          );

                          return (
                            <option
                              key={item.id}
                              value={item.id}
                              disabled={usedByOther}
                            >
                              {item.name} · stok {item.stock} {item.unit}
                            </option>
                          );
                        })}
                      </select>

                      <input
                        type="number"
                        min={1}
                        step={1}
                        aria-label={`Qty baris ${index + 1}`}
                        value={line.qty}
                        onChange={(event) =>
                          updateLine(index, {
                            qty: Math.max(
                              1,
                              Math.floor(Number(event.target.value) || 1),
                            ),
                          })
                        }
                        className="h-10 w-16 shrink-0 rounded-lg border border-border bg-background text-center text-sm tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />

                      <span className="w-8 shrink-0 text-xs text-muted-foreground">
                        {selected?.unit ?? ""}
                      </span>

                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={`Hapus baris ${index + 1}`}
                        onClick={() => removeLine(index)}
                        disabled={lines.length === 1}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {hasDuplicateItem && (
                <p className="mt-2 text-xs text-destructive">
                  Item yang sama tidak boleh dipilih dua kali.
                </p>
              )}
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={addLineFn}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium transition hover:bg-accent"
              >
                <Plus className="size-3.5" />
                Tambah Item
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between gap-2 border-t border-border pt-4">
              <div />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeForm}
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={!canSubmit}
                  onClick={submitRequest}
                >
                  {editingId ? "Simpan Perubahan" : "Simpan Request"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup detail request + seluruh itemnya */}
      {detail && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-moving-title"
          onClick={closeDetail}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-border bg-card p-4 shadow-2xl sm:rounded-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[11px] font-medium text-muted-foreground">
                  {detail.number}
                </p>
                <h2 id="detail-moving-title" className="text-lg font-semibold">
                  Detail Request
                </h2>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                    STATUS_META[detail.status].badge,
                  )}
                >
                  {STATUS_META[detail.status].label}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Tutup"
                  onClick={closeDetail}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            {detail.note && (
              <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm">
                {detail.note}
              </p>
            )}

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <dt className="text-muted-foreground">Dibuat oleh</dt>
                <dd className="font-medium">{detail.createdBy.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Dibuat</dt>
                <dd className="font-medium tabular-nums">
                  {formatDateTime(detail.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Dikirim</dt>
                <dd className="font-medium tabular-nums">
                  {detail.sentAt ? formatDateTime(detail.sentAt) : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Diterima</dt>
                <dd className="font-medium tabular-nums">
                  {detail.receivedAt ? formatDateTime(detail.receivedAt) : "—"}
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <h3 className="text-xs font-medium text-muted-foreground">
                  Item dalam request
                </h3>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {detail.items.length} item ·{" "}
                  {detail.items.reduce((sum, line) => sum + line.qty, 0)} unit
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
                    {detail.items.map((line) => (
                      <tr key={line.id} className="border-t border-border">
                        <td className="px-3 py-2 font-medium">
                          {line.item.name}
                        </td>
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
              {confirmCancel ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Batalkan transaksi ini?
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    className="bg-destructive text-white hover:bg-destructive/90"
                    onClick={() => cancelRequest(detail.id)}
                  >
                    Ya, batalkan
                  </Button>
                  <button
                    type="button"
                    onClick={addLineFn}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium transition hover:bg-accent"
                  >
                    <Plus className="size-3.5" />
                    Tambah Item
                  </button>
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
              )}

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeDetail}
                >
                  Tutup
                </Button>
                {detail.status === "PENDING" && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => openEdit(detail)}
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab status
// ---------------------------------------------------------------------------

function StatusTabs({
  active,
  counts,
  onChange,
}: {
  active: MovingStatus;
  counts: Record<MovingStatus, number>;
  onChange: (status: MovingStatus) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Status moving"
      className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-muted/40 p-1.5"
    >
      {STATUSES.map((status) => {
        const meta = STATUS_META[status];
        const isActive = status === active;

        return (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={isActive}
            title={meta.hint}
            onClick={() => onChange(status)}
            className={cn(
              "flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
              isActive
                ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
            )}
          >
            <span className={cn("size-2 shrink-0 rounded-full", meta.dot)} />

            <span className="truncate">{meta.label}</span>

            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                isActive ? "bg-muted text-foreground" : "bg-card/70",
              )}
            >
              {counts[status]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tampilan kartu
// ---------------------------------------------------------------------------

function MovingCard({
  moving,
  handle,
  action,
  onOpen,
  onEdit,
  overlay = false,
}: {
  moving: Moving;
  handle?: ReactNode;
  action?: ReactNode;
  onOpen?: () => void;
  onEdit?: () => void;
  overlay?: boolean;
}) {
  const totalQty = moving.items.reduce((sum, line) => sum + line.qty, 0);

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-xl border border-border bg-card p-3 transition-shadow",
        overlay
          ? "shadow-2xl ring-1 ring-primary/20"
          : "shadow-xs hover:shadow-sm",
      )}
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] font-medium tracking-tight text-muted-foreground">
            {moving.number}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold">
            {moving.note ?? "Tanpa catatan"}
          </p>
        </div>
        {handle}
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
            {formatDate(moving.createdAt)} · {moving.items.length} item ·{" "}
            {totalQty} unit
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
          {action}
        </div>
      </div>
    </article>
  );
}

// Tombol aksi cepat sesuai status saat ini (hanya bisa maju).
function CardAction({
  moving,
  onMove,
}: {
  moving: Moving;
  onMove: (id: string, status: MovingStatus) => void;
}) {
  const getButtonLabel = (status: string) => {
    if (status === "PENDING") {
      return "Kirim";
    } else if (status === "SENT") {
      return "Terima";
    } else if (status === "RECEIVED") {
      return "Selesai";
    }

    return "";
  };
  if (moving.status === "PENDING" || moving.status === "SENT") {
    return (
      <Button
        type="button"
        size="xs"
        className="bg-blue-600 text-white hover:bg-blue-700"
        onClick={(e) => {
          e.stopPropagation();
          if (moving.status === "PENDING") {
            onMove(moving.id, "SENT");
          } else if (moving.status === "SENT") {
            onMove(moving.id, "RECEIVED");
          }
        }}
      >
        <Send className="size-3.5" />

        {getButtonLabel(moving.status)}
      </Button>
    );
  }

  return (
    <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 text-xs font-semibold text-emerald-700">
      <CheckCheck className="size-3.5" />
      Selesai
    </span>
  );
}

// ---------------------------------------------------------------------------
// Util
// ---------------------------------------------------------------------------

function formatNumberDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
