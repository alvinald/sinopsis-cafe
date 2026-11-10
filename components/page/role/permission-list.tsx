import { Permission, PermissionByGroup } from "@/lib/types/permission-types";
import { Dispatch, SetStateAction } from "react";

export function PermissionList({
  activeRoleId,
  permissions,
  draftRolePermissionId,
  setDraftRolePermissionId,
}: {
  activeRoleId: string | null;
  permissions: Permission[];
  draftRolePermissionId: string[] | null;
  setDraftRolePermissionId: Dispatch<SetStateAction<string[] | null>>;
}) {
  const handlePermissionChange = (id: string, checked: boolean) => {
    setDraftRolePermissionId((prev) => {
      // Jika prev null, anggap sebagai array kosong []
      const currentList = prev ?? [];

      if (checked) {
        // Jika di-check dan belum ada, tambahkan ke array
        return currentList.includes(id) ? currentList : [...currentList, id];
      }

      // Jika di-uncheck, filter dari array
      return currentList.filter((item) => item !== id);
    });
  };

  const handleToggleSelectAllModule = (resource: string) => {
    const targetGroup = permissionByGroup.find(
      (group) => group.resource === resource,
    );
    if (!targetGroup) return;

    const allModActionIds = targetGroup.actions.map((act) => act.id);
    const currentSelected = draftRolePermissionId ?? [];

    const isAllSelected = allModActionIds.every((id) =>
      currentSelected.includes(id),
    );

    let newSelectedIds: string[];

    if (isAllSelected) {
      // Unselect All: Hapus semua ID dari modul ini
      newSelectedIds = currentSelected.filter(
        (id) => !allModActionIds.includes(id),
      );
    } else {
      // Select All: Tambahkan ID modul yang belum ada di array lama
      newSelectedIds = Array.from(
        new Set([...currentSelected, ...allModActionIds]),
      );
    }

    // Kirim array string[] baru ke parameter/state
    setDraftRolePermissionId(newSelectedIds);
  };

  const permissionByGroup: PermissionByGroup[] = permissions.reduce(
    (acc, curr) => {
      // Cari apakah resource sudah ada di accumulator
      let group = acc.find((item) => item.resource === curr.resource);

      if (!group) {
        // Buat object group baru dengan properti 'actions'
        group = {
          resource: curr.resource,
          collapsed: false,
          actions: [],
        };

        acc.push(group);
      }

      // Masukkan data action ke array 'actions'
      group.actions.push({ id: curr.id, name: curr.action });

      return acc;
    },
    [] as PermissionByGroup[],
  );

  return (
    <div className="space-y-4">
      {permissionByGroup.map((group) => {
        const activeCountInMod = group.actions.filter((act) =>
          draftRolePermissionId?.includes(act.id),
        ).length;

        const allSelected =
          group.actions.length > 0 &&
          group.actions.every((act) => draftRolePermissionId?.includes(act.id));

        return (
          <div
            key={group.resource}
            className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden transition"
          >
            {/* Module Header */}
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-zinc-50/70 border-b border-zinc-200/80 flex items-center justify-between gap-3 select-none">
              <div className="flex items-center gap-2.5 cursor-pointer">
                <h3 className="text-xs sm:text-sm font-bold text-zinc-800">
                  {group.resource}
                </h3>
                <span className="text-[10px] text-zinc-400 font-normal">
                  ({activeCountInMod}/{group.actions.length})
                </span>
              </div>

              <button
                onClick={() => handleToggleSelectAllModule(group.resource)}
                className="text-[11px] font-medium text-blue-600 hover:underline"
              >
                {allSelected ? "Hapus Semua" : "Pilih Semua"}
              </button>
            </div>

            {/* Module Items Grid */}
            <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.actions.map((item) => {
                const isChecked = draftRolePermissionId?.includes(item.id);
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
                      onChange={(e) =>
                        handlePermissionChange(item.id, e.target.checked)
                      }
                      className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold text-zinc-800">
                        {item.name}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
