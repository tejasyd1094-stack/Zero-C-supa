"use client";

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/app/providers";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  if (loading) return null;

  async function logout() {
    await supabaseBrowser.auth.signOut();
    router.push("/login");
  }

  return (
    <nav className="flex justify-between px-6 py-4 border-b">
      <Link href="/" className="font-bold">
        Zero Conflict AI
      </Link>

      <div className="flex gap-4">
        <Link href="/pricing">Pricing</Link>

        {user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
