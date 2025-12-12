"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  async function sendMagic() {
    if (!email.includes("@")) return alert("Enter valid email");
    const res = await fetch("/api/auth/magiclink", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        redirectTo: (process.env.NEXT_PUBLIC_APP_URL || "https://zero-c-supa.vercel.app") + "/dashboard"
      })
    });
    const j = await res.json();
    if (res.ok) alert("Check your email for the magic link");
    else alert(j.error || "Failed to send");
  }

  return (
    <div>
      <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
      <button onClick={sendMagic}>Send magic link</button>
    </div>
  );
}
