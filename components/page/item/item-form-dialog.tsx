"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
  Item,
  type CreateItemRequest,
  type UpdateItemRequest,
} from "@/lib/types/item-types";

export function ItemFormDialog({
  mode,
  item,
  onClose,
  onSave,
}: {
  mode: "create" | "edit";
  item?: Item | null;
  onClose: () => void;
  onSave: (
    mode: "create" | "edit",
    values: CreateItemRequest | UpdateItemRequest,
  ) => Promise<void>;
}) {
  const isCreate = mode === "create";
  const [sku, setSku] = useState(item?.sku ?? "");
  const [name, setName] = useState(item?.name ?? "");
  const [unit, setUnit] = useState(item?.unit ?? "");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">(
    item?.status ?? "ACTIVE",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      if (mode === "create") {
        await onSave(mode, { sku, name, unit, status });
      } else if (item) {
        await onSave("edit", { id: item.id, sku, name, unit, status });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan item");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="item-form-title"
      onClick={saving ? undefined : onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-card p-4 shadow-2xl sm:max-w-md sm:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="item-form-title" className="text-lg font-semibold">
              {isCreate ? "Tambah Item" : "Edit Item"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {isCreate
                ? "Tambahkan item baru ke inventory."
                : "Perbarui data item inventory."}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Tutup"
            disabled={saving}
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="item-sku">SKU</FieldLabel>
                <Input
                  id="item-sku"
                  type="text"
                  required
                  autoFocus
                  value={sku}
                  onChange={(event) => setSku(event.target.value)}
                  placeholder="Misalnya: ITM-001"
                  className="h-10 font-mono"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="item-unit">Satuan</FieldLabel>
                <Input
                  id="item-unit"
                  type="text"
                  required
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                  placeholder="pcs, box, kg"
                  className="h-10"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="item-name">Nama Item</FieldLabel>
              <Input
                id="item-name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nama item"
                className="h-10"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="item-status">Status</FieldLabel>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value ?? "ACTIVE")}
                >
                  <SelectTrigger id="user-status" className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={"ACTIVE"} value="ACTIVE">
                      Active
                    </SelectItem>
                    <SelectItem key={"INACTIVE"} value="INACTIVE">
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </FieldGroup>

          <Separator className="my-4" />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={saving}
              onClick={onClose}
            >
              Batal
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Menyimpan..." : isCreate ? "Tambah" : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
