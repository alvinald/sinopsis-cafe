import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  UpdateMovingSchema,
  Item,
  Moving,
  RequestMovingSchema,
} from "@/lib/types/moving-types";
import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MovingFormDialog({
  moving,
  items,
  closeForm,
}: {
  moving: Moving | null;
  items: Item[];
  closeForm: () => void;
}) {
  const [prevMoving, setPrevMoving] = useState<Moving | null>(null);
  const [note, setNote] = useState("");
  const [lines, setLines] = useState<{ itemId: string; qty: string }[]>([
    { itemId: "", qty: "1" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state saat prop moving berubah tanpa memicu cascading renders dari effect
  if (moving !== prevMoving) {
    setPrevMoving(moving);
    setNote(moving?.note ?? "");

    setLines(
      moving
        ? moving.items.map((item) => ({
            itemId: item.itemId,
            qty: String(item.qty),
          }))
        : [{ itemId: "", qty: "1" }],
    );
  }

  // Fungsi untuk reset state ke kondisi awal
  const resetForm = () => {
    setNote("");
    setLines([{ itemId: "", qty: "1" }]);
  };

  // Bungkus closeForm agar selalu menjalankan reset
  const handleClose = () => {
    resetForm();
    closeForm();
  };

  // Hanya baris yang sudah dipilih itemnya dan qty-nya valid.
  const filledLines = lines.filter(
    (line) => line.itemId && parseInt(line.qty) > 0,
  );
  const hasDuplicateItem =
    new Set(filledLines.map((line) => line.itemId)).size !== filledLines.length;
  const canSubmit = filledLines.length > 0 && !hasDuplicateItem && !loading;

  function updateLine(
    index: number,
    patch: Partial<{ itemId: string; qty: string }>,
  ) {
    setLines((prev) =>
      prev.map((line, i) => {
        if (i === index) {
          //replace line jadi patch
          return { ...line, ...patch };
        }

        // Jika bukan baris yang dicari, kembalikan data lama
        return line;
      }),
    );
  }

  function removeLine(index: number) {
    setLines((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index),
    );
  }

  function addLineFn() {
    setLines((prev) => [...prev, { itemId: "", qty: "1" }]);
  }

  async function submitRequest() {
    const movingId = moving?.id ?? null;

    setLoading(true);
    // Validasi sederhana
    if (!filledLines || filledLines.length === 0) {
      toast.error("Minimal harus memilih 1 item");
      setLoading(false);
      return;
    }
    if (movingId) {
      await updateRequest();
    } else {
      // Mode CREATE
      await createRequest();
    }
    setLoading(false);
  }

  async function createRequest() {
    setLoading(true);
    setError(null);
    try {
      const body: RequestMovingSchema = {
        note: note,
        items: filledLines.map((item) => ({
          itemId: item.itemId,
          qty: parseInt(item.qty),
        })),
      };

      const response = await fetch("/api/moving-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan data moving");
      }

      console.log("Response Data:", result.data);
      toast.success("Success", { description: "Data berhasil dibuat!" });
      handleClose();
      return result.data;
    } catch (err: unknown) {
      // Type Guard
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";

      console.error("Log error:", err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function updateRequest() {
    if (!moving) return;
    setLoading(true);
    setError(null);

    try {
      const body: UpdateMovingSchema = {
        id: moving.id,
        note: note,
        items: filledLines.map((item) => ({
          itemId: item.itemId,
          qty: parseInt(item.qty),
        })),
      };
      const response = await fetch("/api/moving-request", {
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
      handleClose();
      return result.data;
    } catch (err: unknown) {
      // Type Guard
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";

      console.error("Log error:", err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-moving-title"
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card p-4 shadow-2xl sm:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="create-moving-title" className="text-lg font-semibold">
              {moving ? "Edit Request" : "Buat Request"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {moving
                ? "Ubah item pada request ini. Hanya bisa saat status Menunggu."
                : "Satu request dapat berisi beberapa item."}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Tutup"
            onClick={handleClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <Field>
          <FieldLabel htmlFor="moving-note">Catatan (opsional)</FieldLabel>
          <Input
            id="moving-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="mis. Restock bar mingguan"
            className="h-10"
          />
        </Field>

        <Field className="mt-4">
          <div className="flex items-center justify-between">
            <FieldLabel>Item</FieldLabel>
            <span className="text-[11px] text-muted-foreground tabular-nums">
              {filledLines.length} item ·{" "}
              {filledLines.reduce((sum, line) => sum + parseInt(line.qty), 0)}{" "}
              unit
            </span>
          </div>

          <div className="space-y-2">
            {lines.map((line, index) => {
              const selected = items.find((item) => item.id === line.itemId);

              return (
                <div key={index} className="flex items-center gap-2">
                  <Select
                    value={line.itemId || null}
                    onValueChange={(value) =>
                      updateLine(index, { itemId: value ?? "" })
                    }
                    items={items?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                  >
                    <SelectTrigger
                      aria-label={`Item baris ${index + 1}`}
                      className="h-10 w-full min-w-0 flex-1"
                    >
                      <SelectValue placeholder="Pilih item…" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(items).map((item) => {
                        const usedByOther = lines.some(
                          (other, otherIndex) =>
                            otherIndex !== index && other.itemId === item.id,
                        );
                        return (
                          <SelectItem
                            key={item.id}
                            value={item.id}
                            disabled={usedByOther}
                          >
                            {item.name} · stok {item.stock} {item.unit}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    min={1}
                    step={1}
                    aria-label={`Qty baris ${index + 1}`}
                    value={line.qty}
                    onChange={(event) =>
                      updateLine(index, {
                        qty: event.target.value,
                      })
                    }
                    className="h-8 w-14 shrink-0 text-center text-xs tabular-nums"
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
        </Field>

        <div className="mt-4">
          <Button type="button" variant="outline" size="sm" onClick={addLineFn}>
            <Plus className="size-3.5" />
            Tambah Item
          </Button>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between gap-2">
          <div />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
            >
              Tutup
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!canSubmit}
              onClick={submitRequest}
            >
              {moving ? "Simpan Perubahan" : "Buat Permintaan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
