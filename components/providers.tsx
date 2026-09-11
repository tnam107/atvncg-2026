"use client";

import { Toaster } from "sonner";
import { IdentityProvider } from "@/components/identity-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <IdentityProvider>
      {children}
      <Toaster position="top-center" richColors toastOptions={{ className: "font-semibold" }} />
    </IdentityProvider>
  );
}
