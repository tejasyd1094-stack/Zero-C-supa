"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";


export default function DashboardPage() {
  const [credits, setCredits] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  /* -----------------------------
     1. LOAD USER + INITIAL CREDITS
  ------------------------------ */
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabaseBrowser.auth.getUser();
      if (!data.user) return;

      setUserId(data.user.id);

      const { data: usage } = await supabaseBrowser
        .from("usage_limits")
        .select("used_count, max_credits")
        .eq("user_id", data.user.id)
        .single();

      if (usage) {
        setCredits(usage.max_credits - usage.used_count);
      }
    };

    loadUser();
  }, []);

  /* -----------------------------
     2. REAL-TIME CREDIT UPDATES
  ------------------------------ */
  useEffect(() => {
    if (!userId) return;

    const channel = supabaseBrowser
      .channel("usage-realtime")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "usage_limits",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newCredits =
            payload.new.max_credits - payload.new.used_count;
          setCredits(newCredits);
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [userId]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>

      <div className="bg-[#0f1a35] p-4 rounded-xl border border-white/10">
        <p className="text-white/70 text-sm">Credits Available</p>
        <p className="text-3xl font-bold text-white">{credits}</p>

        {credits === 0 && (
          <a
            href="/pricing"
            className="inline-block mt-4 text-purple-400 underline"
          >
            Buy more credits
          </a>
        )}
      </div>
    </div>
  );
}
