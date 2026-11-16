import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateItemRequestSchema } from "@/lib/types/item-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  try {
    const items = await prisma.item.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data item" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = CreateItemRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const values = parsed.data;

  try {
    const createdItem = await prisma.item.create({
      data: {
        sku: values.sku,
        name: values.name,
        unit: values.unit,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Item berhasil dibuat",
      data: createdItem,
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data item" },
      { status: 500 },
    );
  }
}
