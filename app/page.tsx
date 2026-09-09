"use client"

import Link from "next/link"
import { ArrowRight, Star, Clock, MapPin } from "lucide-react"

import { PublicNavbar } from "@/components/public-navbar"
import { PublicFooter } from "@/components/public-footer"
import { MenuCard } from "@/components/menu-card"
import { useMenuItems } from "@/hooks/use-menu-items"

export default function HomePage() {
  // Ambil daftar menu dari /api/menu.
  const { items } = useMenuItems()

  // Menu unggulan: nama menu harus mengandung salah satu kata kunci ini.
  const featured = items.filter((m) => {
    const name = m.name.toUpperCase()
    return (
      name.includes("AMERICANO") ||
      name.includes("SINOPSIS COFFEE") ||
      name.includes("BERRYCANO CITRUS")
    )
  })

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <PublicNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-stone-900" id="hero">
          {/* Background gambar + gradient gelap */}
          <div className="absolute inset-0 opacity-20">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/70 to-transparent" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-600/20 px-4 py-2 text-sm font-medium text-amber-400 ring-1 ring-amber-600/30">
                <Star size={14} className="fill-amber-400" />
                Specialty Coffee &amp; Fine Bites
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Where Every Sip
                <br />
                <span className="text-amber-400">Tells a Story</span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-stone-300">
                Discover handcrafted coffees, artisan pastries, and wholesome
                meals in a space designed for comfort. From your morning ritual
                to an afternoon escape.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-amber-500 hover:shadow-amber-600/30"
                >
                  Explore Our Menu
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="#about"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-600 px-7 py-3.5 text-sm font-semibold text-stone-300 transition-all hover:border-stone-400 hover:text-white"
                >
                  Our Story
                </a>
              </div>

              {/* Statistik */}
              <div className="mt-14 flex flex-wrap gap-8">
                {[
                  { value: "50+", label: "Menu Items" },
                  { value: "4.9", label: "Rating" },
                  { value: "5K+", label: "Happy Guests" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-amber-400">
                      {stat.value}
                    </p>
                    <p className="text-xs text-stone-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Info Bar (alamat & jam buka) */}
        <section className="bg-amber-700 py-4" id="info-bar">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-amber-100 sm:justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={15} />
                <span>Jl. Mawar Luar No.20, RT.9/RW.12, Lagoa, Kec. Koja, Jakarta Utara</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={15} />
                <span>
                  Everyday: 12:00 – 00:00
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-20" id="about">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Teks */}
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                  Our Story
                </p>
                <h2 className="mt-3 text-3xl font-bold text-stone-900 sm:text-4xl">
                  Crafted with Passion,{" "}
                  <span className="text-amber-700">Served with Love</span>
                </h2>
                <p className="mt-4 leading-relaxed text-stone-600">
                  Sinopsis Coffee was born from a simple belief: great coffee
                  deserves great company. Since 2019, we&apos;ve been sourcing
                  the finest single-origin beans from across the archipelago,
                  roasted in-house and brewed to perfection.
                </p>
                <p className="mt-3 leading-relaxed text-stone-600">
                  Every item on our menu is made fresh daily — from our flaky
                  croissants to our hearty avocado toasts. We believe food and
                  drink should bring people together.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    { icon: "☕", label: "Single Origin" },
                    { icon: "🫘", label: "In-House Roasted" },
                    { icon: "🌿", label: "Locally Sourced" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col items-center rounded-xl bg-amber-50 p-4 text-center ring-1 ring-amber-100"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className="mt-2 text-xs font-semibold text-stone-700">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gambar */}
              <div className="relative">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80"
                    alt="Sinopsis Coffee cafe interior"
                    className="h-full w-full object-cover"
                  />
                </div>
   
              </div>
            </div>
          </div>
        </section>

        {/* Featured Menu */}
        <section className="bg-stone-50 py-20" id="featured-menu">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                  Our Favorites
                </p>
                <h2 className="mt-1 text-3xl font-bold text-stone-900 sm:text-4xl">
                  Featured Menu
                </h2>
              </div>
              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 transition-colors hover:text-amber-900"
              >
                View All Menu <ArrowRight size={15} />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {featured.map((item) => (
                <MenuCard key={item.id} menu={item} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-amber-900 py-16" id="cta-banner">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to Experience Sinopsis Coffee?
            </h2>
            <p className="mt-4 text-amber-200">
              Browse our full menu and discover your next favorite drink or
              bite.
            </p>
            <Link
              href="/menu"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-amber-900 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              See Full Menu <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  )
}