"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { supabaseBrowser } from "@/lib/supabaseClient";

type AuthContextType = {
  user: any | null;
  session: any | null;
};

const AuthContext = createContext<AuthContextType>({ user: null, session: null });

export function useAuth() {
  return useContext(AuthContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;

    // 1) Load existing session (handles redirect after magic link)
    (async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      if (!mounted) return;
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);

      // store email (used by app) if present
      if (data.session?.user?.email) {
        localStorage.setItem("zc_email", data.session.user.email);
      }
    })();

    // 2) Subscribe to auth state changes (login/logout)
    const { data: listener } = supabaseBrowser.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        setSession(session ?? null);
        setUser(session?.user ?? null);

        if (session?.user?.email) {
          localStorage.setItem("zc_email", session.user.email);
        } else {
          localStorage.removeItem("zc_email");
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthContext.Provider value={{ user, session }}>
        {children}
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
