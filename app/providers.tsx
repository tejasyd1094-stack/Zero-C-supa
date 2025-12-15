"use client";

import { createContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ 1️⃣ LOAD INITIAL SESSION
    supabaseBrowser.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    // ✅ 2️⃣ LISTEN FOR CHANGES
    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
