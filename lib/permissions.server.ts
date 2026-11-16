import { prisma } from "./prisma";

export async function getUserPermissions(
  roleId: string | null | undefined,
): Promise<Set<string>> {
  if (!roleId) return new Set();

  const roleData = await prisma.role.findUnique({
    where: { id: roleId },
    include: {
      permissions: {
        include: { permission: true },
      },
    },
  });

  const list =
    roleData?.permissions.map(
      (rp) => `${rp.permission.resource}:${rp.permission.action}`,
    ) ?? [];

  return new Set(list);
}
