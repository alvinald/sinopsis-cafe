import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import Link from "next/link";
import { RoleOption, roles, User } from "@/lib/user-types";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "../ui/combobox";
import { useState } from "react";




export default function UsersForm({ 
    handleSubmit, 
    error, 
    loading,
    title,
    description,
    user
}: { 
    handleSubmit: React.FormEventHandler<HTMLFormElement>; 
    error: string | null; 
    loading: boolean,
    title?: string,
    description?: string,
    user?: User | null
}) {

  // 1. Cari objek role awal dari prop `user`
  const initialRoleObj = roles.find((r) => r.value === user?.role) ?? null;

  // 2. Simpan di state untuk interaksi UI (misal saat user memilih sendiri di combobox)
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(initialRoleObj);
  
  // 3. Simpan tracker role prop terakhir untuk mendeteksi perubahan dari luar (async load)
  const [prevUserRole, setPrevUserRole] = useState<string | undefined>(user?.role);

  // 4. Jika prop `user?.role` berubah dari luar (misal async fetch selesai), update state secara eksplisit saat render
  if (user?.role !== prevUserRole) {
    setPrevUserRole(user?.role);
    setSelectedRole(initialRoleObj);
  }

  return (
  <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>{title || "Tambah User"}</CardTitle>
          <CardDescription>
            {description || "Isi data di bawah untuk membuat user baru"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nama</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nama lengkap"
                  value={user?.name || ""}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user?.email || ""}
                  placeholder="user@example.com"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="role">Role</FieldLabel>
                <Combobox
                    items={roles} 
                    value={selectedRole}
                    onValueChange={(val: RoleOption | null) => setSelectedRole(val)}>
                  <ComboboxInput placeholder="Select a role" />
                  <ComboboxContent>
                    <ComboboxEmpty>No role found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: RoleOption) => (
                        <ComboboxItem key={item.value} value={item}>
                          {item.label}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
              <input type="hidden" name="role" value={selectedRole?.value ?? ""} />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex items-center justify-end gap-2">
                <Link href="/admin/users" className={cn(buttonVariants({ variant: "ghost" }))}>
                  Batal
                </Link>
                <Button type="submit" disabled={loading}>
                  Simpan
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
  )
}