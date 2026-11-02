import { PrismaClient } from "@/lib/generated/prisma/client";
import { faker } from "@faker-js/faker";

export async function seedItems(prisma: PrismaClient) {
  console.log("🌱 Seeding items...");

  // Daftar satuan barang yang umum digunakan
  const units = ["pcs", "box", "kg", "pack", "roll", "unit"];

  const itemsToCreate = [];

  // Jumlah item dummy yang ingin dibuat
  const totalItems = 15;

  for (let i = 0; i < totalItems; i++) {
    // Generasi SKU unik, contoh: ITEM-94821
    const sku = `ITEM-${faker.string.numeric(5)}`;

    itemsToCreate.push({
      id: crypto.randomUUID(),
      sku: sku,
      name: faker.commerce.productName(),
      unit: faker.helpers.arrayElement(units),
      stock: faker.number.int({ min: 10, max: 500 }),
      isActive: faker.datatype.boolean({ probability: 0.9 }), // 90% aktif
    });
  }

  // Insert ke database menggunakan createMany dengan skipDuplicates (aman untuk @@unique([sku]))
  const result = await prisma.item.createMany({
    data: itemsToCreate,
    skipDuplicates: true,
  });

  console.log(`✅ Seeded: ${result.count} items`);
  return result;
}
