"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border bg-card p-6 text-center shadow-xs sm:p-8">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldAlert className="size-6" />
        </div>

        <p className="font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase">
          403 Forbidden
        </p>

        <h1 className="mt-1 text-xl font-semibold tracking-tight">
          Akses Ditolak
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Akun Anda tidak memiliki izin untuk mengakses halaman atau fitur ini.
          Hubungi administrator jika Anda merasa ini adalah kekeliruan.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft className="size-4" />
            Kembali
          </button>

          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="size-4" />
            Ke Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
