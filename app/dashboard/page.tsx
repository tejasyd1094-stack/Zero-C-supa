"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import Link from "next/link";

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const supabase = supabaseBrowser();

      // 1️⃣ Get logged in user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email ?? "User");
      }

      // 2️⃣ Fetch credit balance from Supabase
      const { data: usage } = await supabase
        .from("usage_limits")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (usage) {
        setCredits(usage.credits);
      } else {
        setCredits(3); // default if missing
      }

      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-white mt-10">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="text-white py-10 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Welcome 👋</h1>
      <p className="text-white/70 mt-1">{userEmail}</p>

      {/* Credits Display */}
      <div className="mt-8 bg-[#0d1a2d] p-5 rounded-xl border border-white/10">
        <p className="text-lg font-semibold">Your Credits</p>

        <p className="text-4xl font-bold mt-2">
          {credits !== null ? credits : 0}
        </p>

        {credits === 0 && (
          <Link
            href="/pricing"
            className="mt-3 inline-block text-blue-400 underline"
          >
            Buy More Credits →
          </Link>
        )}
      </div>

      {/* History Button */}
      <div className="mt-8">
        <Link
          href="/history"
          className="px-5 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          View Script History
        </Link>
      </div>

      {/* Generate Button */}
      <div className="mt-5">
        <Link
          href="/generate"
          className="px-5 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition"
        >
          Generate New Script
        </Link>
      </div>
    </div>
  );
}
