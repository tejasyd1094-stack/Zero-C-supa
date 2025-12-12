"use client";

import { useState } from "react";

export default function GeneratorPage() {
  const [form, setForm] = useState({
    situation: "",
    role: "friend",
    mode: "message",
    behaviour: "",
  });
  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    const requestId = crypto.randomUUID();

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, requestId }),
    });

    const data = await res.json();
    setScripts(data.scripts || []);
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <textarea
        placeholder="Describe the situation"
        className="w-full p-3 mb-3"
        onChange={(e) => setForm({ ...form, situation: e.target.value })}
      />

      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      <div className="mt-6 space-y-3">
        {scripts.map((s, i) => (
          <div key={i} className="border p-3 rounded">
            <b>{s.type}</b>
            <p className="whitespace-pre-wrap">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
