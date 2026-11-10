import {
  RoleWithPermissions,
  roleWithPermissionsSchema,
} from "./../../../lib/types/role-types";
import { False } from "./../../../lib/generated/prisma/internal/prismaNamespace";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRoleSchema, deleteRoleSchema } from "@/lib/types/role-types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  try {
    const rawRoles = await prisma.role.findMany({
      include: {
        permissions: {
          include: {
            permission: {
              select: {
                id: true,
                resource: true,
                action: true,
              },
            },
          },
        },
      },
      where: {
        isDeleted: false,
      },
    });

    const roles: RoleWithPermissions[] = rawRoles.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      isDeleted: item.isDeleted, // Sesuaikan jika field ini ada di rawRoles
      permissions: item.permissions.map((p) => ({
        id: p.permission.id,
        resource: p.permission.resource,
        action: p.permission.action,
      })),
    }));

    return NextResponse.json(roles);
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

  const parsed = createRoleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { name, description } = parsed.data;

  try {
    const createdRole = await prisma.role.create({
      data: {
        name: name,
        description: description,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Role berhasil dibuat",
      data: createdRole,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Gagal membuat role baru" },
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

  const parsed = deleteRoleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { id } = parsed.data;

  try {
    const deletedRole = await prisma.role.update({
      where: {
        id: id,
      },
      data: {
        isDeleted: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Role berhasil dihapus",
      data: deletedRole,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { error: "Gagal membuat role baru" },
      { status: 500 },
    );
  }
}
