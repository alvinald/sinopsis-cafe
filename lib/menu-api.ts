import type { MenuCategory, MenuItem } from "@/lib/menu-types"

// Placeholder external API URL.
// Ganti dengan endpoint external API asli, contoh:
//   const API_URL = process.env.MENU_API_URL // e.g. "https://api.example.com/menu"
const API_URL = process.env.MENU_API_URL

// Data dummy lokal sebagai placeholder sampai API external tersedia.
import dummyData from "@/data/menu.json"

export class MenuFetchError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "MenuFetchError"
  }
}

/**
 * Mengambil daftar menu dari server ke server.
 *
 * Saat ini memakai data dummy lokal (data/menu.json) sebagai placeholder.
 * Untuk mengarahkan ke API external, set env MENU_API_URL (server-only).
 * Jangan panggil dari client component.
 */
export async function fetchMenu(): Promise<MenuItem[]> {
  if (!API_URL) {
    // Placeholder: baca dummy data dengan sedikit delay untuk mensimulasikan network.
    await new Promise((resolve) => setTimeout(resolve, 200))
    return dummyData as MenuItem[]
  }

  const res = await fetch(API_URL, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  })

  if (!res.ok) {
    throw new MenuFetchError(
      `Failed to fetch menu from ${API_URL}: ${res.status} ${res.statusText}`
    )
  }

  const data = (await res.json()) as MenuItem[]
  return data
}
