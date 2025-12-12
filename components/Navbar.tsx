"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = supabaseBrowser();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="flex justify-between items-center py-4">
      <Link href="/">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Zero Conflict" className="w-10" />
        </div>
      </Link>

      <div className="flex items-center space-x-4">

        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button
              onClick={async () => {
                const supabase = supabaseBrowser();
                await supabase.auth.signOut();
              }}
              className="text-red-400"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
