import type { ReactNode } from "react";

import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Toaster position="top-right" richColors />
      {children}
    </>
  );
}
