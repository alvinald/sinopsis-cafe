import { auth } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  RequestStockInSchema,
  UpdateStockInSchema,
} from "@/lib/types/stock-in-types";
import { endOfYear, format, startOfYear } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

const stockInInclude = {
  createdBy: {
    select: {
      id: true,
      name: true,
    },
  },
  cancelledBy: {
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
          sku: true,
          name: true,
          unit: true,
          stock: true,
          status: true,
          isDeleted: true,
        },
      },
    },
  },
};

class StockInNotPendingError extends Error {}

function handleError(error: unknown, message: string) {
  console.error(message, error);

  if (error instanceof StockInNotPendingError) {
    return NextResponse.json(
      { error: "Hanya transaksi menunggu yang bisa diubah" },
      { status: 409 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      const modelName = (error.meta as { modelName?: string } | undefined)
        ?.modelName;

      if (modelName === "Item") {
        return NextResponse.json(
          { error: "Item tidak ditemukan" },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: "Data barang masuk tidak ditemukan" },
        { status: 404 },
      );
    }
  }

  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  try {
    const stockIns = await prisma.stockIn.findMany({
      include: stockInInclude,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(stockIns);
  } catch (error) {
    return handleError(error, "Gagal mengambil data barang masuk");
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = RequestStockInSchema.safeParse(body);

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
    const stockIn = await prisma.$transaction(async (tx) => {
      const count = await tx.stockIn.count({
        where: {
          createdAt: {
            gte: startOfYear(now),
            lte: endOfYear(now),
          },
        },
      });
      const countStockIn = `0000${count}`.slice(-4);
      const number = `SIN-${year}${month}-${countStockIn}`;

      const created = await tx.stockIn.create({
        data: {
          number,
          note,
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

      return tx.stockIn.findUniqueOrThrow({
        where: {
          id: created.id,
        },
        include: stockInInclude,
      });
    });

    return NextResponse.json(stockIn);
  } catch (error) {
    return handleError(error, "Gagal menyimpan data barang masuk");
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = UpdateStockInSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id, note, items } = parsed.data;

  try {
    const stockIn = await prisma.$transaction(async (tx) => {
      const existing = await tx.stockIn.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          items: true,
        },
      });

      if (existing.status !== "PENDING") {
        throw new StockInNotPendingError();
      }

      await tx.stockInItem.deleteMany({
        where: {
          stockInId: id,
        },
      });

      return tx.stockIn.update({
        where: {
          id,
        },
        data: {
          note,
          items: {
            create: items.map((item) => ({
              itemId: item.itemId,
              qty: item.qty,
            })),
          },
        },
        include: stockInInclude,
      });
    });

    return NextResponse.json(stockIn);
  } catch (error) {
    return handleError(error, "Gagal memperbarui data barang masuk");
  }
}
