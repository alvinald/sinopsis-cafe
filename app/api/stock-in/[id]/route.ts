import { requireChangedPassword } from "@/lib/api-password-guard";
import { auth } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { UpdateStockInStatusSchema } from "@/lib/types/stock-in-types";
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
      { error: "Transaksi tidak menunggu penerimaan" },
      { status: 409 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Data barang masuk tidak ditemukan" },
        { status: 404 },
      );
    }
  }

  return NextResponse.json({ error: message }, { status: 500 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireChangedPassword(request);
  if (guard) return guard;
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const stockIn = await prisma.stockIn.findUnique({
      where: {
        id,
      },
      include: stockInInclude,
    });

    if (!stockIn) {
      return NextResponse.json(
        { error: "Data barang masuk tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(stockIn);
  } catch (error) {
    return handleError(error, "Gagal mengambil data barang masuk");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireChangedPassword(request);
  if (guard) return guard;
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = UpdateStockInStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { status } = parsed.data;
  const now = new Date();

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

      if (status === "RECEIVED") {
        for (const item of existing.items) {
          await tx.item.update({
            where: {
              id: item.itemId,
            },
            data: {
              stock: {
                increment: item.qty,
              },
            },
          });
        }
      }

      return tx.stockIn.update({
        where: {
          id,
        },
        data:
          status === "RECEIVED"
            ? {
                status,
                receivedAt: now,
              }
            : {
                status,
                cancelledAt: now,
                cancelledById: session.user.id,
              },
        include: stockInInclude,
      });
    });

    return NextResponse.json(stockIn);
  } catch (error) {
    return handleError(error, "Gagal memperbarui status barang masuk");
  }
}
