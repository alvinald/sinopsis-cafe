import type { Prisma } from "@/lib/generated/prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createUserSchema } from "@/lib/user-types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 })
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(users)
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil daftar user" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = createUserSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Input tidak valid" },
      { status: 400 }
    )
  }

  const { name, email, password } = parsed.data

  try {
    const created = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: request.headers,
    })
    return NextResponse.json({ data: created.user }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Gagal membuat user (email mungkin sudah terdaftar)" },
      { status: 400 }
    )
  }
}