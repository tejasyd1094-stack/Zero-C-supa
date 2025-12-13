"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Initial user fetch
    supabaseBrowser.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabaseBrowser.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="w-full border-b border-white/10 bg-[#0b1228]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Zero Conflict AI" className="h-8 w-8" />
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4 text-sm">
          <Link href="/pricing" className="text-white/70 hover:text-white">
            Pricing
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className="text-white/70 hover:text-white"
            >
              Dashboard
            </Link>
          )}

          {!user ? (
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-md bg-white text-black font-medium"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md bg-white text-black font-medium"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
