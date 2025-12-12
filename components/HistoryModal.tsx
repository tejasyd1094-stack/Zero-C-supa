// components/HistoryModal.tsx
"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

type ScriptItem = {
  id: string;
  type: string;
  text: string;
  created_at: string;
  credits_used?: number | null;
};

export default function HistoryModal({ onClose, userId }: { onClose: () => void; userId?: string }) {
  const [items, setItems] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchHistory();
  }, [userId]);

  async function fetchHistory() {
    setLoading(true);
    try {
      const { data, error } = await supabaseBrowser
        .from("generated_scripts")
        .select("id,type,text,created_at,credits_used")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error("fetchHistory err", err);
    } finally {
      setLoading(false);
    }
  }

  function copyText(txt: string) {
    navigator.clipboard.writeText(txt);
    alert("Copied!");
  }

  function shareText(txt: string) {
    if (navigator.share) {
      navigator.share({ title: "Script", text: txt });
    } else {
      alert("Sharing not supported on this device");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl bg-[#071224] rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Script History</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1 rounded bg-white/10">Close</button>
          </div>
        </div>

        {loading && <p className="text-white/60">Loading…</p>}

        {!loading && items.length === 0 && <p className="text-white/60">No history found.</p>}

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {items.map((it) => (
            <div key={it.id} className="p-3 rounded-lg bg-[#0b1628] border border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-white/60">{it.type} • {new Date(it.created_at).toLocaleString()}</div>
                  <div className="mt-2 text-white/90 whitespace-pre-wrap">{it.text}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-xs text-white/50">Credits: {it.credits_used ?? "-"}</div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => copyText(it.text)} className="px-2 py-1 rounded bg-white/10 text-sm">Copy</button>
                    <button onClick={() => shareText(it.text)} className="px-2 py-1 rounded bg-white/10 text-sm">Share</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
