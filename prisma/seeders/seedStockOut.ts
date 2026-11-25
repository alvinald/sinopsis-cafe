import { PrismaClient, StockOutStatus } from "@/lib/generated/prisma/client";
import { faker } from "@faker-js/faker";

export async function seedStockOut(prisma: PrismaClient) {
  console.log("🌱 Seeding stockOuts & stockOut items...");

  // 1. Ambil semua user dan item yang sudah ada di database
  const users = await prisma.user.findMany();
  const items = await prisma.item.findMany();

  console.log(users);
  if (users.length === 0 || items.length === 0) {
    console.log("⚠️ Data user atau item kosong. Skip seeding stockOut.");
    return;
  }

  // 2. Tentukan status mutasi beserta probabilitasnya
  const statuses: StockOutStatus[] = [
    StockOutStatus.PENDING,
    StockOutStatus.SENT,
    StockOutStatus.RECEIVED,
  ];

  const stockOutsToCreate = [];
  const stockOutItemsToCreate = [];

  // Tentukan jumlah transaksi mutasi dummy yang ingin dibuat
  const totalStockOuts = 10;

  for (let i = 0; i < totalStockOuts; i++) {
    const stockOutId = crypto.randomUUID();
    const randomUser = faker.helpers.arrayElement(users);
    const randomStatus = faker.helpers.arrayElement(statuses);

    const createdAt = faker.date.recent({ days: 30 });
    let sentAt: Date | null = null;
    let receivedAt: Date | null = null;

    if (randomStatus === StockOutStatus.SENT) {
      sentAt = faker.date.between({ from: createdAt, to: new Date() });
    } else if (randomStatus === StockOutStatus.RECEIVED) {
      sentAt = faker.date.between({ from: createdAt, to: new Date() });
      receivedAt = faker.date.between({ from: sentAt, to: new Date() });
    }

    // Buat data header StockOut
    stockOutsToCreate.push({
      id: stockOutId,
      number: `SOUT-${faker.date.recent().getFullYear()}${(faker.date.recent().getMonth() + 1).toString().padStart(2, "0")}-${faker.string.numeric(4)}`,
      status: randomStatus,
      note:
        faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.7,
        }) ?? null,
      createdById: randomUser.id,
      createdAt,
      sentAt,
      receivedAt,
    });

    // 3. Pilih 1–3 item acak tanpa duplikat untuk setiap transaksi mutasi
    const selectedItems = faker.helpers.arrayElements(
      items,
      faker.number.int({ min: 1, max: Math.min(3, items.length) }),
    );

    for (const item of selectedItems) {
      stockOutItemsToCreate.push({
        id: crypto.randomUUID(),
        stockOutId: stockOutId,
        itemId: item.id,
        qty: faker.number.int({ min: 1, max: 50 }),
      });
    }
  }

  // 4. Insert data header StockOut
  const stockOutResult = await prisma.stockOut.createMany({
    data: stockOutsToCreate,
    skipDuplicates: true,
  });

  // 5. Insert data detail StockOutItem
  const stockOutItemResult = await prisma.stockOutItem.createMany({
    data: stockOutItemsToCreate,
    skipDuplicates: true,
  });

  console.log(
    `✅ Seeded: ${stockOutResult.count} stockOuts & ${stockOutItemResult.count} stockOut items`,
  );

  return {
    stockOutsCount: stockOutResult.count,
    stockOutItemsCount: stockOutItemResult.count,
  };
}
