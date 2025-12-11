import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function POST(req: Request) {
  try {
    const { email, redirectTo } = await req.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

    // Ensure redirectTo is absolute and falls back to NEXT_PUBLIC_APP_URL
    const redirect = redirectTo || process.env.NEXT_PUBLIC_APP_URL || "";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirect
      }
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // NOTE: To change the email subject from "Supabase Auth" to "Zero Conflict AI":
    // Go to Supabase Console -> Authentication -> Templates -> Override email templates.
    // Edit the Magic Link template subject to "Zero Conflict AI" and save. This is the recommended approach.
    return NextResponse.json({ ok: true });
  } catch (err:any) {
    return NextResponse.json({ error: err?.message || "Bad request" }, { status: 400 });
  }
}