import type { MenuItem } from "@/lib/menu-types"

// Format angka 10000 → "Rp 10.000"
function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

// Kartu menu: foto, nama, deskripsi, dan harga.
export function MenuCard({ menu }: { menu: MenuItem }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-amber-200">
      {/* Foto menu */}
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={menu.image}
          alt={menu.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Nama kategori di pojok kiri atas */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm backdrop-blur-sm">
          {menu.category}
        </span>
      </div>

      {/* Isi kartu */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-stone-900 transition-colors group-hover:text-amber-700">
          {menu.name}
        </h3>

        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-stone-500">
          {menu.description}
        </p>

        {/* Harga */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-bold text-amber-700">
            {formatPrice(menu.price)}
          </span>
        </div>
      </div>
    </div>
  )
}