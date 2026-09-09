"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"

// Daftar menu utama (hanya Home dan Menu, seperti source).
const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
]

export function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Tampilkan style aktif jika path saat ini cocok dengan link.
  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to)

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Sinopsis Coffee Home">
          <Logo variant="dark" />
        </Link>

        {/* Navigasi desktop */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-amber-900 text-white"
                  : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Tombol hamburger mobile */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-stone-600 hover:bg-stone-100 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Navigasi mobile (muncul saat hamburger diklik) */}
      {mobileOpen && (
        <div className="border-t border-stone-200 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-amber-900 text-white"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}