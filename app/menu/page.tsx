"use client"

import { useState } from "react"

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

// Ubah teks kategori menjadi id yang aman untuk HTML.
// Contoh: "American Coffee" → "american-coffee".
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function MenuPage() {
  // Kategori yang sedang dipilih di dropdown navigasi.
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Ambil daftar menu dari /api/menu.
  const { items, loading, error } = useMenuItems()

  // Menu aktif: tidak dihapus dan tidak tersembunyi.
  const visibleItems = items.filter(
    (item) => item.available && !isHidden(item.name) && !isHidden(item.category)
  )

  // Daftar kategori (urutan kemunculan pertama).
  const categories = Array.from(
    new Set(visibleItems.map((item) => item.category))
  )

  // Default dropdown = kategori pertama, tanpa perlu state terpisah.
  const activeCategory = selectedCategory ?? categories[0]

  // Kelompokkan menu per kategori, untuk tampil berurutan.
  const groups = categories.map((category) => ({
    category,
    items: visibleItems.filter((item) => item.category === category),
  }))

  // Gulir halus ke bagian kategori terpilih (bukan menyembunyikan menu).
  const scrollToCategory = (category: string) => {
    document
      .getElementById(`category-${slugify(category)}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Isi daftar menu, tergantung status (memuat / error / data siap).
  let content
  if (loading) {
    content = <p className="py-24 text-center text-sm text-stone-400">Memuat menu…</p>
  } else if (error) {
    content = (
      <p className="py-24 text-center text-sm text-stone-400">
        Gagal memuat menu. Coba muat ulang halaman.
      </p>
    )
  } else {
    content = (
      <div className="space-y-14">
        {groups.map((group) => (
          <section
            key={group.category}
            id={`category-${slugify(group.category)}`}
            className="scroll-mt-36 sm:scroll-mt-32"
          >
            {/* Judul kategori + jumlah menu */}
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-stone-900">
              {group.category}
              <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-semibold text-stone-600">
                {group.items.length}
              </span>
            </h2>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.items.map((item) => (
                <MenuCard key={item.id} menu={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
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

        {/* Navigasi kategori: memilih kategori langsung gulir ke bagiannya */}
        <section className="sticky top-16 z-10 border-b border-stone-200 bg-white/95 py-4 shadow-sm backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Combobox
              value={activeCategory ?? ""}
              onValueChange={(value) => {
                if (!value) return
                setSelectedCategory(value)
                scrollToCategory(value)
              }}
            >
              <ComboboxInput
                placeholder="Lompat ke kategori…"
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
        </section>

        {/* Daftar menu berkelompok per kategori */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{content}</div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}