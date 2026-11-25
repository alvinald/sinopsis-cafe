"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Coffee } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await authClient.signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });

    setLoading(false);

    if (res.error) {
      setError(res.error.message || "Terjadi kesalahan.");
    } else {
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <Card className="gap-0 rounded-3xl border-border/70 bg-card/95 py-0 shadow-xl shadow-primary/5 ring-1 ring-foreground/5 backdrop-blur">
        <CardHeader className="gap-2 px-7 pb-0 pt-8 sm:px-9 sm:pt-9">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Selamat datang kembali
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Masuk untuk mengelola operasional Sinopsis Coffee.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-7 pb-8 pt-7 sm:px-9 sm:pb-9">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel
                  htmlFor="email"
                  className="text-xs font-semibold tracking-wide text-muted-foreground"
                >
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@sinopsis.coffee"
                  className="h-11 rounded-xl border-border/80 bg-muted/40 px-3.5 text-sm shadow-sm"
                  required
                />
              </Field>
              <Field>
                <FieldLabel
                  htmlFor="password"
                  className="text-xs font-semibold tracking-wide text-muted-foreground"
                >
                  Password
                </FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="h-11 rounded-xl border-border/80 bg-muted/40 px-3.5 text-sm shadow-sm"
                  required
                />
              </Field>
              {error && (
                <p className="rounded-xl border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              <Field>
                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl text-sm font-semibold shadow-md shadow-primary/20"
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Masuk"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
