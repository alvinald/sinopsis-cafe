"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Plus } from "lucide-react";
import { LoadingScreen } from "@/components/loading";

// Komponen Shadcn UI
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { PageHeader } from "@/components/page/page-header";
import UserFilter from "../../../../components/page/user/user-filter";
import {
  CreateUserRequest,
  UpdateUserRequest,
  UsersList,
} from "@/lib/types/user-types";
import UserCard from "@/components/page/user/user-card";
import UserDetail from "@/components/page/user/user-detail";
import { JobTitleWithDept } from "@/lib/types/job-title-types";
import { Role } from "@/lib/types/role-types";
import { Department } from "@/lib/types/department-types";
import { UserFormDialog } from "@/components/page/user/user-form-dialog";
import { authClient } from "@/lib/auth-client";
import { can } from "@/lib/rbac";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UserListPage() {
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);

  const [users, setUsers] = useState<UsersList[] | null>(null);
  const [jobTitles, setJobTitles] = useState<JobTitleWithDept[] | null>(null);
  const [depts, setDepts] = useState<Department[] | null>(null);
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<UsersList | null>(null);
  const [userForm, setUserForm] = useState<
    { mode: "create" } | { mode: "edit"; user: UsersList } | null
  >(null);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (!can(session.permissions, "USER:VIEW")) {
      router.replace("/forbidden");
    }
  }, [isPending, session, router]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`/api/user`);
      if (!response.ok) throw new Error("Gagal mengambil data users");
      const data: UsersList[] = await response.json();
      setUsers(data);
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }, []);

  const fetchDepts = useCallback(async () => {
    try {
      const response = await fetch(`/api/dept`);
      if (!response.ok) throw new Error("Gagal mengambil data role");
      const data: Department[] = await response.json();
      setDepts(data);
      return data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  }, []);

  const fetchJobTitles = useCallback(async () => {
    try {
      const response = await fetch(`/api/job-title`);
      if (!response.ok) throw new Error("Gagal mengambil data job title");
      const data: JobTitleWithDept[] = await response.json();
      setJobTitles(data);
      return data;
    } catch (error) {
      console.error("Error fetching job title:", error);
      return [];
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await fetch(`/api/role`);
      if (!response.ok) throw new Error("Gagal mengambil data role");
      const data: Role[] = await response.json();
      setRoles(data);
      return data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    let active = true;

    void (async () => {
      await Promise.all([
        fetchDepts(),
        fetchRoles(),
        fetchJobTitles(),
        fetchUsers(),
      ]);
      if (active) setFetchLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [fetchUsers, fetchJobTitles, fetchRoles, fetchDepts]);

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users?.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.jobTitle?.name.toLowerCase().includes(search.toLowerCase());

      const matchDept =
        deptFilter === "" || user.department?.name === deptFilter;
      const matchRole = roleFilter === "" || user.role?.name === roleFilter;

      return matchSearch && matchDept && matchRole;
    });
  }, [users, search, deptFilter, roleFilter]);

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "Super Admin":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 dark:text-purple-400 border-purple-200 dark:border-purple-900">
            {role}
          </Badge>
        );
      case "Manager":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-900">
            {role}
          </Badge>
        );
      case "Supervisor":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-900">
            {role}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const onSaveUser = async (
    mode: "create" | "edit",
    values: CreateUserRequest | UpdateUserRequest,
  ) => {
    const isCreate = mode === "create";

    setSaving(true);
    try {
      const response = await fetch("/api/user", {
        method: isCreate ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(result?.message || "Gagal menyimpan data user");
        return;
      }

      await fetchUsers();

      toast.success("Success", {
        description: isCreate
          ? "Data berhasil dibuat!"
          : "Data berhasil diubah!",
      });
      setUserForm(null);
      return result?.data;
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setSaving(false);
    }
  };

  const onResetPassword = async (user: UsersList) => {
    setResetting(true);

    try {
      const response = await fetch("/api/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        toast.error(result?.message || "Gagal mereset password user");
        return;
      }

      toast.success(result?.message || "Password berhasil direset");
      setSelectedUser(null);
    } catch {
      toast.error("Tidak dapat terhubung ke server");
    } finally {
      setResetting(false);
    }
  };

  if (fetchLoading || isPending) {
    return <LoadingScreen text="Memuat data pengguna..." />;
  }

  return (
    <div className="py-4 md:py-6">
      <div className="w-full space-y-3 px-4 lg:px-6">
        <PageHeader
          title="Daftar Pengguna"
          description="Kelola profil pengguna, departemen, jabatan, dan hak akses."
          actions={
            can(session?.permissions, "USER:CREATE") && (
              <Button
                className="w-full gap-2 rounded-xl sm:w-auto"
                onClick={() => setUserForm({ mode: "create" })}
              >
                <Plus className="w-4 h-4" />
                Tambah Pengguna
              </Button>
            )
          }
        />

        {/* Toolbar Filter & Cari */}
        <UserFilter
          roles={roles}
          depts={depts}
          search={search}
          deptFilter={deptFilter}
          roleFilter={roleFilter}
          setSearch={setSearch}
          setDeptFilter={setDeptFilter}
          setRoleFilter={setRoleFilter}
        />

        {/* Unified Cards Grid (Mobile 1 kolom, Tablet 2 kolom, Desktop 3 kolom) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers && filteredUsers.length === 0 ? (
            <Card className="col-span-full rounded-2xl p-8 text-center text-muted-foreground">
              Pengguna tidak ditemukan.
            </Card>
          ) : (
            filteredUsers?.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                setSelectedUser={setSelectedUser}
                renderRoleBadge={renderRoleBadge}
              />
            ))
          )}
        </div>

        {/* Modal Detail User (Desain Bottom-Sheet Mobile & Floating Modal Desktop) */}
        {selectedUser && (
          <UserDetail
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            setUserForm={setUserForm}
            renderRoleBadge={renderRoleBadge}
            permissions={session?.permissions}
            resetting={resetting}
            onResetPassword={onResetPassword}
          />
        )}

        {userForm && (
          <UserFormDialog
            key={userForm.mode === "edit" ? userForm.user.id : "create-user"}
            mode={userForm.mode}
            user={userForm.mode === "edit" ? userForm.user : null}
            roles={roles}
            jobTitles={jobTitles}
            saving={saving}
            onClose={() => setUserForm(null)}
            onSave={onSaveUser}
          />
        )}
      </div>
    </div>
  );
}
