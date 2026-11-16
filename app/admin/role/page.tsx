"use client";

import { PageHeader } from "@/components/page/page-header";
import { ModalRole } from "@/components/page/role/modal-role";
import { PermissionList } from "@/components/page/role/permission-list";
import { RoleHeader } from "@/components/page/role/role-header";
import { RoleList } from "@/components/page/role/role-list";
import { Permission } from "@/lib/types/permission-types";
import {
  RoleWithPermissions,
  updateRolePermission,
} from "@/lib/types/role-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function RolePermissionPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [updatedData, setUpdatedData] = useState<boolean>(false);
  const [roles, setRoles] = useState<RoleWithPermissions[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const [draftRolePermissionId, setDraftRolePermissionId] = useState<
    string[] | null
  >(null);

  const toggleModal = () => setIsModalOpen((v) => !v);

  const successCreate = async (roleId: string) => {
    setIsModalOpen(false);
    const data = await fetchRoles();
    selectRole(roleId, data);
    toast.success("Success", { description: "Data berhasil dibuat!" });
  };

  const successDelete = async () => {
    const data = await fetchRoles();
    if (data.length > 0) selectRole(data[0].id, data);
    else {
      setActiveRoleId(null);
      setDraftRolePermissionId(null);
    }
    toast.success("Success", { description: "Data berhasil dihapus!" });
  };

  // Terima roles sebagai argumen agar tidak bergantung pada state lama
  const selectRole = (
    roleId: string,
    source: RoleWithPermissions[] = roles,
  ) => {
    const role = source.find((r) => r.id === roleId);
    if (!role) return;
    setActiveRoleId(roleId);
    setDraftRolePermissionId(role.permissions?.map((p) => p.id) ?? []);
  };

  const onSaveRolePermissions = async () => {
    if (!activeRoleId || draftRolePermissionId === null) return;

    setLoading(true);

    try {
      const body: updateRolePermission = {
        roleId: activeRoleId,
        permissionsIds: draftRolePermissionId,
      };

      const response = await fetch(`/api/role/permissions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal menyimpan data role permission",
        );
      }

      await fetchRoles();
      toast.success("Data berhasil di simpan");
    } catch (err: unknown) {
      // Type Guard
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";

      console.error("Log error:", err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = useCallback(async () => {
    try {
      const response = await fetch(`/api/role`);
      if (!response.ok) throw new Error("Gagal mengambil data roles");
      const data: RoleWithPermissions[] = await response.json();
      setRoles(data);
      return data;
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  }, []);

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await fetch(`/api/permission`);
      if (!response.ok) throw new Error("Gagal mengambil data permissions");
      setPermissions(await response.json());
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      fetchPermissions();

      const roles: RoleWithPermissions[] = await fetchRoles();

      if (roles.length > 0) {
        setActiveRoleId(roles[0].id);
        setDraftRolePermissionId(roles[0].permissions?.map((p) => p.id) ?? []);
      }
    })();
  }, [fetchRoles, fetchPermissions]);

  const activeRole = useMemo(
    () => roles.find((r) => r.id === activeRoleId) ?? null,
    [roles, activeRoleId],
  );

  return (
    <div className="py-4 md:py-6">
      <div className="w-full px-4 lg:px-6">
        <div className="space-y-3">
          <PageHeader
            title="Role & Permissions"
            description="Kelola role dan kontrol hak akses sistem secara intuitif."
          />

          {/* MAIN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 items-start">
            {/* LEFT COLUMN: Role Tabs */}
            <RoleList
              roles={roles}
              activeRoleId={activeRoleId}
              onSelectRole={selectRole}
              onCreate={() => setIsModalOpen(true)}
            />

            <div className="lg:col-span-3 space-y-2">
              {/* Active Role Header Card */}
              <RoleHeader
                key={activeRole?.id ?? "empty"}
                activeRole={activeRole}
                loading={loading}
                setLoading={setLoading}
                successDelete={successDelete}
                onSaveRolePermissions={onSaveRolePermissions}
              />

              <PermissionList
                activeRoleId={activeRoleId}
                permissions={permissions}
                draftRolePermissionId={draftRolePermissionId}
                setDraftRolePermissionId={setDraftRolePermissionId}
              />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <ModalRole
          onOpenModal={toggleModal}
          setLoading={setLoading}
          successCreate={successCreate}
        />
      )}
    </div>
  );
}
