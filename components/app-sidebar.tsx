"use client";

import * as React from "react";
import { HomeIcon, Package, ShieldCheck, Users, UsersIcon } from "lucide-react";

import { NavDashboard } from "@/components/nav-dashboard";
import { NavMain } from "@/components/nav-main";
import { NavSettings } from "@/components/nav-setting";
import { NavUser } from "@/components/nav-user";
import { SidebarBrand } from "@/components/sidebar-brand";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const data = {
  dashboard: [
    {
      name: "Dashboard",
      url: "/admin/dashboard",
      icon: <HomeIcon />,
    },
  ],
  main: [
    {
      title: "Inventory",
      url: "#",
      icon: <Package />,
      items: [
        {
          title: "Item",
          url: "/admin/item",
        },
        {
          title: "Barang Masuk",
          url: "/admin/stock-in",
        },
        {
          title: "Moving Item",
          url: "/admin/moving-request",
        },
      ],
    },
    {
      title: "Karyawan",
      url: "#",
      icon: <UsersIcon />,
      items: [
        {
          title: "Schedule",
          url: "/admin/schedule",
        },
      ],
    },
  ],
  settings: [
    {
      name: "Users",
      url: "/admin/user",
      icon: <Users />,
    },
    {
      name: "Role",
      url: "/admin/role",
      icon: <ShieldCheck />,
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string;
    email: string;
    avatar?: string | null;
  };
};

const fallbackUser = {
  name: "Admin",
  email: "admin@sinopsiscafe.id",
};

export function AppSidebar({
  user = fallbackUser,
  className,
  variant,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar
      collapsible="icon"
      variant={variant}
      className={cn(
        variant === "inset" &&
          "[&>[data-sidebar=sidebar]]:overflow-hidden [&>[data-sidebar=sidebar]]:rounded-2xl [&>[data-sidebar=sidebar]]:border [&>[data-sidebar=sidebar]]:border-sidebar-border/70 [&>[data-sidebar=sidebar]]:shadow-sm",
        className,
      )}
      {...props}
    >
      <SidebarHeader className="p-3 pb-1">
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent className="gap-1 py-1">
        <NavDashboard items={data.dashboard} />
        <NavMain items={data.main} />
        <NavSettings items={data.settings} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/60 p-3">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
