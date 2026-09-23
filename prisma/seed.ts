import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { faker } from "@faker-js/faker"
import { PrismaClient } from "@/lib/generated/prisma/client"

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error("DATABASE_URL is not set")

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) })

async function main() {
  const users = Array.from({ length: 50 }, (_, i) => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    return {
      id: crypto.randomUUID(),
      name: faker.person.fullName({ firstName, lastName }),
      // dijamin unik: sisipkan index sebelum '@' (faker bisa menghasilkan email duplikat)
      email: faker.internet.email({ firstName, lastName }).replace("@", `${i}@`),
      createdAt: faker.date.past({ years: 1 }), // tersebar dalam 1 tahun → sorting createdAt realistis
    }
  })

  const result = await prisma.user.createMany({ data: users, skipDuplicates: true })
  console.log(`Seeded: ${result.count} users`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())