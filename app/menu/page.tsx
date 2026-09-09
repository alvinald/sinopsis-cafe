"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"

import { PublicNavbar } from "@/components/public-navbar"
import { Badge } from "@/components/ui/badge"
import type { MenuCategory, MenuItem } from "@/lib/menu-types"
import { Coffee, Sparkles, Ticket, SearchX } from "lucide-react"

const categoryColors: Record<MenuCategory, string> = {
  Coffee: "from-amber-500 to-orange-600",
  "Non-Coffee": "from-emerald-500 to-green-600",
  Pastry: "from-rose-500 to-pink-600",
  Dessert: "from-violet-500 to-purple-600",
  Food: "from-sky-500 to-blue-600",
  Beverage: "from-cyan-500 to-teal-600",
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

function CategorySection({
  category,
  items,
}: {
  category: string
  items: MenuItem[]
}) {
  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <span
          className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${categoryColors[category as MenuCategory]} text-white shadow-lg`}
        >
          <Coffee className="size-5" />
        </span>
        <h2 className="text-2xl font-black tracking-tight text-stone-900 md:text-3xl">
          {category}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-amber-300 to-transparent" />
        <span className="text-sm font-semibold text-stone-400">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-stone-200/80 transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                  !item.available ? "grayscale" : ""
                }`}
              />
              {!item.available && (
                <div className="absolute inset-0 flex items-center justify-center bg-stone-900/50">
                  <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold text-stone-900">
                    Sold Out
                  </span>
                </div>
              )}
              <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-amber-800 backdrop-blur">
                {formatPrice(item.price)}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-stone-900">{item.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                {item.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-amber-50 text-amber-800"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let active = true
    fetch("/api/menu", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat menu")
        return res.json() as Promise<MenuItem[]>
      })
      .then((data) => {
        if (active) {
          setMenu(data)
        }
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Terjadi kesalahan"
          )
        }
      })
    return () => {
      active = false
    }
  }, [])

  const categories = useMemo(
    () => [...new Set((menu ?? []).map((item) => item.category))] as MenuCategory[],
    [menu]
  )

  const visibleCategories = useMemo(
    () =>
      activeCategory === "All"
        ? categories
        : (categories.filter((c) => c === activeCategory) as MenuCategory[]),
    [activeCategory, categories]
  )

  const filteredItems = useMemo(() => {
    const items = menu ?? []
    const q = searchQuery.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
    )
  }, [menu, searchQuery])

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-amber-50/60 via-white to-orange-50/40">
      <PublicNavbar />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=1920&auto=format&fit=crop"
              alt="Cafe"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/60 to-amber-900/40" />
          </div>
          <div className="relative mx-auto w-full max-w-6xl px-4 py-24 text-center md:px-6">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-amber-200 backdrop-blur">
              <Sparkles className="size-4" />
              Freshly prepared daily
            </span>
            <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-lg md:text-6xl">
              Our{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                Menu
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-amber-100/90">
              Crafted drinks, artisan pastries, and wholesome meals — served
              fresh every day.
            </p>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
          {error ? (
            <div className="py-20 text-center">
              <SearchX className="mx-auto mb-4 size-12 text-stone-400" />
              <h2 className="text-2xl font-bold text-stone-900">
                Menu tidak dapat dimuat
              </h2>
              <p className="mt-2 text-stone-500">{error}</p>
            </div>
          ) : !menu ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-2xl bg-stone-200/70"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="mb-12 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setActiveCategory("All")}
                  className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                    activeCategory === "All"
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-600/30"
                      : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-amber-50"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                      activeCategory === category
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-600/30"
                        : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-amber-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="space-y-16">
                {visibleCategories.map((category) => (
                  <CategorySection
                    key={category}
                    category={category}
                    items={menu.filter((item) => item.category === category)}
                  />
                ))}
              </div>

              <div className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 text-center text-white shadow-xl md:p-12">
                <Ticket className="mx-auto mb-4 size-10" />
                <h2 className="text-2xl font-black md:text-3xl">
                  Collect Points on Every Order
                </h2>
                <p className="mx-auto mt-2 max-w-md text-amber-50">
                  Join our loyalty program and earn rewards with every cup of
                  Sinopsis Coffee you enjoy.
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">
        © {new Date().getFullYear()} Sinopsis Cafe. Brewed with love in Jakarta.
      </footer>
    </div>
  )
}
