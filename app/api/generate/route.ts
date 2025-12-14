import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();

    // ✅ AUTH CHECK (THIS WAS BROKEN EARLIER)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ CREDIT CHECK
    const { data: usage, error: usageError } = await supabase
      .from("usage_limits")
      .select("used_count, max_credits")
      .eq("user_id", user.id)
      .single();

    if (usageError || !usage) {
      return NextResponse.json(
        { error: "Usage record not found" },
        { status: 400 }
      );
    }

    if (usage.used_count >= usage.max_credits) {
      return NextResponse.json(
        { error: "No credits left" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { prompt } = body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message.content;

    // ✅ SAVE SCRIPT
    await supabase.from("generated_scripts").insert({
      user_id: user.id,
      content: result,
    });

    // ✅ UPDATE CREDITS
    await supabase
      .from("usage_limits")
      .update({ used_count: usage.used_count + 1 })
      .eq("user_id", user.id);

    return NextResponse.json({ result });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
