"use client"

import { useEffect, useState } from "react"
import type { MenuItem } from "@/lib/menu-types"

// Hook untuk mengambil daftar menu dari route /api/menu.
// Dipakai bareng di halaman Home dan Menu.
export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat menu")
        return res.json()
      })
      .then((data: MenuItem[]) => setItems(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return { items, loading, error }
}