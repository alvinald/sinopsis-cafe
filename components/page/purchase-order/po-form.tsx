"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

type POItem = {
  id: number
  name: string
  qty: number
  satuan: string
  price: number
}

const numberFormat = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
})

function formatIDR(value: number) {
  return `Rp ${numberFormat.format(value)}`
}

const textareaClass =
  "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"

const gridColumns =
  "md:grid-cols-[minmax(0,1fr)_4.5rem_5rem_7.5rem_8rem]"

export function PurchaseOrderForm() {
  const [items, setItems] = useState<POItem[]>([{ id: 1, name: "", satuan:"", qty: 1, price: 0 }])
  const [invoiceMode, setInvoiceMode] = useState<"auto" | "manual">("auto")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))


  function updateItem(id: number, patch: Partial<POItem>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), name: "", satuan: "", qty: 1, price: 0 },
    ])
  }

  const total = items.reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0),
    0
  )

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    toast.success("Purchase order berhasil disimpan (dummy)")
  }

  return (
    <div className="flex min-h-svh w-full items-start justify-center p-4 md:py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Tambah Purchase Order</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <Field>
              <div className="flex items-center justify-between gap-4">
                <FieldLabel>Nomor Invoice</FieldLabel>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Isi manual
                  </span>
                  <Switch
                    checked={invoiceMode === "manual"}
                    onCheckedChange={(checked) =>
                      setInvoiceMode(checked ? "manual" : "auto")
                    }
                    aria-label="Isi nomor invoice secara manual"
                  />
                </div>
              </div>
              {invoiceMode === "manual" ? (
                <Input
                  id="invoiceNumber"
                  name="invoiceNumber"
                  type="text"
                  placeholder="Ketik nomor, mis. PO-2026-0004"
                  className="h-8"
                />
              ) : (
                  <Input
                    disabled
                    placeholder="Nomor diberikan otomatis oleh sistem saat disimpan"
                    className="h-8 opacity-60"
                  />
                )}
              </Field>
            <div className="grid grid-cols-1 gap-4 ">
              <Field>
                <FieldLabel htmlFor="date">Tanggal</FieldLabel>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-8"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="description">Keterangan</FieldLabel>
              <textarea
                id="description"
                name="description"
                rows={2}
                placeholder="Catatan pembelian"
                className={cn(textareaClass, "h-auto resize-none")}
              />
            </Field>
            <hr></hr>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-heading text-sm font-medium">
                  Detail Item
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  <Plus />
                  Tambah Item
                </button>
              </div>

              <div className="flex flex-col gap-2 md:gap-0">
                <div
                  className={cn(
                    "hidden gap-3 px-3 text-xs text-muted-foreground md:grid md:px-0 md:py-2",
                    gridColumns
                  )}
                >
                  <span>Nama Item</span>
                  <span>Qty</span>
                  <span>Satuan</span>
                  <span>Harga</span>
                  <span>Subtotal</span>
                </div>

                {items.map((item) => {
                  const subtotal =
                    (Number(item.qty) || 0) * (Number(item.price) || 0)
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "grid grid-cols-2 items-end gap-3 rounded-lg border border-border p-3 md:rounded-none md:border-0 md:border-b md:p-0 md:py-2 md:last:border-b-0",
                        gridColumns
                      )}
                    >
                      <Field className="col-span-2 md:col-span-1">
                        <FieldLabel className="text-xs md:hidden">
                          Nama Barang
                        </FieldLabel>
                        <Input
                          type="text"
                          placeholder="Nama barang"
                          value={item.name}
                          onChange={(e) =>
                            updateItem(item.id, { name: e.target.value })
                          }
                          className="h-8"
                        />
                      </Field>
                      <Field>
                        <FieldLabel className="text-xs md:hidden">
                          Qty
                        </FieldLabel>
                        <Input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) =>
                            updateItem(item.id, {
                              qty: Number(e.target.value),
                            })
                          }
                          className="h-8"
                        />
                      </Field>
                      <Field className="col-span-1 md:col-span-1">
                        <FieldLabel className="text-xs md:hidden">
                          Satuan
                        </FieldLabel>
                        <Input
                          type="text"
                          placeholder="Satuan"
                          value={item.satuan}
                          onChange={(e) =>
                            updateItem(item.id, { satuan: e.target.value })
                          }
                          className="h-8"
                        />
                      </Field>
                      <Field className="col-span-2 md:col-span-1">
                        <FieldLabel className="text-xs md:hidden">
                          Harga
                        </FieldLabel>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(item.id, {
                              price: Number(e.target.value),
                            })
                          }
                          className="h-8"
                        />
                      </Field>
                      <div className="col-span-2 flex items-center justify-between gap-3 md:col-span-1">
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground md:hidden">
                            Subtotal
                          </div>
                          <div className="text-sm font-medium wrap-break-word">
                            {formatIDR(subtotal)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className={cn(
                            buttonVariants({
                              variant: "ghost",
                              size: "icon",
                            }),
                            "size-7 shrink-0 text-muted-foreground hover:text-destructive disabled:pointer-events-none disabled:opacity-40"
                          )}
                          aria-label="Hapus item"
                          title="Hapus item"
                        >
                          <Trash2Icon />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-4">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-heading text-base font-medium">
                  {formatIDR(total)}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Link
              href="/admin/purchase"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Batal
            </Link>
            <button type="submit" className={cn(buttonVariants())}>
              Simpan
            </button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}