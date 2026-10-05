"use client"

import * as React from "react"

import { NavTransaction } from "@/components/nav-transaction"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, UsersIcon, DatabaseIcon, CommandIcon } from "lucide-react"
import { NavSettting } from "./nav-setting"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: (
        <LayoutDashboardIcon
        />
      ),
    },
    
  ],
  NavTransaction: [
    {
      name: "Purchase",
      url: "/admin/purchase",
      icon: (
        <DatabaseIcon
        />
      ),
    },
  ],
  NavSettting: [
    {
      name: "Users",
      url: "/admin/users",
      icon: (
        <UsersIcon
        />
      ),
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Test</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavTransaction items={data.NavTransaction} />
        <NavSettting items={data.NavSettting} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
