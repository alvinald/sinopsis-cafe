import { UpdateRolePermissionSchema } from "./../../../../lib/types/role-types";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session) {
    return NextResponse.json({ error: "Harap login ulang" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  const parsed = UpdateRolePermissionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Data tidak valid", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { roleId, permissionsIds } = parsed.data;

  const insertData = permissionsIds.map((item) => ({
    roleId: roleId,
    permissionId: item,
  }));

  try {
    const updatePermissions = await prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({
        where: {
          roleId: roleId,
        },
      });

      // 2. Update moving dan upsert item
      return await tx.rolePermission.createMany({
        data: insertData,
        skipDuplicates: true,
      });
    });

    return NextResponse.json(updatePermissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data permissions" },
      { status: 500 },
    );
  }
}
