"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  ApproveButton,
  DeleteButton,
  DetailButton,
  EditButton,
} from "@/components/action-button"

export type PurchaseOrderStatus = "pending" | "approved" | "rejected"

export type PurchaseOrderHeader = {
  invoiceNumber: string
  date: Date | string
  createdBy: string
  description: string
  total: number
  status: PurchaseOrderStatus
  fileUrl?: string
}

const dummyHeaders: PurchaseOrderHeader[] = [
  {
    invoiceNumber: "PO-2026-0001",
    date: new Date("2026-09-25"),
    createdBy: "Budi Santoso (admin)",
    description: "Pembelian bahan baku kopi dan susu",
    total: 2_500_000,
    status: "pending",
    fileUrl: "/files/PO-2026-0001.pdf",
  },
  {
    invoiceNumber: "PO-2026-0002",
    date: new Date("2026-09-26"),
    createdBy: "Siti Rahma (kasir)",
    description: "Pembelian kemasan cup dan sedotan",
    total: 850_000,
    status: "approved",
  },
  {
    invoiceNumber: "PO-2026-0003",
    date: new Date("2026-09-27"),
    createdBy: "Agus Wijaya (admin)",
    description: "Pembelian gula dan sirup",
    total: 1_200_000,
    status: "pending",
    fileUrl: "/files/PO-2026-0003.pdf",
  },
]

const STATUS_BADGE: Record<
  PurchaseOrderStatus,
  { label: string; variant: "default" | "secondary" | "destructive" }
> = {
  pending: { label: "Pending", variant: "secondary" },
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
}

const numberFormat = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
})

function formatIDR(value: number) {
  return `Rp ${numberFormat.format(value)}`
}

export function formatDate(date: Date | string) {
  const parts = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date(date))
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]))
  return `${map.weekday}, ${map.day}-${map.month}-${map.year}`
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium break-words">{value}</div>
    </div>
  )
}

export function PurchaseOrderCards({
  data = dummyHeaders,
}: {
  data?: PurchaseOrderHeader[]
}) {
  const [transactions, setTransactions] = useState(data)
  const [search, setSearch] = useState("")

  const filtered = transactions.filter((t) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return (
      t.invoiceNumber.toLowerCase().includes(query) ||
      t.createdBy.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    )
  })

  function handleDelete(invoiceNumber: string) {
    return async () => {
      setTransactions((prev) =>
        prev.filter((t) => t.invoiceNumber !== invoiceNumber)
      )
    }
  }

  function handleApprove(invoiceNumber: string) {
    return async () => {
      setTransactions((prev) =>
        prev.map((t) =>
          t.invoiceNumber === invoiceNumber
            ? { ...t, status: "approved" as const }
            : t
        )
      )
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 py-4">
        <Input
          placeholder="Cari purchase order..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
        <Link
          href="/admin/purchase/create"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          <Plus />
          Tambah PO
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center text-sm text-muted-foreground">
          Tidak ada purchase order yang cocok.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {filtered.map((transaction) => {
            const badge = STATUS_BADGE[transaction.status]
            return (
              <Card key={transaction.invoiceNumber} size="sm">
                <CardHeader className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <CardTitle>{transaction.invoiceNumber}</CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Field label="Total" value={formatIDR(transaction.total)} />
                  <Field label="User" value={transaction.createdBy} />
                  <Field label="Keterangan" value={transaction.description} />
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Dokumen
                    </div>
                    {transaction.fileUrl ? (
                      <a
                        href={transaction.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium break-words text-primary underline underline-offset-4"
                      >
                        Lihat
                      </a>
                    ) : (
                      <div className="text-sm font-medium text-muted-foreground/60">
                        —
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t pt-3">
                    <ApproveButton
                      withLabel
                      disabled={transaction.status === "approved"}
                      onApprove={handleApprove(transaction.invoiceNumber)}
                    />
                    <div className="flex items-center gap-1">
                      <DetailButton
                        href={`/admin/purchase/${transaction.invoiceNumber}/items`}
                      />
                      <EditButton
                        href={`/admin/purchase/${transaction.invoiceNumber}`}
                      />
                      <DeleteButton
                        onDelete={handleDelete(transaction.invoiceNumber)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}