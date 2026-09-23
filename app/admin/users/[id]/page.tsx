"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UsersForm from "@/components/users/users-form";
import { User } from "@/lib/user-types";
import { toast } from "sonner";

export default function EditUserPage() {
    const params = useParams()
    const id = params.id  

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        
    fetch(`/api/users/${id}`)
        .then(async (res) => {
            if (res.status === 401) {
                router.push("/login")
                return
            }
            if (!res.ok) throw new Error("Gagal memuat user")
            setUser(await res.json())
            })
        .catch(() => {})
        .finally(() => setLoading(false))
    }, [router, id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        role: formData.get("role"),
      }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    if (!res.ok) {
  // 1. Parse JSON response dari server
      const errorData = await res.json().catch(() => null);

      // 2. Ambil pesan spesifik (Better Auth biasa pakai .message, Zod biasa pakai .error)
      const errorMessage = 
        errorData?.message || 
        errorData?.error || 
        "Gagal memperbarui user";

      toast.error(errorMessage);
      setLoading(false);
      return;
    }

    router.push("/admin/users");
  }

  return (
    <UsersForm handleSubmit={handleSubmit} error={error} loading={loading} title="Ubah User" description="Isi data di bawah untuk ubah user" user={user}/>
  );
}