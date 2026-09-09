import { NextResponse } from "next/server"
import type { MenuItem } from "@/lib/types/menu"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop"

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

  const items: MenuItem[] = rawItems.map((raw) => ({
    id: raw.id,
    name: raw.name,
    category: (raw.category?.name ?? "Coffee") as MenuItem["category"],
    description: raw.description ?? "Nikmati hidangan spesial dari Sinopsis Cafe.",
    price: raw.item_variants?.[0]?.price ?? 0,
    image: raw.image?.url ?? FALLBACK_IMAGE,
    available: !raw.is_deleted,
    tags: [],
  }))

  return NextResponse.json(items)
}
