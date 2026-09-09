import Image from "next/image"
import Link from "next/link"

import { PublicNavbar } from "@/components/public-navbar"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Coffee,
  Leaf,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  ArrowRight,
} from "lucide-react"

export const metadata = {
  title: "Sinopsis Cafe | Coffee & Space",
  description:
    "Sinopsis Cafe — cozy cafe offering handcrafted specialty coffees, artisan pastries, and wholesome meals. Visit us today.",
}

const highlights = [
  {
    icon: Coffee,
    title: "Specialty Coffee",
    desc: "Handcrafted from single-origin beans, roasted in-house daily.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Leaf,
    title: "Fresh & Local",
    desc: "Wholesome ingredients sourced from local farmers and bakers.",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: Sparkles,
    title: "Cozy Space",
    desc: "A warm, inviting space to work, relax, and connect.",
    color: "from-violet-500 to-purple-600",
  },
]

const featured = [
  {
    name: "Espresso",
    price: "25K",
    desc: "Rich and concentrated",
    image:
      "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "Cappuccino",
    price: "32K",
    desc: "Velvety milk and foam",
    image:
      "https://images.unsplash.com/photo-1507133284879-749f7b7a1ac8?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "Iced Latte",
    price: "30K",
    desc: "Smooth and refreshing",
    image:
      "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=500&auto=format&fit=crop",
  },
]

const testimonials = [
  {
    name: "Rina S.",
    role: "Regular Customer",
    text: "The best cappuccino I've had in Jakarta. The cozy vibe makes it my go-to spot to work.",
    initials: "RS",
    color: "bg-amber-500",
  },
  {
    name: "Budi P.",
    role: "Remote Worker",
    text: "Great wifi, great coffee, and the avocado toast is incredible. Perfect workspace.",
    initials: "BP",
    color: "bg-emerald-500",
  },
  {
    name: "Maya W.",
    role: "First-time Visitor",
    text: "Lovely atmosphere and friendly baristas. The matcha latte is a must-try!",
    initials: "MW",
    color: "bg-violet-500",
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-amber-50/60 via-white to-orange-50/40">
      <PublicNavbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1920&auto=format&fit=crop"
            alt="Cafe ambiance"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-stone-900/50 to-amber-900/40" />
        </div>
        <div className="relative mx-auto flex min-h-[80svh] w-full max-w-6xl flex-col items-center justify-center px-4 py-24 text-center md:px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-amber-200 backdrop-blur">
            <Sparkles className="size-4" />
            Coffee &amp; Space — Jakarta
          </span>
          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl">
            Brewed with{" "}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-500 bg-clip-text text-transparent">
              Love
            </span>
            , Served for You
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-amber-100/90 md:text-xl">
            Handcrafted specialty coffee, artisan pastries, and wholesome meals
            in a cozy space made for you.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-gradient-to-r from-amber-400 to-orange-500 px-8 text-base text-white shadow-lg hover:from-amber-500 hover:to-orange-600"
              )}
            >
              Explore Our Menu
              <ArrowRight />
            </Link>
            <Link
              href="/#about"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/40 bg-white/10 px-8 text-base text-white backdrop-blur hover:bg-white/20 hover:text-white"
              )}
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-20">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 md:grid-cols-3 md:px-6">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="group rounded-2xl border border-stone-200/80 bg-white/70 p-8 text-center shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={cn(
                  "mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                  h.color
                )}
              >
                <h.icon className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">{h.title}</h3>
              <p className="mt-2 leading-relaxed text-stone-600">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="mb-12 flex flex-col items-center text-center">
            <span className="mb-3 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold uppercase tracking-widest text-amber-800">
              Customer Favorites
            </span>
            <h2 className="text-3xl font-black tracking-tight text-stone-900 md:text-4xl">
              Our Signature Drinks
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <div
                key={item.name}
                className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-stone-200/80 transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-amber-800 backdrop-blur">
                    {item.price}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-stone-900">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">{item.desc}</p>
                  <Link
                    href="/menu"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800"
                  >
                    Order now <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/menu"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-amber-300 text-amber-800 hover:bg-amber-50"
              )}
            >
              See Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=900&auto=format&fit=crop"
                alt="Inside Sinopsis Cafe"
                width={900}
                height={700}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 px-8 py-6 text-white shadow-xl md:block">
              <p className="text-3xl font-black">Est. 2020</p>
              <p className="text-sm text-amber-100">Serving Jakarta daily</p>
            </div>
          </div>
          <div>
            <span className="mb-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold uppercase tracking-widest text-emerald-700">
              Our Story
            </span>
            <h2 className="text-3xl font-black leading-tight tracking-tight text-stone-900 md:text-4xl">
              A Space Brewed for the{" "}
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Community
              </span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-stone-600">
              At Sinopsis Cafe, we believe great coffee brings people together.
              From our single-origin beans roasted in-house to our locally
              sourced pastries, every cup tells a story.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Single-origin beans roasted in-house",
                "Artisan pastries baked fresh every morning",
                "Wholesome meals made from local ingredients",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-stone-700">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Sparkles className="size-3.5" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold uppercase tracking-widest text-violet-700">
              What They Say
            </span>
            <h2 className="text-3xl font-black tracking-tight text-stone-900 md:text-4xl">
              Loved by Our Customers
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl bg-white p-8 shadow-md ring-1 ring-stone-200/80"
              >
                <div className="mb-4 flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="leading-relaxed text-stone-700">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-full text-sm font-bold text-white",
                      t.color
                    )}
                  >
                    {t.initials}
                  </span>
                  <div>
                    <p className="font-semibold text-stone-900">{t.name}</p>
                    <p className="text-sm text-stone-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 to-stone-950 shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <span className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-semibold uppercase tracking-widest text-amber-300">
                  Visit Us
                </span>
                <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                  Come Say Hello
                </h2>
                <p className="mt-4 leading-relaxed text-stone-300">
                  We&apos;d love to see you. Drop by for a coffee or get in
                  touch for collaboration and bookings.
                </p>
                <div className="mt-8 space-y-4 text-stone-200">
                  <div className="flex items-center gap-3">
                    <Clock className="size-5 text-amber-400" />
                    <span>Daily · 7:00 — 22:00</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="size-5 text-amber-400" />
                    <span>Jl. Kemang Raya No. 12, Jakarta</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="size-5 text-amber-400" />
                    <span>+62 812 3456 7890</span>
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  {[Phone, Mail, Globe].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="flex size-10 items-center justify-center rounded-full bg-white/10 text-stone-200 transition-colors hover:bg-amber-500 hover:text-white"
                    >
                      <Icon className="size-5" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="relative min-h-[300px]">
                <Image
                  src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=900&auto=format&fit=crop"
                  alt="Cafe interior"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 py-8 text-center text-sm text-stone-500">
        © {new Date().getFullYear()} Sinopsis Cafe. Brewed with love in Jakarta.
      </footer>
    </div>
  )
}
