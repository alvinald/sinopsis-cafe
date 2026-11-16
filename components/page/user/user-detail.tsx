import { Button } from "@/components/ui/button";
import { UsersList } from "@/lib/types/user-types";
import { Edit, Mail, X } from "lucide-react";
import { ReactNode } from "react";

const UserDetail = ({
  selectedUser,
  setSelectedUser,
  setUserForm,
  renderRoleBadge,
}: {
  selectedUser: UsersList;
  setSelectedUser: (user: UsersList | null) => void;
  setUserForm: (params: { mode: "create" | "edit"; user: UsersList }) => void;
  renderRoleBadge: (role: string) => ReactNode;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-background w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-border p-6 space-y-6 shadow-xl animate-in slide-in-from-bottom duration-300">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-foreground">
              {selectedUser.name}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedUser(null)}
            className="rounded-full hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Detail Items */}
        <div className="space-y-4 text-sm">
          <div className="p-3.5 bg-muted/50 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Jabatan</span>
              <span className="font-semibold text-foreground">
                {selectedUser.jobTitle?.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Departemen</span>
              <span className="font-medium text-foreground">
                {selectedUser.department?.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Hak Akses (Role)
              </span>
              {renderRoleBadge(selectedUser.role?.name ?? "No Akses")}
            </div>
          </div>

          <div className="space-y-2.5 px-1">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span>{selectedUser.email}</span>
            </div>
            {/* <div className="flex items-center gap-3 text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
              <span>Bergabung pada {selectedUser.joinedDate}</span>
            </div> */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            variant="outline"
            className="w-full gap-2 rounded-xl"
            onClick={() => {
              setUserForm({ mode: "edit", user: selectedUser });
              setSelectedUser(null);
            }}
          >
            <Edit className="w-4 h-4" />
            Edit User
          </Button>
          <Button
            className="w-full rounded-xl"
            onClick={() => setSelectedUser(null)}
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
