"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authClient } from "./auth-client";

type User = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
};

type Session = {
  user: User | null;
};

type SessionResponse = {
  data?: {
    user?: User | null;
  } | null;
} | null;

const SessionContext = createContext<{
  session: Session | null;
  loading: boolean;
  refetch: () => Promise<void>;
}>({
  session: null,
  loading: true,
  refetch: async () => {},
});

export function useSession() {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const mapSession = (res: SessionResponse): Session | null => {
    const user = res?.data?.user;
    return user ? { user } : null;
  };

  const refetch = async () => {
    const res = await authClient.getSession() as SessionResponse;
    setSession(mapSession(res));
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await authClient.getSession() as SessionResponse;
        setSession(mapSession(res));
      } catch {
        // No session
        setSession(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading, refetch }}>
      {children}
    </SessionContext.Provider>
  );
}
