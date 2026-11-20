import type { ReactNode } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Shell admin: dipakai oleh semua halaman di bawah /admin.
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/login");
  }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        user={{
          name: session.user.name,
          email: session.user.email,
          avatar: session.user.image,
        }}
      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <Toaster position="top-right" richColors />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
