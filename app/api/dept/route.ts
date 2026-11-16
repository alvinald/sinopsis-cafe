import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  try {
    const dept = await prisma.department.findMany();

    return NextResponse.json(dept);
  } catch (error) {
    console.error("Error fetching dept:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data dept" },
      { status: 500 },
    );
  }
}
