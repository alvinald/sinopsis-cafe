"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UsersForm from "@/components/users/users-form";

export default function CreateUserPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: "password",
      }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (!res.ok) {
      const json = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setError(json?.error || "Gagal membuat user");
      setLoading(false);
      return;
    }

    router.push("/admin/users");
  }

  return (
    <UsersForm handleSubmit={handleSubmit} error={error} loading={loading} title="Tambah User" description="Isi data di bawah untuk membuat user baru" />
  );
}