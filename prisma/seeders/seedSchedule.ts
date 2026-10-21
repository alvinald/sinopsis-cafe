import { PrismaClient } from "@/lib/generated/prisma/client";
import { faker } from "@faker-js/faker";

export async function seedSchedules(prisma: PrismaClient) {
  console.log("🌱 Seeding shift schedules...");

  // 1. Ambil semua user dan shift type yang sudah ada di database
  const users = await prisma.user.findMany();
  const shiftTypes = await prisma.shiftType.findMany();

  if (users.length === 0 || shiftTypes.length === 0) {
    console.log("⚠️ Data user atau shift type kosong. Skip seeding schedule.");
    return;
  }

  // Tentukan rentang tanggal (misal: 1 minggu dari tanggal hari ini / 12 Okt 2026)
  const tanggalList = [
    new Date("2026-10-12"),
    new Date("2026-10-13"),
    new Date("2026-10-14"),
    new Date("2026-10-15"),
    new Date("2026-10-16"),
  ];

  const schedulesToCreate = [];

  // 2. Loop setiap user untuk dibuatkan jadwalnya
  for (const user of users) {
    // Lewatkan admin jika tidak ingin dijadwalkan shift reguler (opsional)
    if (!user.isScheduled) continue;

    for (const tanggal of tanggalList) {
      // Pilih shift type secara acak, atau berikan null (jika shiftTypeId bersifat optional)
      const randomShift = faker.helpers.arrayElement([...shiftTypes]);

      schedulesToCreate.push({
        id: crypto.randomUUID(),
        userId: user.id,
        shiftTypeId: randomShift?.id,
        date: tanggal,
      });
    }
  }

  // 3. Insert ke database menggunakan createMany dengan skipDuplicates
  // skipDuplicates sangat penting di sini karena ada aturan @@unique([userId, date])
  const result = await prisma.shiftSchedule.createMany({
    data: schedulesToCreate,
    skipDuplicates: true,
  });

  console.log(`✅ Seeded: ${result.count} shift schedules`);
  return result;
}
