"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY = "rzp_live_RdjxnHnfeuUS06";

export default function PricingPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  function openRazorpay(amount: number, credits: number) {
    if (!userId) {
      alert("Please login to continue");
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: amount * 100, // INR → paise
      currency: "INR",
      name: "Zero Conflict AI",
      description: `${credits} credits purchase`,
      image: "/logo.png",

      // ✅ MOST IMPORTANT PART
      notes: {
        user_id: userId,
        credits: String(credits),
      },

      handler: function (response: any) {
        alert(
          "Payment successful ✅\nPayment ID: " +
            response.razorpay_payment_id
        );
        // Credits will be added via webhook
      },

      theme: {
        color: "#1e2a5a",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-white text-center">
        Simple, Transparent Pricing
      </h1>
      <p className="text-white/60 text-center mt-3">
        Buy credits once. Use them anytime until exhausted.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-12">

        {/* FREE */}
        <div className="bg-[#0f1a35] p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold text-white">Free</h3>
          <p className="text-3xl font-bold text-white mt-2">₹0</p>
          <p className="text-white/60 mt-2">3 Scripts</p>
          <button
            disabled
            className="mt-6 w-full py-2 rounded bg-white/20 text-white/40"
          >
            Included
          </button>
        </div>

        {/* ₹199 */}
        <div className="bg-[#0f1a35] p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold text-white">Starter</h3>
          <p className="text-3xl font-bold text-white mt-2">₹199</p>
          <p className="text-white/60 mt-2">50 Scripts</p>
          <button
            onClick={() => openRazorpay(199, 50)}
            className="mt-6 w-full py-2 rounded bg-white text-black hover:bg-white/90"
          >
            Buy 50 Credits
          </button>
        </div>

        {/* ₹499 */}
        <div className="bg-[#0f1a35] p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold text-white">Pro</h3>
          <p className="text-3xl font-bold text-white mt-2">₹499</p>
          <p className="text-white/60 mt-2">500 Scripts</p>
          <button
            onClick={() => openRazorpay(499, 500)}
            className="mt-6 w-full py-2 rounded bg-white text-black hover:bg-white/90"
          >
            Buy 500 Credits
          </button>
        </div>

        {/* ₹1999 */}
        <div className="bg-[#0f1a35] p-6 rounded-xl border border-white/10 md:col-span-3">
          <h3 className="text-xl font-semibold text-white">Unlimited</h3>
          <p className="text-3xl font-bold text-white mt-2">₹1999</p>
          <p className="text-white/60 mt-2">Unlimited Scripts</p>
          <button
            onClick={() => openRazorpay(1999, 999999)}
            className="mt-6 w-full py-3 rounded bg-white text-black hover:bg-white/90"
          >
            Go Unlimited 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
