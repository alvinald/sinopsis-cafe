import { hashPassword, verifyPassword } from "better-auth/crypto";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChangePasswordRequestSchema } from "@/lib/types/change-password-types";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Harap login ulang" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = ChangePasswordRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message || "Data tidak valid",
      },
      { status: 400 },
    );
  }

  try {
    const account = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "credential",
      },
      select: { id: true, password: true },
    });

    if (!account?.password) {
      return NextResponse.json(
        { success: false, message: "Akun credential tidak ditemukan" },
        { status: 404 },
      );
    }

    const isValid = await verifyPassword({
      hash: account.password,
      password: parsed.data.currentPassword,
    });

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Password saat ini salah" },
        { status: 403 },
      );
    }

    const hashedPassword = await hashPassword(parsed.data.newPassword);

    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message: "Password berhasil diubah",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengubah password" },
      { status: 500 },
    );
  }
}
