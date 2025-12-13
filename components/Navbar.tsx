"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = supabaseBrowser();

    // Initial session check
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  if (loading) return null;

  return (
    <nav className="w-full border-b border-white/10 bg-[#0b1020]">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo only – no overlapping text */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Zero Conflict AI" className="h-7 w-auto" />
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/pricing" className="text-white/80 hover:text-white">
            Pricing
          </Link>

          {user && (
            <Link href="/dashboard" className="text-white/80 hover:text-white">
              Dashboard
            </Link>
          )}

          {!user ? (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
