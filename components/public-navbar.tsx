"use client"

import { useState } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Coffee, Menu } from "lucide-react"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
]

export function PublicNavbar({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-amber-200/60 bg-gradient-to-r from-amber-50 via-white to-orange-50/70 backdrop-blur",
        className
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-600/30">
            <Coffee className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-stone-900">
            Sinopsis <span className="text-amber-700">Cafe</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-amber-100 hover:text-amber-900",
                link.href === "/menu" &&
                  "bg-amber-500 text-white shadow-sm shadow-amber-600/30 hover:bg-amber-600 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden sm:inline-flex text-stone-700 hover:text-amber-800"
            )}
          >
            Log in
          </Link>
          <Link
            href="/menu"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "hidden sm:inline-flex bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-md shadow-amber-600/30"
            )}
          >
            Order Now
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="flex size-9 items-center justify-center rounded-xl border border-amber-200 bg-white text-stone-700 transition-colors hover:bg-amber-50 md:hidden"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-l border-amber-200/60 bg-white">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 text-stone-900">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                    <Coffee className="size-4" />
                  </span>
                  Sinopsis Cafe
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2.5 text-base font-medium text-stone-700 transition-colors hover:bg-amber-50 hover:text-amber-900"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-stone-200" />
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-base font-medium text-stone-700 transition-colors hover:bg-amber-50 hover:text-amber-900"
                >
                  Log in
                </Link>
                <Link
                  href="/menu"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-2.5 text-center text-base font-semibold text-white shadow-md shadow-amber-600/30 transition-colors hover:from-amber-600 hover:to-orange-700"
                >
                  Order Now
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
