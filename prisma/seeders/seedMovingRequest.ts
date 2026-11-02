import { PrismaClient, MovingStatus } from "@/lib/generated/prisma/client";
import { faker } from "@faker-js/faker";

export async function seedMoving(prisma: PrismaClient) {
  console.log("🌱 Seeding movings & moving items...");

  // 1. Ambil semua user dan item yang sudah ada di database
  const users = await prisma.user.findMany();
  const items = await prisma.item.findMany();

  console.log(users);
  if (users.length === 0 || items.length === 0) {
    console.log("⚠️ Data user atau item kosong. Skip seeding moving.");
    return;
  }

  // 2. Tentukan status mutasi beserta probabilitasnya
  const statuses: MovingStatus[] = [
    MovingStatus.PENDING,
    MovingStatus.SENT,
    MovingStatus.RECEIVED,
  ];

  const movingsToCreate = [];
  const movingItemsToCreate = [];

  // Tentukan jumlah transaksi mutasi dummy yang ingin dibuat
  const totalMovings = 10;

  for (let i = 0; i < totalMovings; i++) {
    const movingId = crypto.randomUUID();
    const randomUser = faker.helpers.arrayElement(users);
    const randomStatus = faker.helpers.arrayElement(statuses);

    const createdAt = faker.date.recent({ days: 30 });
    let sentAt: Date | null = null;
    let receivedAt: Date | null = null;

    if (randomStatus === MovingStatus.SENT) {
      sentAt = faker.date.between({ from: createdAt, to: new Date() });
    } else if (randomStatus === MovingStatus.RECEIVED) {
      sentAt = faker.date.between({ from: createdAt, to: new Date() });
      receivedAt = faker.date.between({ from: sentAt, to: new Date() });
    }

    // Buat data header Moving
    movingsToCreate.push({
      id: movingId,
      number: `MOV-${faker.date.recent().getFullYear()}${(faker.date.recent().getMonth() + 1).toString().padStart(2, "0")}-${faker.string.numeric(4)}`,
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
      movingItemsToCreate.push({
        id: crypto.randomUUID(),
        movingId: movingId,
        itemId: item.id,
        qty: faker.number.int({ min: 1, max: 50 }),
      });
    }
  }

  // 4. Insert data header Moving
  const movingResult = await prisma.moving.createMany({
    data: movingsToCreate,
    skipDuplicates: true,
  });

  // 5. Insert data detail MovingItem
  const movingItemResult = await prisma.movingItem.createMany({
    data: movingItemsToCreate,
    skipDuplicates: true,
  });

  console.log(
    `✅ Seeded: ${movingResult.count} movings & ${movingItemResult.count} moving items`,
  );

  return {
    movingsCount: movingResult.count,
    movingItemsCount: movingItemResult.count,
  };
}
