"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = supabaseBrowser();

    // Load initial session
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
