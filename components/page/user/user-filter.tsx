"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Department } from "@/lib/types/department-types";
import { Role } from "@/lib/types/role-types";
import { Search, SlidersHorizontal } from "lucide-react";
import React, { useState } from "react";

const UserFilter = ({
  roles,
  depts,
  search,
  deptFilter,
  roleFilter,
  setSearch,
  setDeptFilter,
  setRoleFilter,
}: {
  roles: Role[] | null;
  depts: Department[] | null;
  search: string;
  deptFilter: string;
  roleFilter: string;
  setSearch: (search: string) => void;
  setDeptFilter: (dept: string) => void;
  setRoleFilter: (role: string) => void;
}) => {
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  return (
    <Card className="rounded-2xl border py-0">
      <CardContent className="space-y-2.5 p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama, email, atau jabatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden rounded-xl shrink-0"
            onClick={() => setShowFiltersMobile((prev) => !prev)}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter Options */}
        <div
          className={`flex-col gap-2 md:flex-row md:gap-3 ${
            showFiltersMobile ? "flex" : "hidden md:flex"
          }`}
        >
          <Select
            value={deptFilter}
            onValueChange={(val) => setDeptFilter(val ?? "")}
          >
            <SelectTrigger className="w-full md:w-50 rounded-xl">
              <SelectValue placeholder="Departemen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Departemen</SelectItem>
              {depts?.map((dept) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={roleFilter}
            onValueChange={(val) => setRoleFilter(val ?? "")}
          >
            <SelectTrigger className="w-full md:w-50 rounded-xl">
              <SelectValue placeholder="Role Access" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Semua Peran (Role)</SelectItem>
              {roles?.map((role) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserFilter;
