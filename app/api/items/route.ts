import { True } from "./../../../lib/generated/prisma/internal/prismaNamespace";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  CreateItemRequestSchema,
  DeleteItemRequestSchema,
  UpdateItemRequest,
  UpdateItemRequestSchema,
} from "@/lib/types/item-types";
import { validationError } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }
  console.log(session);

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
        status: values.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Item berhasil dibuat",
      data: createdItem,
    });
  } catch (error) {
    console.error("Error creating item:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "SKU sudah digunakan item lain" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: "Gagal membuat item" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = UpdateItemRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Data tidak valid",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const values: UpdateItemRequest = parsed.data;

  try {
    const updatedItem = await prisma.item.update({
      where: { id: values.id },
      data: {
        sku: values.sku,
        name: values.name,
        unit: values.unit,
        status: values.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Item berhasil diperbarui",
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating item:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "SKU sudah digunakan item lain" },
          { status: 409 },
        );
      }

      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Item tidak ditemukan" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { error: "Gagal memperbarui item" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = DeleteItemRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(validationError(parsed.error), {
      status: 400,
    });
  }

  const values = parsed.data;

  try {
    const item = await prisma.item.update({
      where: { id: values.id },
      data: { isDeleted: true },
    });

    return NextResponse.json({
      success: true,
      message: "Item berhasil dihapus",
      data: item,
    });
  } catch (error) {
    console.error("Error deleting item:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Item sedang digunakan dan tidak dapat dihapus" },
          { status: 409 },
        );
      }

      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Item tidak ditemukan" },
          { status: 404 },
        );
      }
    }

    return NextResponse.json(
      { error: "Gagal menghapus item" },
      { status: 500 },
    );
  }
}
