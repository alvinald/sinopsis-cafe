"use client";

import Link from "next/link";
import { Coffee } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "./logo";
import Image from "next/image";

export function SidebarBrand() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          render={<Link href="/admin/dashboard" />}
          className="h-12 gap-3 rounded-xl px-2 hover:bg-sidebar-accent/60"
        >
          <Image
            src="/images/logo_white.jpg"
            alt="Sinopsis Coffee"
            width={35}
            height={35}
            className="h-6-50 w-6-50"
          />
          <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold tracking-tight">
              Sinopsis Coffee
            </span>
            <span className="truncate text-[11px] text-sidebar-foreground/60">
              Admin Panel
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
