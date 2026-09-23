import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma"; // your prisma client instance
import { admin } from "better-auth/plugins"


export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || undefined,
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "sqlite", ...etc
    }),
    trustedOrigins:[
        'http://localhost:3000',
        'https://sinopsis-cafe.vercel.app',
    ],
    emailAndPassword: { 
        enabled: true, 
    }, 
    plugins: [
        admin()
    ]
});