import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { seedUsers } from "./seeders/seedUsers";
import { seedShiftTypes } from "./seeders/seedShiftTypes";
import { seedSchedules } from "./seeders/seedSchedule";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is not set");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  console.log("🚀 Memulai proses database seeding...\n");

  // Jalankan seeder secara modular
  await seedUsers(prisma);
  await seedShiftTypes(prisma);
  await seedSchedules(prisma);

  console.log("\n✨ Semua seeder berhasil dijalankan!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
