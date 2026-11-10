"use client";

import React, { useState } from "react";
import {
  Plus,
  Check,
  X,
  CheckCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// --- TYPE DEFINITIONS ---
interface PermissionItem {
  id: string;
  name: string;
  desc: string;
}

interface ModuleGroup {
  id: string;
  title: string;
  collapsed: boolean;
  items: PermissionItem[];
}

interface Role {
  id: string;
  name: string;
  desc: string;
  permissions: string[];
}

// --- INITIAL DATA ---
const INITIAL_MODULES: ModuleGroup[] = [
  {
    id: "users",
    title: "User & Security",
    collapsed: false,
    items: [
      {
        id: "user_view",
        name: "Lihat Daftar User",
        desc: "Dapat melihat daftar pengguna terdaftar.",
      },
      {
        id: "user_create",
        name: "Tambah User Baru",
        desc: "Dapat mengundang atau membuat akun baru.",
      },
      {
        id: "user_delete",
        name: "Hapus / Nonaktifkan User",
        desc: "Memblokir atau menghapus akses pengguna.",
      },
    ],
  },
  {
    id: "takeout",
    title: "Operasional Take Out",
    collapsed: false,
    items: [
      {
        id: "takeout_view",
        name: "Lihat Antrean Take Out",
        desc: "Dapat melihat daftar pesanan bawa pulang.",
      },
      {
        id: "takeout_create",
        name: "Buat Pesanan Take Out",
        desc: "Memasukkan pesanan bawa pulang baru ke kasir.",
      },
      {
        id: "takeout_pack",
        name: "Tandai Siap/Dikemas",
        desc: "Memperbarui status pesanan menjadi siap diambil.",
      },
      {
        id: "takeout_handover",
        name: "Serahkan ke Pelanggan",
        desc: "Selesaikan transaksi penyerahan pesanan.",
      },
    ],
  },
  {
    id: "content",
    title: "Manajemen Konten",
    collapsed: false,
    items: [
      {
        id: "content_write",
        name: "Tulis Artikel",
        desc: "Membuat dan mengedit draft postingan.",
      },
      {
        id: "content_publish",
        name: "Publikasikan Konten",
        desc: "Menerbitkan postingan ke publik.",
      },
    ],
  },
  {
    id: "finance",
    title: "Keuangan & Pembayaran",
    collapsed: false,
    items: [
      {
        id: "finance_view",
        name: "Lihat Transaksi",
        desc: "Melihat riwayat transaksi dan invoice.",
      },
      {
        id: "finance_approve",
        name: "Approve Pembayaran",
        desc: "Menyetujui transaksi finansial keluar.",
      },
    ],
  },
];

const INITIAL_ROLES: Role[] = [
  {
    id: "admin",
    name: "Administrator",
    desc: "Akses penuh ke semua fitur sistem.",
    permissions: [
      "user_view",
      "user_create",
      "user_delete",
      "takeout_view",
      "takeout_create",
      "takeout_pack",
      "takeout_handover",
      "content_write",
      "content_publish",
      "finance_view",
      "finance_approve",
    ],
  },
  {
    id: "takeout",
    name: "Take Out Staff",
    desc: "Khusus menangani alur dan operasional pesanan bawa pulang.",
    permissions: [
      "takeout_view",
      "takeout_create",
      "takeout_pack",
      "takeout_handover",
    ],
  },
  {
    id: "editor",
    name: "Editor",
    desc: "Mengelola penulisan dan publikasi konten.",
    permissions: ["content_write", "content_publish"],
  },
  {
    id: "viewer",
    name: "Viewer",
    desc: "Hanya memiliki hak akses membaca data.",
    permissions: ["user_view", "takeout_view", "finance_view"],
  },
];

export default function RolePermissionPage() {
  const [modules, setModules] = useState<ModuleGroup[]>(INITIAL_MODULES);
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [activeRoleId, setActiveRoleId] = useState<string>("admin");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>("");
  const [newRoleDesc, setNewRoleDesc] = useState<string>("");

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeRole = roles.find((r) => r.id === activeRoleId) || roles[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleTogglePermission = (permId: string) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id !== activeRoleId) return role;
        const exists = role.permissions.includes(permId);
        const updatedPermissions = exists
          ? role.permissions.filter((id) => id !== permId)
          : [...role.permissions, permId];
        return { ...role, permissions: updatedPermissions };
      }),
    );
  };

  const handleToggleSelectAllModule = (modId: string) => {
    const targetModule = modules.find((m) => m.id === modId);
    if (!targetModule || !activeRole) return;

    const itemIds = targetModule.items.map((i) => i.id);
    const allSelected = itemIds.every((id) =>
      activeRole.permissions.includes(id),
    );

    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id !== activeRoleId) return role;
        let newPerms: string[];
        if (allSelected) {
          newPerms = role.permissions.filter((id) => !itemIds.includes(id));
        } else {
          const toAdd = itemIds.filter((id) => !role.permissions.includes(id));
          newPerms = [...role.permissions, ...toAdd];
        }
        return { ...role, permissions: newPerms };
      }),
    );
  };

  const toggleModuleCollapse = (modId: string) => {
    setModules((prevModules) =>
      prevModules.map((mod) =>
        mod.id === modId ? { ...mod, collapsed: !mod.collapsed } : mod,
      ),
    );
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const newId =
      newRoleName.toLowerCase().replace(/\s+/g, "_") +
      "_" +
      Date.now().toString().slice(-4);

    const createdRole: Role = {
      id: newId,
      name: newRoleName.trim(),
      desc: newRoleDesc.trim() || "Tidak ada deskripsi.",
      permissions: [],
    };

    setRoles((prev) => [...prev, createdRole]);
    setActiveRoleId(newId);
    setNewRoleName("");
    setNewRoleDesc("");
    setIsModalOpen(false);
    showToast(`Role "${createdRole.name}" berhasil dibuat`);
  };

  const handleDeleteActiveRole = () => {
    if (roles.length <= 1) {
      alert("Sistem harus memiliki minimal satu role.");
      return;
    }

    const roleToDelete = activeRole;
    const remainingRoles = roles.filter((r) => r.id !== activeRoleId);

    setRoles(remainingRoles);
    setActiveRoleId(remainingRoles[0].id);
    showToast(`Role "${roleToDelete?.name}" berhasil dihapus`);
  };

  const handleSavePermissions = () => {
    showToast("Konfigurasi berhasil disimpan!");
  };

  return (
    <div className="py-4 md:py-6">
      <div className="w-full px-4 lg:px-6">
        <div className=" space-y-6">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Role &amp; Permissions
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500">
                Kelola role dan kontrol hak akses sistem secara intuitif.
              </p>
            </div>
          </div>

          {/* MAIN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* LEFT COLUMN: Role Tabs */}
            <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-4">
              <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Daftar Role
                  </span>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Role Baru
                  </button>
                </div>

                <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 scrollbar-none">
                  {roles.map((role) => {
                    const isActive = role.id === activeRoleId;
                    return (
                      <button
                        key={role.id}
                        onClick={() => setActiveRoleId(role.id)}
                        className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 text-left flex items-center justify-between gap-3 ${
                          isActive
                            ? "bg-zinc-900 text-white shadow-sm"
                            : "text-zinc-600 hover:bg-zinc-100"
                        }`}
                      >
                        <span>{role.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? "bg-zinc-700 text-zinc-200"
                              : "bg-zinc-100 text-zinc-500"
                          }`}
                        >
                          {role.permissions.length}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="hidden lg:block bg-zinc-100 border border-zinc-200/80 rounded-2xl p-4 text-xs space-y-2">
                <div className="font-semibold text-zinc-700">Tips Ringkas:</div>
                <p className="text-zinc-500 leading-relaxed">
                  Pilih role di panel samping lalu atur checkbox hak akses di
                  sebelah kanan. Tekan tombol Simpan untuk memperbarui hak
                  akses.
                </p>
              </div>
            </div>

            {/* RIGHT COLUMN: Permissions Panel */}
            <div className="lg:col-span-3 space-y-4">
              {/* Active Role Header Card */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold">
                      {activeRole?.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200">
                      {activeRole?.permissions.length || 0} Akses Aktif
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {activeRole?.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={handleDeleteActiveRole}
                    className="px-3 py-2 sm:py-1.5 rounded-xl border border-zinc-200 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                  >
                    Hapus Role
                  </button>
                  <button
                    onClick={handleSavePermissions}
                    className="px-4 py-2 sm:py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" /> Simpan
                  </button>
                </div>
              </div>

              {/* Permissions List Grouped by Module */}
              <div className="space-y-4">
                {modules.map((mod) => {
                  const activeCountInMod = mod.items.filter((item) =>
                    activeRole?.permissions.includes(item.id),
                  ).length;
                  const allSelected =
                    mod.items.length > 0 &&
                    mod.items.every((item) =>
                      activeRole?.permissions.includes(item.id),
                    );

                  return (
                    <div
                      key={mod.id}
                      className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden transition"
                    >
                      {/* Module Header */}
                      <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-zinc-50/70 border-b border-zinc-200/80 flex items-center justify-between gap-3 select-none">
                        <div
                          className="flex items-center gap-2.5 cursor-pointer"
                          onClick={() => toggleModuleCollapse(mod.id)}
                        >
                          {mod.collapsed ? (
                            <ChevronRight className="w-4 h-4 text-zinc-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-zinc-400" />
                          )}
                          <h3 className="text-xs sm:text-sm font-bold text-zinc-800">
                            {mod.title}
                          </h3>
                          <span className="text-[10px] text-zinc-400 font-normal">
                            ({activeCountInMod}/{mod.items.length})
                          </span>
                        </div>

                        <button
                          onClick={() => handleToggleSelectAllModule(mod.id)}
                          className="text-[11px] font-medium text-blue-600 hover:underline"
                        >
                          {allSelected ? "Hapus Semua" : "Pilih Semua"}
                        </button>
                      </div>

                      {/* Module Items Grid */}
                      {!mod.collapsed && (
                        <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {mod.items.map((item) => {
                            const isChecked = activeRole?.permissions.includes(
                              item.id,
                            );
                            return (
                              <label
                                key={item.id}
                                className={`flex items-start gap-3 p-3 rounded-xl border ${
                                  isChecked
                                    ? "border-blue-200 bg-blue-50/40"
                                    : "border-zinc-100 hover:bg-zinc-50"
                                } cursor-pointer transition`}
                              >
                                <input
                                  type="checkbox"
                                  checked={!!isChecked}
                                  onChange={() =>
                                    handleTogglePermission(item.id)
                                  }
                                  className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="space-y-0.5">
                                  <div className="text-xs font-semibold text-zinc-800">
                                    {item.name}
                                  </div>
                                  <div className="text-[11px] text-zinc-500 leading-tight">
                                    {item.desc}
                                  </div>
                                  <div className="text-[9px] font-mono text-zinc-400 pt-0.5">
                                    {item.id}
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL: ADD ROLE */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white border border-zinc-200 rounded-t-2xl sm:rounded-2xl w-full max-w-sm shadow-xl p-5 space-y-4 transition-all">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold text-sm">Tambah Role Baru</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreateRole} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">
                    Nama Role
                  </label>
                  <input
                    type="text"
                    required
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="misal: Supervisor"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">
                    Deskripsi Ringkas
                  </label>
                  <input
                    type="text"
                    value={newRoleDesc}
                    onChange={(e) => setNewRoleDesc(e.target.value)}
                    placeholder="misal: Meninjau laporan dan approval"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-zinc-500 hover:bg-zinc-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
                  >
                    Buat Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-zinc-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 transition">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
