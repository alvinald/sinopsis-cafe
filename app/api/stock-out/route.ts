import { requireChangedPassword } from "@/lib/api-password-guard";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  RequestStockOutSchema,
  UpdateStockOutSchema,
} from "@/lib/types/stock-out-types";
import { endOfYear, format, startOfYear } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const guard = await requireChangedPassword(request);
  if (guard) return guard;
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  try {
    // 1 baris saja untuk ambil semua permission user

    const stockOut = await prisma.stockOut.findMany({
      include: {
        cancelledBy: {
          select: {
            id: true,
            name: true,
          },
        },
        sentBy: {
          select: {
            id: true,
            name: true,
          },
        },
        receivedBy: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                unit: true,
                stock: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    return NextResponse.json(stockOut);
  } catch (error) {
    console.error("Error processing stock-out:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data stock-out" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const guard = await requireChangedPassword(request);
  if (guard) return guard;
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  const parsed = RequestStockOutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { note, items } = parsed.data;

  const now = new Date();
  const year = format(now, "yyyy");
  const month = format(now, "MM");

  try {
    const count = await prisma.stockOut.count({
      where: {
        createdAt: {
          gte: startOfYear(now),
          lte: endOfYear(now),
        },
      },
    });

    const number = `0000${count}`.slice(-4);
    console.log(number);
    const stockOutNumber = `SOUT-${year}${month}-${number}`;
    const updatedSchedule = await prisma.stockOut.create({
      data: {
        number: stockOutNumber,
        note: note,
        createdAt: now,
        createdById: session.user.id,
        items: {
          create: items.map((item) => ({
            itemId: item.itemId,
            qty: item.qty,
          })),
        },
      },
    });

    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error("Error fetching stockOut request:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan data stock-out" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const guard = await requireChangedPassword(request);
  if (guard) return guard;
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  const parsed = UpdateStockOutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id, note, items } = parsed.data;

  try {
    const updatedStockOut = await prisma.$transaction(async (tx) => {
      // 1. Hapus item yang tidak ada
      await tx.stockOutItem.deleteMany({
        where: {
          stockOutId: id,
        },
      });

      // 2. Update stockOut dan upsert item
      return await tx.stockOut.update({
        where: {
          id: id,
        },
        data: {
          note: note,
          items: {
            create: items.map((item) => ({
              itemId: item.itemId,
              qty: item.qty,
            })),
          },
        },
      });
    });

    return NextResponse.json(updatedStockOut);
  } catch (error) {
    console.error("Error processing stock-out:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data schedules" },
      { status: 500 },
    );
  }
}
