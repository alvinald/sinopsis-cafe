"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { getColumns } from "@/components/users/columns"
import { User } from "@/lib/user-types"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DataTable } from "@/components/data-table"
import { toast } from "sonner"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Ambil daftar user sekaligus. Sorting, pencarian, dan pagination
  // dikerjakan di browser oleh DataTable (mode client-side).


  const fetchUsers = useCallback(async () => {
    fetch("/api/users")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/login")
          return
        }
        if (!res.ok) throw new Error("Gagal memuat user")
        setUsers(await res.json())
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [router])

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

const handleDelete = useCallback(
  async (id: string) => {
    try {
      // 1. Eksekusi fetch tanpa .then() menggantung
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })
      console.log("test")

      const data = await res.json()

      // 2. Handle khusus redirect jika Session habis (401)
      if (res.status === 401) {
        toast.error("Sesi telah berakhir, silakan login kembali")
        router.push("/login")
        return
      }

      // 3. Ambil JSON dari backend terlebih dahulu


      // 4. Handle semua jenis error (400, 403, 500, dll) secara dinamis
      if (!res.ok) {
        // Mengambil pesan spesifik dari Better Auth / Zod, jika tidak ada baru gunakan fallback
        const errorMessage = data?.message || data?.error || "Gagal menghapus user"
        toast.error(errorMessage)
        return
      }

      // 5. Berhasil hapus -> Notifikasi sukses & Refresh data
      toast.success("User berhasil dihapus")
      await fetchUsers()

    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Terjadi kesalahan jaringan atau server")
    }
  },
  [fetchUsers, router]
)

  const columns = useMemo(() => getColumns({ onDelete: handleDelete }), [handleDelete])

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-muted-foreground">
        Memuat data user…
      </div>
    )
  }
  

  return (
    <div className="py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <DataTable
          columns={columns}
          data={users}
          onRowDeleted={handleDelete}
          getRowId={(row) => row.id}
          searchPlaceholder="Cari user..."
          toolbar={
            <Link
              href="/admin/users/create"
              className={cn(buttonVariants({ size: "sm" }))}
            >
              <Plus />
              Tambah User
            </Link>
          }
        />
      </div>
    </div>
  )
}