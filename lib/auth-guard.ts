// lib/auth-guard.ts
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Memoized per-request: dipanggil berkali-kali di layout & page
 * hanya akan mengeksekusi getSession 1 kali saja.
 */
export const getCurrentSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

/**
 * Guard untuk Server Component (page.tsx)
 * Cek login + izin akses halaman (resource:view)
 */
export async function protectPage(resource: string) {
  const data = await getCurrentSession();

  if (!data) {
    redirect("/login");
  }

  if (!canAccessPage(data.session, resource)) {
    redirect("/403");
  }

  return data;
}

/**
 * Guard untuk Server Actions ("use server") & Route Handlers (route.ts)
 * Cek login + izin fungsi spesifik (resource:action)
 */
export async function protectAction(resource: string, action: string) {
  const data = await getCurrentSession();

  if (!data) {
    throw new Error("Unauthorized: Sesi berakhir, silakan login ulang.");
  }

  if (!can(data.session, resource, action)) {
    throw new Error(`Forbidden: Tidak memiliki izin ${resource}:${action}`);
  }

  return data;
}
