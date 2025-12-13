"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function DashboardPage() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCredits() {
      const { data: { user } } = await supabaseBrowser.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabaseBrowser
        .from("usage_limits")
        .select("used_count, max_credits")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Credit fetch error:", error);
        setCredits(0);
      } else {
        setCredits(data.max_credits - data.used_count);
      }

      setLoading(false);
    }

    loadCredits();
  }, []);

  if (loading) {
    return <p className="text-white/60">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="bg-[#0f1a35] rounded-xl p-6 border border-white/10">
        <p className="text-white/60">Credits remaining</p>
        <p className="text-3xl font-bold">{credits ?? 0}</p>

        {credits === 0 && (
          <a
            href="/pricing"
            className="inline-block mt-4 text-sm text-blue-400 hover:underline"
          >
            Buy more credits
          </a>
        )}
      </div>
    </div>
  );
}
