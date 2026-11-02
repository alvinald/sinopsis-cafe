"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEndIcon,
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
  Users2Icon,
  UsersIcon,
  HomeIcon,
  Package,
  IdCard,
  ShieldCheck,
} from "lucide-react";
import { NavSettings } from "./nav-setting";
import { NavDashboard } from "./nav-dashboard";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <GalleryVerticalEndIcon />,
      plan: "Enterprise",
    },
  ],
  dashboard: [
    {
      name: "Dashboard",
      url: "#",
      icon: <HomeIcon />,
    },
  ],
  main: [
    {
      title: "Inventory",
      url: "#",
      icon: <Package />,
      isActive: true,
      items: [
        {
          title: "Purchase Order",
          url: "#",
        },
        {
          title: "Moving Item",
          url: "#",
        },
      ],
    },
    {
      title: "Karyawan",
      url: "#",
      icon: <UsersIcon />,
      items: [
        {
          title: "List Karyawan",
          url: "#",
        },
        {
          title: "Schedule",
          url: "admin/schedule",
        },
        {
          title: "Attendance",
          url: "#",
        },
        {
          title: "Overtime",
          url: "#",
        },
      ],
    },
  ],
  settings: [
    {
      name: "Users",
      url: "#",
      icon: <ShieldCheck />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavDashboard items={data.dashboard} />
        <NavMain items={data.main} />
        <NavSettings items={data.settings} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
