import { id } from "date-fns/locale";
import {
  CreateUserRequestSchema,
  UpdateUserRequestSchema,
  UsersList,
} from "./../../../lib/types/user-types";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "better-auth/crypto";
import { Prisma } from "@/lib/generated/prisma/client";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  try {
    const rawUser = await prisma.user.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        role: true, // Role dibiarkan 'true' (mengambil semua kolom)
        jobTitle: {
          select: {
            id: true,
            name: true,
            level: true,
            // Ambil relasi department menggunakan 'select' di dalam select jobTitle
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    const users: UsersList[] = rawUser.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      status: item.status,
      isDeleted: item.isDeleted,
      isScheduled: item.isScheduled,
      resignedDate: item.resignedDate,
      resignReason: item.resignReason,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      jobTitle: item.jobTitle
        ? {
            id: item.jobTitle.id,
            name: item.jobTitle.name,
            level: item.jobTitle.level,
            departement: item.jobTitle.department,
          }
        : null,
      department: item.jobTitle?.department ?? null,
      role: item.role,
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data role" },
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
  const parsed = CreateUserRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message || "Data tidak valid",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }
  const values = parsed.data;

  try {
    const hashedPassword = await hashPassword("Password");
    const userId = crypto.randomUUID();
    const now = new Date();

    console.log(userId);

    // 3. Simpan ke tabel User dan Account sekaligus
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          id: userId,
          name: values.name,
          email: values.email,
          emailVerified: true,
          createdAt: now,
          updatedAt: now,
          jobTitleId: values.jobTitle,
          roleId: values.role,
          status: values.status,
        },
      });

      await tx.account.create({
        data: {
          id: crypto.randomUUID(),
          userId: user.id,
          issuer: "local:credential",
          accountId: user.id,
          providerId: "credential",
          password: hashedPassword,
          createdAt: now,
          updatedAt: now,
        },
      });

      return user;
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil dibuat",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "Email sudah terdaftar" },
          { status: 409 },
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { success: false, message: "Jabatan atau Role tidak ditemukan" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Gagal membuat user baru",
      },
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

  console.log(body);

  const parsed = UpdateUserRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.issues[0]?.message || "Data tidak valid",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }
  const values = parsed.data;

  try {
    const now = new Date();

    // 3. Simpan ke tabel User dan Account sekaligus
    const userUpdated = await prisma.user.update({
      where: {
        id: values.id,
      },
      data: {
        name: values.name,
        email: values.email,
        emailVerified: true,
        updatedAt: now,
        jobTitleId: values.jobTitle,
        roleId: values.role,
        status: values.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil diubah",
      data: userUpdated,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "Email sudah terdaftar" },
          { status: 409 },
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { success: false, message: "Jabatan atau Role tidak ditemukan" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Gagal membuat user baru",
      },
      { status: 500 },
    );
  }
}
