import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma"; // your prisma client instance

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || undefined,
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite", ...etc
  }),
  trustedOrigins: ["http://localhost:3000", "https://sinopsis-cafe.vercel.app"],
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    // Mematikan pemeriksaan CSRF/Origin saat testing di mode development
    disableCSRFCheck: process.env.NODE_ENV === "development",
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user", // Sesuai @default(user) di Prisma
        input: false, // Supaya user tidak bisa asal set role sendiri saat register
      },
      department: {
        type: "string",
        required: false,
        input: true, // Boleh diisi dari form jika diperlukan
      },
      jobTitle: {
        type: "string",
        required: false,
        input: true,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE", // Sesuai @default(ACTIVE) di Prisma
        input: false,
      },
      isScheduled: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      resignedDate: {
        type: "date",
        required: false,
        input: false,
      },
      resignReason: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
});
