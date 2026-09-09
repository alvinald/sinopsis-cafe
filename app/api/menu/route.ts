import { NextResponse } from "next/server"
import type { MenuItem } from "@/lib/menu-types"

const FALLBACK_IMAGE = "/images/logo_black.jpg"

interface ExternalMenuItem {
  id: number
  name: string
  image?: { url: string | null } | null
  description?: string | null
  is_deleted?: boolean
  category?: { name: string }
  item_variants?: { price?: number }[]
}

interface ExternalMenuEnvelope {
  data?: { items?: ExternalMenuItem[] }
}

function buildUrl(): string {
  const base = process.env.MOKA_BASE_URL ?? ""
  const outlet = process.env.MOKA_OUTLET_ID ?? ""
  const params = process.env.MOKA_MENU_PARAMS ?? ""
  const baseUrl = `${base}/v1/outlets/${outlet}/items`
  return params ? `${baseUrl}?${params}` : baseUrl
}

export async function GET() {
  const token = process.env.MOKA_TOKEN
  if (!token) {
    return NextResponse.json(
      { error: "MOKA_TOKEN tidak dikonfigurasi" },
      { status: 500 }
    )
  }

  const res = await fetch(buildUrl(), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    return NextResponse.json(
      { error: `Menu API failed: ${res.status} ${res.statusText}` },
      { status: 502 }
    )
  }

  const json = (await res.json()) as ExternalMenuEnvelope
  const rawItems = json?.data?.items ?? []

  const items: MenuItem[] = rawItems.map((raw) => {
    // Harga tertinggi dari semua varian (mis. Regular 20K, Large 30K → 30K).
    const prices = (raw.item_variants ?? []).map((v) => v.price ?? 0)
    const price = prices.length > 0 ? Math.max(...prices) : 0

    return {
      id: raw.id,
      name: raw.name,
      category: raw.category?.name ?? "Coffee",
      description: raw.description ?? "Nikmati hidangan spesial dari Sinopsis Cafe.",
      price,
      image: raw.image?.url ?? FALLBACK_IMAGE,
      available: !raw.is_deleted,
    }
  })

  return NextResponse.json(items)
}
