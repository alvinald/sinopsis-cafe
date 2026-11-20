import { JobTitle } from "./types/job-title-types";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma"; // your prisma client instance
import { customSession } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || undefined,
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "sqlite", ...etc
  }),

  trustedOrigins: [
    "http://localhost:3000",
    "https://sinopsis-cafe.vercel.app",
    "https://*.vercel.app",
  ],
  emailAndPassword: {
    enabled: true,
    // disableSignUp: true,
  },
  advanced: {
    // Mematikan pemeriksaan CSRF/Origin saat testing di mode development
    disableCSRFCheck: process.env.NODE_ENV === "development",
    database: {
      generateId: () => crypto.randomUUID(), // Menghasilkan UUID v4 standar
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      // Query permissions user dari tabel RBAC Anda di sini
      const dataUser = await getUserPermissions(user.id);

      const permissions: string[] =
        dataUser?.role?.permissions?.map(
          (rp) => `${rp.permission.resource}:${rp.permission.action}`,
        ) ?? [];

      const jobTitle = dataUser?.jobTitle?.name ?? undefined;
      const departmentId = dataUser?.jobTitle?.department?.id ?? undefined;
      const department = dataUser?.jobTitle?.department?.name ?? undefined;

      return {
        user: {
          ...user,
          jobTitle,
          departmentId,
          department,
        },
        session,
        permissions,
      };
    }),
  ],
  user: {
    additionalFields: {
      roleId: {
        type: "string",
        required: false,
        input: false, // Supaya user tidak bisa asal set role sendiri saat register
      },
      jobTitleId: {
        type: "string",
        required: false,
        input: true,
      },
      jobTitle: {
        type: "string",
        required: false,
        input: false,
      },
      department: {
        type: "string",
        required: false,
        input: false,
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

async function getUserPermissions(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      jobTitle: {
        select: {
          name: true,
          department: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      role: {
        select: {
          permissions: {
            select: {
              permission: {
                select: {
                  resource: true, // Page
                  action: true, // Fungsi
                },
              },
            },
          },
        },
      },
    },
  });

  return user;
}
