import { requireChangedPassword } from "@/lib/api-password-guard";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateStockOutStatusSchema } from "@/lib/types/stock-out-types";
import { NextRequest, NextResponse } from "next/server";

const NOT_FOUND = "STOCK_OUT_TIDAK_DITEMUKAN";
const INSUFFICIENT_STOCK = "STOK_TIDAK_CUKUP";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireChangedPassword(request);
  if (guard) return guard;
  const session = await auth.api.getSession({ headers: request.headers });
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = UpdateStockOutStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { status } = parsed.data;
  const now = new Date();

  try {
    const updatedStatus = await prisma.$transaction(async (tx) => {
      const current = await tx.stockOut.findUnique({
        where: { id },
        include: {
          items: {
            select: {
              itemId: true,
              qty: true,
            },
          },
        },
      });

      if (!current) {
        throw new Error(NOT_FOUND);
      }

      if (status === "RECEIVED" && current.status !== "RECEIVED") {
        for (const line of current.items) {
          const item = await tx.item.findUnique({
            where: { id: line.itemId },
            select: { stock: true },
          });

          if (!item || item.stock < line.qty) {
            throw new Error(INSUFFICIENT_STOCK);
          }

          await tx.item.update({
            where: { id: line.itemId },
            data: {
              stock: {
                decrement: line.qty,
              },
            },
          });
        }
      }

      return tx.stockOut.update({
        where: { id },
        data: {
          status,
          ...(status === "SENT" && {
            sentById: session.user.id,
            sentAt: now,
          }),
          ...(status === "RECEIVED" && {
            receivedById: session.user.id,
            receivedAt: now,
          }),
          ...(status === "CANCELLED" && {
            cancelledById: session.user.id,
          }),
        },
      });
    });

    return NextResponse.json(updatedStatus);
  } catch (error) {
    if (error instanceof Error && error.message === NOT_FOUND) {
      return NextResponse.json(
        {
          error: "Stock out tidak ditemukan",
          message: "Stock out tidak ditemukan",
        },
        { status: 404 },
      );
    }

    if (error instanceof Error && error.message === INSUFFICIENT_STOCK) {
      return NextResponse.json(
        {
          error: "Stok tidak cukup",
          message: "Stok tidak cukup untuk menerima stock-out ini",
        },
        { status: 409 },
      );
    }

    console.error("Error updating stock-out status:", error);
    return NextResponse.json(
      {
        error: "Gagal memperbarui status stock-out",
        message: "Gagal memperbarui status stock-out",
      },
      { status: 500 },
    );
  }
}
