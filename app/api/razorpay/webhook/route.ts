import { NextRequest } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature")!;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  // Only process successful payments
  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;

    const userId = payment.notes?.user_id;
    const credits = Number(payment.notes?.credits || 0);

    if (userId && credits > 0) {
      await supabase.rpc("add_credits", {
        uid: userId,
        amount: credits,
      });
    }
  }

  return new Response("OK", { status: 200 });
}