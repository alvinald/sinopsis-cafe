"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-2 text-[10px] font-semibold tracking-[0.14em] text-sidebar-foreground/50 uppercase">
        Operasional
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isGroupActive =
            item.items?.some(
              (subItem) =>
                subItem.url !== "#" &&
                (pathname === subItem.url ||
                  pathname.startsWith(`${subItem.url}/`))
            ) ?? false;

          return (
            <Collapsible
              key={item.title}
              defaultOpen={item.isActive || isGroupActive}
              className="group/collapsible"
              render={<SidebarMenuItem />}
            >
              <CollapsibleTrigger
                render={
                  <SidebarMenuButton
                    isActive={isGroupActive}
                    tooltip={item.title}
                    className="h-9 gap-2.5 rounded-lg px-2.5 font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-active:bg-sidebar-primary/10 data-active:font-semibold data-active:text-sidebar-primary data-active:shadow-[inset_2px_0_0_0_var(--sidebar-primary)]"
                  />
                }
              >
                {item.icon}
                <span>{item.title}</span>
                <ChevronRightIcon className="ml-auto size-4 text-sidebar-foreground/40 transition-transform duration-200 group-data-open/collapsible:rotate-90" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="border-sidebar-border/70">
                  {item.items?.map((subItem) => {
                    const isSubActive =
                      subItem.url !== "#" &&
                      (pathname === subItem.url ||
                        pathname.startsWith(`${subItem.url}/`));

                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          isActive={isSubActive}
                          render={
                            <Link
                              href={subItem.url}
                              onClick={() => setOpenMobile(false)}
                            />
                          }
                          className="h-8 gap-2 rounded-lg px-2.5 text-[13px] text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-active:bg-sidebar-primary/10 data-active:font-medium data-active:text-sidebar-primary"
                        >
                          <span
                            className={cn(
                              "size-1.5 shrink-0 rounded-full bg-sidebar-border transition-colors",
                              isSubActive && "bg-sidebar-primary"
                            )}
                          />
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
