"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";

export default function GeneratorPage() {
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [situation, setSituation] = useState("");
  const [role, setRole] = useState("Employee");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  // ✅ ALWAYS TRUST SUPABASE COOKIES
  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setCheckingAuth(false);
    });
  }, []);

  const handleGenerate = async () => {
    if (!user) {
      setError("Please log in to generate scripts.");
      return;
    }

    if (!situation.trim()) {
      setError("Please describe the situation.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          situation,
          role,
          tone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate script");
      }

      setResult(data.script);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔒 Auth check state
  if (checkingAuth) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Checking login…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px" }}>
      <h1>Zero Conflict Script Generator</h1>

      <label>Describe the situation</label>
      <textarea
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        rows={6}
        style={{ width: "100%", marginBottom: "20px" }}
      />

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div>
          <label>Your Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option>Employee</option>
            <option>Manager</option>
            <option>Founder</option>
            <option>HR</option>
          </select>
        </div>

        <div>
          <label>Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option>Professional</option>
            <option>Calm</option>
            <option>Assertive</option>
            <option>Friendly</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          padding: "10px 20px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Script"}
      </button>

      {/* ❌ Auth / validation errors */}
      {error && (
        <p style={{ color: "red", marginTop: "15px" }}>
          {error}
        </p>
      )}

      {/* ✅ Result */}
      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>Generated Script</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{result}</pre>
        </div>
      )}
    </div>
  );
}
