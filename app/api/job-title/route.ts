import { requireChangedPassword } from "@/lib/api-password-guard";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const guard = await requireChangedPassword(request);
  if (guard) return guard;
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  try {
    const jobTitle = await prisma.jobTitle.findMany({
      include: {
        department: true,
      },
    });

    return NextResponse.json(jobTitle);
  } catch (error) {
    console.error("Error fetching job title:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data job title" },
      { status: 500 },
    );
  }
}
