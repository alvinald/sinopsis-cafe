import { PrismaClient } from "@/lib/generated/prisma/client";

export async function seedPermissions(prisma: PrismaClient) {
  console.log("🌱 Seeding items...");

  const permissionCreate = [];

  permissionCreate.push({
    resource: "ROLE",
    action: "VIEW",
  });

  permissionCreate.push({
    resource: "ROLE",
    action: "CREATE",
  });

  permissionCreate.push({
    resource: "ROLE",
    action: "UPDATE",
  });

  permissionCreate.push({
    resource: "ROLE",
    action: "DELETE",
  });

  permissionCreate.push({
    resource: "USER",
    action: "VIEW",
  });

  permissionCreate.push({
    resource: "USER",
    action: "CREATE",
  });

  permissionCreate.push({
    resource: "USER",
    action: "UPDATE",
  });

  permissionCreate.push({
    resource: "USER",
    action: "DELETE",
  });

  // Insert ke database menggunakan createMany dengan skipDuplicates (aman untuk @@unique([sku]))
  const result = await prisma.permission.createMany({
    data: permissionCreate,
    skipDuplicates: true,
  });

  console.log(`✅ Seeded: ${result.count} items`);
  return result;
}
