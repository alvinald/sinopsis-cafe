import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Department } from "@/lib/types/department-types";
import { Role } from "@/lib/types/role-types";
import { UsersList } from "@/lib/types/user-types";
import { Building2 } from "lucide-react";
import { ReactNode } from "react";

const UserCard = ({
  user,
  setSelectedUser,
  renderRoleBadge,
}: {
  user: UsersList;
  setSelectedUser: (user: UsersList) => void;
  renderRoleBadge: (role: string) => ReactNode;
}) => {
  return (
    <Card
      key={user.id}
      className="rounded-2xl cursor-pointer py-0 hover:border-primary/50 transition-all active:scale-[0.99] shadow-sm hover:shadow-md"
      onClick={() => setSelectedUser(user)}
    >
      <CardContent className="space-y-2.5 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight text-base">
              {user.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user.jobTitle?.name}
            </p>
          </div>
          {renderRoleBadge(user.role?.name ?? "No Akses")}
        </div>

        <div className="pt-2 mt-auto border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>{user.department?.name ?? "Board Of Director"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                user.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            <span>{user.status === "ACTIVE" ? "Aktif" : "Nonaktif"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
