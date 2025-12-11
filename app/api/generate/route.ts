import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const OPENAI_KEY = process.env.OPENAI_API_KEY || "";

export async function POST(req: Request) {
  try {
    const { email, situation, between, mode, extra } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Ensure user exists
    let user = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1)
      .maybeSingle();

    if (user.error) throw user.error;

    let userId = user.data?.id;

    if (!userId) {
      const inserted = await supabase
        .from("users")
        .insert({ email })
        .select("id")
        .maybeSingle();

      if (inserted.error) throw inserted.error;
      userId = inserted.data.id;

      await supabase
        .from("usage_limits")
        .insert({ user_id: userId, used_count: 0 });
    }

    const usageRes = await supabase
      .from("usage_limits")
      .select("used_count,premium")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (usageRes.error) throw usageRes.error;

    const used = usageRes.data?.used_count ?? 0;
    const isPremium = usageRes.data?.premium ?? false;

    if (!isPremium && used >= 3) {
      return NextResponse.json(
        { error: "Trial limit reached. Purchase Premium at KryptonPath.com" },
        { status: 403 }
      );
    }

    let script = "";

    if (OPENAI_KEY) {
      try {
        const OpenAI = (await import("openai")).default;
        const client = new OpenAI({ apiKey: OPENAI_KEY });

        const prompt = `Write a calm, solution-focused, non-blaming communication. Situation: ${situation} Between: ${between} Mode: ${mode} Extra: ${extra}. Respond as a ready-to-send ${mode} message.`;

        const res = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 400
        });

        script = res.choices?.[0]?.message?.content?.trim() ?? "";
      } catch (err) {
        console.error("OpenAI error", err);
      }
    }

    if (!script) {
      script = `Dear ${between},

I wanted to raise a concern about ${situation}. ${extra || ""}

My intention is to resolve this constructively, and I'm open to your perspective as well.

Thanks and regards,
[Your Name]`;
    }

    await supabase
      .from("usage_limits")
      .update({
        used_count: used + 1,
        last_used: new Date().toISOString()
      })
      .eq("user_id", userId);

    return NextResponse.json({ script });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}