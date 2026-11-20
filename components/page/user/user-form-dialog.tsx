"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { JobTitleWithDept } from "@/lib/types/job-title-types";
import { Role } from "@/lib/types/role-types";
import {
  CreateUserRequest,
  UpdateUserRequest,
  UsersList,
} from "@/lib/types/user-types";
import { X } from "lucide-react";
import { useState } from "react";

export function UserFormDialog({
  mode,
  user,
  roles,
  jobTitles,
  onClose,
  onSave,
}: {
  mode: "create" | "edit";
  user?: UsersList | null;
  roles: Role[] | null;
  jobTitles: JobTitleWithDept[] | null;
  onClose: () => void;
  onSave: (
    mode: "create" | "edit",
    values: CreateUserRequest | UpdateUserRequest,
  ) => void;
}) {
  const [name, setName] = useState<string>(user?.name ?? "");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [jobTitle, setJobTitle] = useState<string>(user?.jobTitle?.id ?? "");
  const [role, setRole] = useState<string>(user?.role?.id ?? "");
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">(
    user?.status ?? "ACTIVE",
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode && mode === "create") {
      const values: CreateUserRequest = {
        name: name,
        email: email,
        jobTitle: jobTitle,
        role: role,
        status: status,
      };
      onSave(mode, values);
    } else if (mode && user && mode === "edit") {
      const values: UpdateUserRequest = {
        id: user.id,
        name: name,
        email: email,
        jobTitle: jobTitle,
        role: role,
        status: status,
      };
      onSave(mode, values);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-form-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-card p-4 shadow-2xl sm:max-w-sm sm:rounded-2xl"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="user-form-title" className="text-lg font-semibold">
              {user ? "Edit User" : "Tambah Pengguna"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {user
                ? "Perbarui data dan hak akses pengguna."
                : "Tambahkan pengguna baru beserta hak aksesnya."}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Tutup"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="user-name">Nama</FieldLabel>
              <Input
                id="user-name"
                type="text"
                required
                autoFocus
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nama lengkap"
                className="h-10"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="user-email">Email</FieldLabel>
              <Input
                id="user-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="user@example.com"
                className="h-10"
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
              <Field>
                <FieldLabel htmlFor="user-title">Jabatan</FieldLabel>
                <Select
                  value={jobTitle}
                  onValueChange={(value) => setJobTitle(value ?? "")}
                  items={jobTitles?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                >
                  <SelectTrigger id="user-job" className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTitles?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="user-role">Role</FieldLabel>
                <Select
                  value={role}
                  onValueChange={(value) => setRole(value ?? "Staff")}
                  items={roles?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                >
                  <SelectTrigger id="user-role" className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="user-status">Status</FieldLabel>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value ?? "ACTIVE")}
                >
                  <SelectTrigger id="user-status" className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={"-"} value="">
                      --Pilih--
                    </SelectItem>
                    <SelectItem key={"ACTIVE"} value="ACTIVE">
                      Active
                    </SelectItem>
                    <SelectItem key={"INACTIVE"} value="INACTIVE">
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>

          <Separator className="my-4" />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" size="sm">
              {user ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
