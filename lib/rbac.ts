import { prisma } from "./prisma";

export async function getPermissionsByRole(
  roleName: string | null | undefined,
): Promise<string[]> {
  const effectiveRole = roleName || "user";

  // Role master selalu mendapat semua permission yang ada di DB
  if (effectiveRole === "master") {
    const allPerms = await prisma.permission.findMany();
    return allPerms.map((p) => `${p.resource}:${p.action}`);
  }

  // Ambil permission yang terhubung dengan role dari tabel pivot Prisma
  const roleWithPerms = await prisma.role.findUnique({
    where: { name: effectiveRole },
    include: {
      permissions: {
        include: { permission: true },
      },
    },
  });

  if (!roleWithPerms) return [];

  return roleWithPerms.permissions.map(
    (rp) => `${rp.permission.resource}:${rp.permission.action}`,
  );
}
