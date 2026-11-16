import { LevelJob } from "./../../lib/generated/prisma/enums";
import { PrismaClient } from "@/lib/generated/prisma/internal/class";

export async function seedJobTitle(prisma: PrismaClient) {
  console.log("🌱 Seeding shift types...");

  const JobTitle = [
    {
      name: "Owner",
      level: "OWNER" as LevelJob,
    },
    {
      name: "Direktur",
      level: "DIREKTUR" as LevelJob,
    },
    {
      name: "Manager Outlet",
      level: "MANAGER" as LevelJob,
    },
    {
      name: "Barista Head",
      level: "HEAD" as LevelJob,
      departmentId: "5faa3051-77cd-4ab5-9d59-441b95da1e64",
    },
    {
      name: "Waiters Head",
      level: "HEAD",
      departmentId: "58181aa2-8840-45bf-bfba-4302a4c90679",
    },
    {
      name: "Chef Head",
      level: "HEAD" as LevelJob,
      departmentId: "376b09ed-9d14-4be7-9d45-5fcfb8b752a1",
    },
    {
      name: "Barista",
      level: "STAFF" as LevelJob,
      departmentId: "5faa3051-77cd-4ab5-9d59-441b95da1e64",
    },
    {
      name: "Chef",
      level: "STAFF" as LevelJob,
      departmentId: "376b09ed-9d14-4be7-9d45-5fcfb8b752a1",
    },
    {
      name: "Waiters",
      level: "STAFF" as LevelJob,
      departmentId: "58181aa2-8840-45bf-bfba-4302a4c90679",
    },
  ] as any;

  const result = await prisma.jobTitle.createMany({
    data: JobTitle,
    skipDuplicates: true,
  });

  console.log(`✅ Seeded: ${result.count} shift types`);
  return result;
}
