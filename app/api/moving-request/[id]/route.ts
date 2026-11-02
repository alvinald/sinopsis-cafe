import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateMovingStatusSchema } from "@/lib/types/moving-types";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: request.headers });
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  console.log("Update status:", body.status);

  const parsed = UpdateMovingStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { status } = parsed.data;
  try {
    const updateStatus = await prisma.moving.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    console.log("Update status:", updateStatus);
    return NextResponse.json(updateStatus);
  } catch (error) {
    console.error("Error fetching shift schedules:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data schedules" },
      { status: 500 },
    );
  }
}
