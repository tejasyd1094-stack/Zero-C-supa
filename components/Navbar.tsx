"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/app/providers";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Navbar() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="font-bold text-lg">
        Zero Conflict
      </Link>

      <div className="flex gap-4 items-center">
        <Link href="/pricing">Pricing</Link>
        <Link href="/generator">Generate</Link>

        {!loading && !user && (
          <Link href="/login" className="font-semibold">
            Login
          </Link>
        )}

        {!loading && user && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button
              onClick={handleLogout}
              className="text-red-600 font-semibold"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
