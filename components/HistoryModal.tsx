"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type ScriptItem = {
  id: string;
  prompt: string;
  response: string;
  created_at: string;
};

export default function HistoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [items, setItems] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function loadHistory() {
      setLoading(true);

      const supabase = supabaseBrowser();

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setItems([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("script_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setItems(data);
      }

      setLoading(false);
    }

    loadHistory();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex justify-center items-center z-50">
      <div className="bg-[#0f1a35] p-6 rounded-xl w-full max-w-lg border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Your Script History</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">✕</button>
        </div>

        {loading ? (
          <p className="text-white/60">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-white/60">No past scripts found.</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="p-3 rounded bg-[#1b2a4b] border border-white/10">
                <p className="text-xs text-white/40">{new Date(item.created_at).toLocaleString()}</p>
                <p className="text-white/80 mt-1 font-medium">Prompt:</p>
                <p className="text-white/60 text-sm">{item.prompt}</p>
                <p className="text-white/80 mt-2 font-medium">Response:</p>
                <p className="text-white/60 text-sm whitespace-pre-line">{item.response}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
