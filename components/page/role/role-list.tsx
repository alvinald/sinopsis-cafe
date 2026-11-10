import { RoleWithPermissions } from "@/lib/types/role-types";
import { Plus } from "lucide-react";

export function RoleList({
  roles,
  activeRoleId,
  onSelectRole,
  onCreate,
}: {
  roles: RoleWithPermissions[];
  activeRoleId: string | null;
  onSelectRole: (roleId: string) => void;
  onCreate: () => void;
}) {
  return (
    <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Daftar Role
          </span>
          <button
            onClick={onCreate}
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
                onClick={() => onSelectRole(role.id)}
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
          Pilih role di panel samping lalu atur checkbox hak akses di sebelah
          kanan. Tekan tombol Simpan untuk memperbarui hak akses.
        </p>
      </div>
    </div>
  );
}
