import { verifyPassword } from "better-auth/crypto";

import { DEFAULT_USER_PASSWORD } from "@/lib/constants/password";
import { prisma } from "@/lib/prisma";

export async function isUsingDefaultPassword(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, providerId: "credential" },
    select: { password: true },
  });

  if (!account?.password) {
    return false;
  }

  return verifyPassword({
    hash: account.password,
    password: DEFAULT_USER_PASSWORD,
  });
}
