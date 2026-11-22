"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavDashboard({
  items,
}: {
  items: {
    name: string;
    url: string;
    icon: React.ReactNode;
  }[];
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-2 text-[10px] font-semibold tracking-[0.14em] text-sidebar-foreground/50 uppercase">
        Utama
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            item.url !== "#" &&
            (pathname === item.url || pathname.startsWith(`${item.url}/`));

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                isActive={isActive}
                tooltip={item.name}
                render={
                  <Link
                    href={item.url}
                    onClick={() => setOpenMobile(false)}
                  />
                }
                className="h-9 gap-2.5 rounded-lg px-2.5 font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-active:bg-sidebar-primary/10 data-active:font-semibold data-active:text-sidebar-primary data-active:shadow-[inset_2px_0_0_0_var(--sidebar-primary)]"
              >
                {item.icon}
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
