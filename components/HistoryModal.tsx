"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

type ScriptItem = {
  id: string;
  created_at: string;
  scripts: any;
};

export default function HistoryModal({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const [items, setItems] = useState<ScriptItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function loadHistory() {
      setLoading(true);

      const { data, error } = await supabaseBrowser
        .from("generated_scripts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setItems(data);
      }

      setLoading(false);
    }

    loadHistory();
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#0f1a35] w-full max-w-2xl rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">
            Script History
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <p className="text-white/60 text-sm">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-white/60 text-sm">
            No scripts generated yet.
          </p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-black/30 rounded-lg p-4 text-sm text-white/80"
              >
                <div className="text-xs text-white/40 mb-2">
                  {new Date(item.created_at).toLocaleString()}
                </div>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(item.scripts, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
