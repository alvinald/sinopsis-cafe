import Link from "next/link"
import { Logo } from "@/components/logo"

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
]

// Footer tiga kolom: brand, navigasi, dan alamat kafe.
export function PublicFooter() {
  return (
    <footer className="bg-stone-900 text-stone-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Logo variant="light" />
            <p className="mt-4 text-sm leading-relaxed text-stone-400">
              A cozy corner for great coffee, good food, and warm moments. Visit
              us every day.
            </p>
          </div>

          {/* Link navigasi */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-stone-300">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    className="text-stone-400 transition-colors hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Alamat kafe */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-stone-300">
              Visit Us
            </h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>Jl. Mawar Luar No.20, RT.9/RW.12, Lagoa, Kec. Koja</li>
              <li>Jakarta Utara, Indonesia</li>
              <li className="pt-1">Everyday: 12:00 – 00:00</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-stone-800 pt-6 text-center text-xs text-stone-600">
          © {new Date().getFullYear()} Sinopsis Coffee. All rights reserved.
        </div>
      </div>
    </footer>
  )
}