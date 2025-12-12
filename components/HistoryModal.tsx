"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function HistoryModal({
  userId,
  onClose,
}: {
  userId: string;
  onClose: () => void;
}) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    supabaseBrowser()
      .from("generated_scripts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => setData(data || []));
  }, [userId]);

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="bg-[#0f1a35] p-5 rounded-xl w-full max-w-xl">
        <button onClick={onClose} className="float-right">✕</button>
        <h3 className="text-lg font-semibold mb-3">History</h3>

        {data.length === 0 && <p>No scripts yet</p>}
        {data.map((s) => (
          <div key={s.id} className="border p-2 rounded mb-2">
            <b>{s.type}</b>
            <p className="whitespace-pre-wrap">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
