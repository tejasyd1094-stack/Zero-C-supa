"use client";

import { useMemo } from "react";
import GradientButton from "@/components/GradientButton";
import { formatLocalCurrency } from "@/lib/currency";

const plans = [
  { id: "free", title: "Free", desc: "3 scripts to try", priceINR: 0 },
  { id: "p199", title: "50 scripts", desc: "50 scripts / month", priceINR: 199 },
  { id: "p499", title: "500 scripts", desc: "500 scripts / month", priceINR: 499 },
  { id: "p1999", title: "Unlimited", desc: "Unlimited scripts / month", priceINR: 1999 },
];

export default function PricingPage() {
  const displayPlans = useMemo(() => plans, []);

  function openRazorpay(amountINR: number, planId: string) {
    // amountINR is in rupees; razorpay expects paise
    const key = "rzp_live_RdjxnHnfeuUS06"; // provided public key
    const options:any = {
      key,
      amount: amountINR * 100,
      currency: "INR",
      name: "Zero Conflict",
      description: `Purchase ${planId}`,
      handler: function (response:any){
        // Normally you'd verify the payment server-side. Here we display success.
        alert("Payment successful. Payment id: " + response.razorpay_payment_id);
      },
      prefill: {
        email: localStorage.getItem("zc_email") || "",
      }
    };
    // @ts-ignore
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }

  // load razorpay script once
  if (typeof window !== "undefined" && !(window as any).Razorpay) {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    document.head.appendChild(s);
  }

  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold">Pricing</h1>
      <p className="text-white/70 mt-2">Simple plans for individuals and teams.</p>

      <div className="mt-8 grid md:grid-cols-4 gap-6">
        {displayPlans.map((p) => (
          <div key={p.id} className="bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-semibold">{p.title}</h3>
            <p className="mt-2 text-white/70">{p.desc}</p>
            <div className="mt-4 text-2xl font-bold">{formatLocalCurrency(p.priceINR)}</div>

            <div className="mt-6">
              {p.priceINR === 0 ? (
                <GradientButton>Get Started (Free)</GradientButton>
              ) : (
                <GradientButton onClick={() => openRazorpay(p.priceINR, p.id)}>
                  Buy — {formatLocalCurrency(p.priceINR)}
                </GradientButton>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}