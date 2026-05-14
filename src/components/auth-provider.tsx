"use client";

import { SessionProvider } from "@/lib/session";

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}