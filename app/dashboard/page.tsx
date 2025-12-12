// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/providers";
import { supabaseBrowser } from "@/lib/supabaseClient";
import HistoryModal from "@/components/HistoryModal";

type ScriptItem = {
  id: string;
  type: string;
  text: string;
  created_at: string;
  credits_used?: number | null;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [recent, setRecent] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchUserData();
  }, [user]);

  async function fetchUserData() {
    setLoading(true);
    try {
      // fetch usage limits (assumes table 'usage_limits' exists)
      const { data: usage, error: usageErr } = await supabaseBrowser
        .from("usage_limits")
        .select("used_count, credits, premium")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!usageErr && usage) {
        setCredits(usage.credits ?? (usage.used_count ? 0 : 0));
      } else {
        setCredits(null);
      }

      // fetch recent scripts (assumes table 'generated_scripts')
      const { data: scripts, error: scriptsErr } = await supabaseBrowser
        .from("generated_scripts")
        .select("id,type,text,created_at,credits_used")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);

      if (!scriptsErr && scripts) {
        setRecent(scripts as ScriptItem[]);
      } else {
        setRecent([]);
      }
    } catch (err) {
      console.error("fetchUserData error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-white/70 mt-1">Welcome back{user?.email ? ` — ${user.email}` : ""}.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-white/70">Credits</div>
            <div className="text-2xl font-semibold">{credits ?? "—"}</div>
            <div className="text-xs text-white/50">Credits remain until exhausted</div>
          </div>

          <button
            onClick={() => setShowHistory(true)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            History
          </button>
        </div>
      </div>

      <section className="bg-[#0f1a35] p-6 rounded-xl border border-white/10">
        <h2 className="font-semibold text-lg mb-3">Recent scripts</h2>

        {loading && <p className="text-sm text-white/60">Loading…</p>}

        {!loading && recent.length === 0 && (
          <p className="text-sm text-white/60">No scripts yet — create one from Generate.</p>
        )}

        <div className="space-y-4">
          {recent.map((s) => (
            <div key={s.id} className="p-4 rounded-lg bg-[#081224] border border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-white/70">{s.type}</div>
                  <div className="text-white/90 mt-2 whitespace-pre-wrap">{s.text}</div>
                </div>
                <div className="text-xs text-white/50 text-right">
                  <div>{new Date(s.created_at).toLocaleString()}</div>
                  {s.credits_used != null && <div className="mt-1">Credits: {s.credits_used}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={() => setShowHistory(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#21D4FD] to-[#B721FF] text-black font-semibold"
          >
            View full history
          </button>
        </div>
      </section>

      {showHistory && <HistoryModal onClose={() => setShowHistory(false)} userId={user?.id} />}
    </div>
  );
}
