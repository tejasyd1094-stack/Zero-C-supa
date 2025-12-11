import { NextResponse } from "next/server";

export async function GET() {
  try {
    const key = process.env.OPENAI_API_KEY || "";
    if (!key) return NextResponse.json({ ok: false, error: "No OPENAI_API_KEY set" }, { status: 400 });

    // minimal check: call models.list or a small completion
    // use dynamic import to avoid bundling
    const OpenAI = (await import("openai")).default;
    const client = new OpenAI({ apiKey: key });

    // Try a very small chat completion
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Say hi" }],
      max_tokens: 5
    });

    if (res?.choices?.[0]?.message?.content) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "No response" }, { status: 500 });
  } catch (err:any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}