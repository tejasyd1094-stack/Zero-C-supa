"use client";

import GradientButton from "@/components/GradientButton";
import { formatCurrency } from "@/lib/currency";

export default function PricingPage() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold">Pricing</h1>
      <p className="text-white/70 mt-2">
        Simple plans for professionals and teams.
      </p>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold">Free</h3>
          <p className="mt-2">3 AI scripts to test the app.</p>
          <div className="mt-4 text-2xl font-bold">{formatCurrency(0)}</div>
          <GradientButton className="mt-6">Try Now</GradientButton>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold">Pro</h3>
          <p className="mt-2">Unlimited script generation.</p>
          <div className="mt-4 text-2xl font-bold">{formatCurrency(399)}</div>
          <GradientButton className="mt-6">Upgrade</GradientButton>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold">Enterprise</h3>
          <p className="mt-2">For teams and organisations.</p>
          <div className="mt-4 text-2xl font-bold">Custom</div>
          <GradientButton className="mt-6">Contact Sales</GradientButton>
        </div>
      </div>
    </div>
  );
}