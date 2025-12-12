"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import HistoryModal from "@/components/HistoryModal";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) loadCredits(data.user.id);
    });
  }, []);

  async function loadCredits(uid: string) {
    const { data } = await supabaseBrowser()
      .from("usage_limits")
      .select("credits")
      .eq("user_id", uid)
      .single();

    setCredits(data?.credits ?? 0);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="mt-4">
        <b>Credits:</b> {credits}
        {credits === 0 && (
          <Link href="/pricing" className="ml-3 text-blue-400">
            Buy more
          </Link>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={() => setShowHistory(true)}>View History</button>
        <Link href="/generator">Generate</Link>
      </div>

      {showHistory && user && (
        <HistoryModal userId={user.id} onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}
