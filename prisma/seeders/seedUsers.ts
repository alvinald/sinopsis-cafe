import { faker } from "@faker-js/faker";
import { PrismaClient, Role, UserStatus } from "@/lib/generated/prisma/client";

export async function seedUsers(prisma: PrismaClient) {
  console.log("🌱 Seeding users...");

  const dummyUsers = Array.from({ length: 10 }, (_, i) => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const status = faker.helpers.arrayElement([
      UserStatus.ACTIVE,
      UserStatus.ACTIVE,
      UserStatus.ACTIVE,
      UserStatus.ACTIVE,
      UserStatus.INACTIVE,
    ]);

    const role = faker.helpers.arrayElement([
      Role.user,
      Role.user,
      Role.user,
      Role.user,
      Role.admin,
    ]);

    const isResigned = status === UserStatus.INACTIVE;

    return {
      id: crypto.randomUUID(),
      name: faker.person.fullName({ firstName, lastName }),
      email: faker.internet
        .email({ firstName, lastName })
        .replace("@", `${i}@`),
      image: faker.image.avatar(),
      role,
      department: faker.commerce.department(),
      jobTitle: faker.person.jobTitle(),
      status,
      isScheduled: faker.datatype.boolean(),
      resignedDate: isResigned ? faker.date.recent({ days: 180 }) : null,
      resignReason: isResigned
        ? faker.lorem.sentence({ min: 3, max: 8 })
        : null,
      createdAt: faker.date.past({ years: 1 }),
    };
  });

  const allUsers = [...dummyUsers];

  const result = await prisma.user.createMany({
    data: allUsers,
    skipDuplicates: true,
  });

  console.log(
    `✅ Seeded: ${result.count} users (Termasuk Admin: admin@example.com)`,
  );
  return result;
}
