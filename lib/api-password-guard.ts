import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

export async function requireChangedPassword(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Harap login ulang" },
      { status: 401 },
    );
  }

  if (session.mustChangePassword) {
    return NextResponse.json(
      {
        success: false,
        message: "Ubah password default terlebih dahulu",
      },
      { status: 403 },
    );
  }

  return null;
}
