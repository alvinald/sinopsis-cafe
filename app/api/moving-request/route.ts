import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  RequestMovingSchema,
  UpdateMovingSchema,
} from "@/lib/types/moving-types";
import { endOfYear, format, startOfYear } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "path";
import { start } from "repl";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  try {
    const moving = await prisma.moving.findMany({
      include: {
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
      orderBy: { id: "asc" },
    });
    return NextResponse.json(moving);
  } catch (error) {
    console.error("Error fetching shift schedules:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data shift type" },
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

  const parsed = RequestMovingSchema.safeParse(body);

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
    const count = await prisma.moving.count({
      where: {
        createdAt: {
          gte: startOfYear(now),
          lte: endOfYear(now),
        },
      },
    });
    const movingNumber = `MOV-${year}${month}-${count}`;
    const updatedSchedule = await prisma.moving.create({
      data: {
        number: movingNumber,
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

    console.log(parsed.data);
    return NextResponse.json(updatedSchedule);
  } catch (error) {
    console.error("Error fetching shift schedules:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data schedules" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  const parsed = UpdateMovingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id, note, items } = parsed.data;
  console.log(parsed.data);
  try {
    const updatedMovingRequest = await prisma.$transaction(async (tx) => {
      // 1. Hapus item yang tidak ada
      await tx.movingItem.deleteMany({
        where: {
          movingId: id,
        },
      });

      // 2. Update moving dan upsert item
      return await tx.moving.update({
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

    return NextResponse.json(updatedMovingRequest);
  } catch (error) {
    console.error("Error fetching shift schedules:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data schedules" },
      { status: 500 },
    );
  }
}
