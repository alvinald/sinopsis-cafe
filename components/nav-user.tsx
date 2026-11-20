"use client";

import { useRouter } from "next/navigation";
import {
  BadgeCheckIcon,
  BellIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "SC";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const initials = getInitials(user.name);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/login");
        },
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="h-12 rounded-xl border border-sidebar-border/60 bg-sidebar-accent/30 px-2.5 hover:bg-sidebar-accent aria-expanded:bg-sidebar-accent"
              />
            }
          >
            <Avatar className="size-8 ring-1 ring-sidebar-border/70">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : null}
              <AvatarFallback className="bg-sidebar-primary/10 text-xs font-semibold text-sidebar-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs text-sidebar-foreground/60">
                {user.email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4 text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-60"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="bg-sidebar-primary/10 text-xs font-semibold text-sidebar-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 flex-1 leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon />
                Akun
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifikasi
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOutIcon />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
