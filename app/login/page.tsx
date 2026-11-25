import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/admin/dashboard");

  return (
    <main className="flex min-h-svh w-full overflow-hidden bg-background">
      <section
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#2a160f] px-10 py-12 text-white lg:flex xl:px-16"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 15%, rgba(251,191,36,0.22), transparent 45%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.12), transparent 40%)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full border border-amber-200/10"
        />

        <div className="relative z-10">
          <Logo variant="light" />
        </div>

        <div className="relative z-10 max-w-md space-y-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-amber-200/80">
            Sinopsis Coffee
          </p>
          <h1 className="font-heading text-4xl leading-tight font-semibold tracking-tight xl:text-5xl">
            Ruang kerja untuk setiap detail kopi.
          </h1>
          <p className="text-sm leading-relaxed text-white/65">
            Kelola stok, transaksi, dan operasional kafe dari satu tempat yang
            sama.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-xs tracking-wide text-white/50">
          <span className="h-px w-10 bg-white/30" />
          Admin Panel
        </div>
      </section>

      <section className="relative flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.10),transparent_65%)] lg:hidden"
        />
        <div className="relative w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
