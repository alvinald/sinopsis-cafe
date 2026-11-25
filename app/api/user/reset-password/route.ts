import { hashPassword } from "better-auth/crypto";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { DEFAULT_USER_PASSWORD } from "@/lib/constants/password";
import { Prisma } from "@/lib/generated/prisma/client";
import { getUserPermissions } from "@/lib/permissions.server";
import { prisma } from "@/lib/prisma";
import { ResetUserPasswordRequestSchema } from "@/lib/types/user-types";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Harap login ulang" },
      { status: 401 },
    );
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { roleId: true },
    });
    const permissions = await getUserPermissions(currentUser?.roleId);

    if (!permissions.has("USER:UPDATE")) {
      return NextResponse.json(
        { success: false, message: "Tidak memiliki akses" },
        { status: 403 },
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = ResetUserPasswordRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            parsed.error.issues[0]?.message || "ID user tidak valid",
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findFirst({
      where: { id: parsed.data.id, isDeleted: false },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    const account = await prisma.account.findFirst({
      where: { userId: user.id, providerId: "credential" },
      select: { id: true },
    });

    if (!account) {
      return NextResponse.json(
        { success: false, message: "Akun credential tidak ditemukan" },
        { status: 404 },
      );
    }

    const hashedPassword = await hashPassword(DEFAULT_USER_PASSWORD);

    await prisma.account.update({
      where: { id: account.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password berhasil direset ke password default",
    });
  } catch (error) {
    console.error("Error resetting user password:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Akun credential tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Gagal mereset password user" },
      { status: 500 },
    );
  }
}
