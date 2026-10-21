import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  try {
    const shiftType = await prisma.shiftType.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(shiftType);
  } catch (error) {
    console.error("Error fetching shift schedules:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data shift type" },
      { status: 500 },
    );
  }
}
