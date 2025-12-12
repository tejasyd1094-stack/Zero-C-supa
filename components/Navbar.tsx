"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_e, session) => setUser(session?.user)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.png" width={36} height={36} alt="logo" />
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/pricing">Pricing</Link>
        <Link href="/generator">Generate</Link>

        {!user ? (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup" className="font-semibold text-blue-400">
              Sign up
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button
              onClick={async () => {
                await supabaseBrowser().auth.signOut();
                location.href = "/";
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
