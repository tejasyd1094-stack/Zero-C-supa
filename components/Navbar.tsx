"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });

    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(
      (_, session) => {
        setLoggedIn(!!session);
      }
    );

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="flex items-center justify-between py-4">
      <Link href="/" className="font-bold">
        <img src="/logo.png" className="h-8" />
      </Link>

      <div className="flex gap-4">
        <Link href="/pricing">Pricing</Link>
        <Link href="/generator">Generate</Link>

        {loggedIn ? (
          <Link href="/dashboard">Dashboard</Link>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}