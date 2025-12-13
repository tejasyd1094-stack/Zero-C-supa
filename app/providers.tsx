"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // supabaseBrowser IS ALREADY A CLIENT
    supabaseBrowser.auth.getSession();
  }, []);

  return <>{children}</>;
}
