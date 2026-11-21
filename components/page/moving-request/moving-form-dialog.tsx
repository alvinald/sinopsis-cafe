import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  UpdateMovingSchema,
  Item,
  Moving,
  RequestMovingSchema,
} from "@/lib/types/moving-types";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function MovingFormDialog({
  moving,
  items,
  closeForm,
}: {
  moving: Moving | null;
  items: Item[];
  closeForm: (refresh?: boolean) => void | Promise<void>;
}) {
  const [prevMoving, setPrevMoving] = useState<Moving | null>(null);
  const [note, setNote] = useState("");
  const [lines, setLines] = useState<{ itemId: string; qty: string }[]>([
    { itemId: "", qty: "1" },
  ]);

  const [loading, setLoading] = useState(false);

  const itemOptions = useMemo(
    () =>
      items.map((item) => ({
        value: item.id,
        label: `${item.name} · stok ${item.stock} ${item.unit}`,
      })),
    [items],
  );

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
  const handleClose = async (refresh = false) => {
    resetForm();
    await closeForm(refresh);
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
    if (loading) return;

    if (!filledLines || filledLines.length === 0) {
      toast.error("Minimal harus memilih 1 item");
      return;
    }

    setLoading(true);
    try {
      const result = moving ? await updateRequest() : await createRequest();

      toast.success("Success", {
        description: moving ? "Data berhasil diperbarui!" : "Data berhasil dibuat!",
      });
      await handleClose(true);
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";

      console.error("Log error:", err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function createRequest() {
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

    return result.data;
  }

  async function updateRequest() {
    if (!moving) return null;

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

    return result.data;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-moving-title"
      onClick={() => {
        if (!loading) void handleClose();
      }}
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
            disabled={loading}
            onClick={() => void handleClose()}
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
                  <Combobox
                    items={itemOptions}
                    value={
                      itemOptions.find((option) => option.value === line.itemId) ??
                      null
                    }
                    onValueChange={(option) =>
                      updateLine(index, { itemId: option?.value ?? "" })
                    }
                    isItemEqualToValue={(option, value) =>
                      option?.value === value?.value
                    }
                    autoHighlight
                  >
                    <ComboboxInput
                      aria-label={`Item baris ${index + 1}`}
                      placeholder="Cari item…"
                      showClear={Boolean(line.itemId)}
                      className="h-8 w-full min-w-0 flex-1 [&>input]:text-xs"
                    />
                    <ComboboxContent>
                      <ComboboxList>
                        {itemOptions.map((option) => {
                          const usedByOther = lines.some(
                            (other, otherIndex) =>
                              otherIndex !== index &&
                              other.itemId === option.value,
                          );
                          return (
                            <ComboboxItem
                              key={option.value}
                              value={option}
                              disabled={usedByOther}
                            >
                              {option.label}
                            </ComboboxItem>
                          );
                        })}
                        <ComboboxEmpty>Tidak ada item cocok.</ComboboxEmpty>
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>

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
              disabled={loading}
              onClick={() => void handleClose()}
            >
              Tutup
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!canSubmit || loading}
              onClick={() => void submitRequest()}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Menyimpan...
                </>
              ) : moving ? (
                "Simpan Perubahan"
              ) : (
                "Buat Permintaan"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
