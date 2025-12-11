import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ count: 0 });

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

    const userRes = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1)
      .maybeSingle();
    if (userRes.error) throw userRes.error;
    if (!userRes.data) return NextResponse.json({ count: 0 });

    const usage = await supabase
      .from("usage_limits")
      .select("used_count")
      .eq("user_id", userRes.data.id)
      .limit(1)
      .maybeSingle();

    if (usage.error) throw usage.error;

    return NextResponse.json({ count: usage.data?.used_count ?? 0 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}