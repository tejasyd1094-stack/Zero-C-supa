"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabaseBrowser.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.push("/login");
  }

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#0b1220] border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Zero Conflict AI" className="h-8" />
          {!user && (
            <span className="text-white font-semibold text-sm">
              Zero Conflict AI
            </span>
          )}
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4 text-sm">
          {!user ? (
            <>
              <Link
                href="/pricing"
                className="text-white/70 hover:text-white transition"
              >
                Pricing
              </Link>
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 transition text-white"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-white/70 hover:text-white transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-md border border-white/20 text-white/80 hover:text-white hover:border-white transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
