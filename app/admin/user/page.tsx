"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Mail,
  Building2,
  ShieldCheck,
  Edit,
  X,
  SlidersHorizontal,
} from "lucide-react";

// Komponen Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types
export type UserRole = "Super Admin" | "Manager" | "Supervisor" | "Staff";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  title: string;
  role: UserRole;
  status: "Active" | "Inactive";
  joinedDate: string;
}

const INITIAL_USERS: UserItem[] = [
  {
    id: "USR-001",
    name: "Budi Santoso",
    email: "budi.santoso@company.id",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    department: "Engineering",
    title: "Senior Fullstack Developer",
    role: "Super Admin",
    status: "Active",
    joinedDate: "12 Jan 2023",
  },
  {
    id: "USR-002",
    name: "Siti Rahma",
    email: "siti.rahma@company.id",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    department: "Human Resources",
    title: "HR Operations Lead",
    role: "Manager",
    status: "Active",
    joinedDate: "05 Mar 2022",
  },
  {
    id: "USR-003",
    name: "Rian Hidayat",
    email: "rian.hidayat@company.id",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    department: "Operation",
    title: "Floor Shift Supervisor",
    role: "Supervisor",
    status: "Active",
    joinedDate: "18 Aug 2023",
  },
  {
    id: "USR-004",
    name: "Dewi Lestari",
    email: "dewi.lestari@company.id",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    department: "Finance",
    title: "Finance & Accounting Staff",
    role: "Staff",
    status: "Inactive",
    joinedDate: "10 Nov 2024",
  },
];

export default function UserListPage() {
  const [users] = useState<UserItem[]>(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.title.toLowerCase().includes(search.toLowerCase());

      const matchDept = deptFilter === "" || user.department === deptFilter;
      const matchRole = roleFilter === "" || user.role === roleFilter;

      return matchSearch && matchDept && matchRole;
    });
  }, [users, search, deptFilter, roleFilter]);

  // Helper Badge Role
  const renderRoleBadge = (role: UserRole) => {
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

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 text-foreground">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Daftar Pengguna
            </h1>
            <p className="text-sm text-muted-foreground">
              Kelola profil pengguna, departemen, jabatan, dan hak akses.
            </p>
          </div>
          <Button className="w-full sm:w-auto gap-2 rounded-xl">
            <Plus className="w-4 h-4" />
            Tambah Pengguna
          </Button>
        </div>

        {/* Toolbar Filter & Cari */}
        <Card className="rounded-2xl border">
          <CardContent className="p-4 space-y-3">
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
              className={`flex-col md:flex-row gap-3 ${
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
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Human Resources">
                    Human Resources
                  </SelectItem>
                  <SelectItem value="Operation">Operation</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
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
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Unified Cards Grid (Mobile 1 kolom, Tablet 2 kolom, Desktop 3 kolom) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.length === 0 ? (
            <Card className="col-span-full rounded-2xl p-8 text-center text-muted-foreground">
              Pengguna tidak ditemukan.
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="rounded-2xl cursor-pointer hover:border-primary/50 transition-all active:scale-[0.99] shadow-sm hover:shadow-md"
                onClick={() => setSelectedUser(user)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-11 h-11">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold leading-tight text-base">
                          {user.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {user.title}
                        </p>
                      </div>
                    </div>
                    {renderRoleBadge(user.role)}
                  </div>

                  <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{user.department}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          user.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      />
                      <span>
                        {user.status === "Active" ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Modal Detail User (Desain Bottom-Sheet Mobile & Floating Modal Desktop) */}
        {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-background w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-border p-6 space-y-6 shadow-xl animate-in slide-in-from-bottom duration-300">
              {/* Modal Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                    <AvatarImage
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                    />
                    <AvatarFallback>
                      {selectedUser.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">
                      {selectedUser.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      ID: {selectedUser.id}
                    </p>
                  </div>
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
                    <span className="text-xs text-muted-foreground">
                      Jabatan
                    </span>
                    <span className="font-semibold text-foreground">
                      {selectedUser.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Departemen
                    </span>
                    <span className="font-medium text-foreground">
                      {selectedUser.department}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Hak Akses (Role)
                    </span>
                    {renderRoleBadge(selectedUser.role)}
                  </div>
                </div>

                <div className="space-y-2.5 px-1">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                    <span>Bergabung pada {selectedUser.joinedDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="outline" className="w-full gap-2 rounded-xl">
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
        )}
      </div>
    </div>
  );
}
