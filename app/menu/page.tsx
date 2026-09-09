"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { PublicNavbar } from "@/components/public-navbar"
import { PublicFooter } from "@/components/public-footer"
import { MenuCard } from "@/components/menu-card"
import { useMenuItems } from "@/hooks/use-menu-items"

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

// Kata yang menandakan menu/kategori tidak perlu ditampilkan.
const HIDDEN_WORDS = ["new", "additional", "uncategorized"]

// True jika teks mengandung salah satu kata tersembunyi.
function isHidden(text: string): boolean {
  return HIDDEN_WORDS.some((word) => text.toLowerCase().includes(word))
}

export default function MenuPage() {
  // State filter: kategori terpilih + kata kunci pencarian.
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  // Ambil daftar menu dari /api/menu.
  const { items, loading, error } = useMenuItems()

  // Menu aktif: tidak dihapus dan tidak tersembunyi.
  const visibleItems = items.filter(
    (item) => item.available && !isHidden(item.name) && !isHidden(item.category)
  )

  // Kategori untuk tombol filter, diambil dari semua menu aktif.
  const categories = [
    "All",
    ...Array.from(new Set(visibleItems.map((item) => item.category))),
  ]

  // Menu yang cocok dengan kategori terpilih + kata kunci pencarian.
  const filtered = visibleItems.filter((item) => {
    const matchCategory =
      activeCategory === "All" || item.category === activeCategory

    const q = searchQuery.toLowerCase()
    const matchSearch =
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)

    return matchCategory && matchSearch
  })

  // Kosongkan semua filter.
  const clearFilters = () => {
    setActiveCategory("All")
    setSearchQuery("")
  }

  // Isi area grid, tergantung status (memuat / error / kosong / ada data).
  let content
  if (loading) {
    content = <p className="py-24 text-center text-sm text-stone-400">Memuat menu…</p>
  } else if (error) {
    content = (
      <p className="py-24 text-center text-sm text-stone-400">
        Gagal memuat menu. Coba muat ulang halaman.
      </p>
    )
  } else if (filtered.length === 0) {
    content = (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-5xl">☕</span>
        <h3 className="mt-4 text-lg font-semibold text-stone-700">
          No items found
        </h3>
        <p className="mt-1 text-sm text-stone-400">
          Try a different search or category.
        </p>
        <button
          onClick={clearFilters}
          className="mt-4 rounded-full bg-amber-700 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-800"
        >
          Clear Filters
        </button>
      </div>
    )
  } else {
    content = (
      <>
        <p className="mb-6 text-sm text-stone-400">
          Showing{" "}
          <span className="font-semibold text-stone-700">
            {filtered.length}
          </span>{" "}
          items
          {activeCategory !== "All" && (
            <>
              {" "}
              in{" "}
              <span className="font-semibold text-stone-700">
                {activeCategory}
              </span>
            </>
          )}
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <MenuCard key={item.id} menu={item} />
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-stone-900 py-16 text-center">
          <div className="mx-auto max-w-2xl px-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-400">
              Explore
            </p>
            <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
              Our Menu
            </h1>
            <p className="mt-4 text-stone-400">
              Handcrafted drinks, fresh bites, and decadent desserts — made with
              love every single day.
            </p>
          </div>
        </section>

        {/* Filter: kolom pencarian + dropdown kategori */}
        <section className="sticky top-16 z-10 border-b border-stone-200 bg-white/95 py-4 shadow-sm backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Pencarian */}
              <div className="relative max-w-sm flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-stone-200 bg-stone-50 py-2 pl-9 pr-4 text-sm text-stone-700 placeholder:text-stone-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              {/* Combobox kategori (lebar 40% di layar besar) */}
              <Combobox
                value={activeCategory}
                onValueChange={(value) => setActiveCategory(value ?? "All")}
              >
                <ComboboxInput
                  placeholder="Pilih kategori…"
                  className="w-full lg:w-2/5"
                />
                <ComboboxContent>
                  <ComboboxList>
                    {categories.map((category) => (
                      <ComboboxItem key={category} value={category}>
                        {category}
                      </ComboboxItem>
                    ))}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>
        </section>

        {/* Daftar menu */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{content}</div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}