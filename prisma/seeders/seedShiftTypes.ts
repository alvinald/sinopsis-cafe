import { PrismaClient } from "@/lib/generated/prisma/internal/class";

export async function seedShiftTypes(prisma: PrismaClient) {
  console.log("🌱 Seeding shift types...");

  const shifttypes = [
    {
      name: "OFF",
      color: "bg-gray-100 text-gray-500 border-gray-200",
    },
    {
      name: "Siang",
      startTime: "12:00",
      endTime: "20:00",
      color: "bg-blue-100 text-blue-800 border-blue-300",
    },
    {
      name: "Malam",
      startTime: "12:00",
      endTime: "20:00",
      color: "bg-green-100 text-green-800 border-green-300",
    },
    {
      name: "Long Shift",
      startTime: "12:00",
      endTime: "20:00",
      color: "bg-purple-100 text-purple-800 border-purple-300",
    },
  ];

  const result = await prisma.shiftType.createMany({
    data: shifttypes,
    skipDuplicates: true,
  });

  console.log(`✅ Seeded: ${result.count} shift types`);
  return result;
}
