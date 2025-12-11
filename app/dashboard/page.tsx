"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [trialsLeft, setTrialsLeft] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const email = localStorage.getItem("zc_email") || "";
      if (!email) {
        setTrialsLeft(3);
        return;
      }
      const res = await fetch("/api/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const j = await res.json();
        setTrialsLeft(Math.max(0, 3 - (j.count || 0)));
      }
    })();
  }, []);

  return (
    <div className="py-12 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-4">
        Free trials left: {trialsLeft === null ? "…" : trialsLeft}
      </div>
    </div>
  );
}