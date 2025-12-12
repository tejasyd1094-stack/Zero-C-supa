"use client";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RAZORPAY_KEY = "rzp_live_RdjxnHnfeuUS06";

function openRazorpay(amount: number, credits: string) {
  const options = {
    key: RAZORPAY_KEY,
    amount: amount * 100, // INR → paise
    currency: "INR",
    name: "Zero Conflict AI",
    description: `${credits} credits purchase`,
    image: "/logo.png",
    handler: function (response: any) {
      alert("Payment successful ✅\nPayment ID: " + response.razorpay_payment_id);
      // Later: call API to add credits
    },
    prefill: {
      email: "",
    },
    theme: {
      color: "#1e2a5a",
    },
    notes: {
      source: "pricing_page",
    },
    modal: {
      ondismiss: function () {
        console.log("Checkout closed");
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-white text-center">
        Simple, Transparent Pricing
      </h1>
      <p className="text-white/60 text-center mt-3">
        Credits never expire. Use them anytime until exhausted.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-12">

        {/* FREE */}
        <div className="bg-[#0f1a35] p-6 rounded-xl border border-white/10">
          <h3 className="text-xl font-semibold text-white">Free</h3>
          <p className="text-3xl font-bold text-white mt-2">₹0</p>
          <p className="text-white/60 mt-2">3 Scripts</p>
          <ul className="text-white/70 mt-4 space-y-2 text-sm">
            <li>• Empathetic</li>
            <li>• Bold</li>
            <li>• Clever</li>
          </ul>
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
            onClick={() => openRazorpay(199, "50")}
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
            onClick={() => openRazorpay(499, "500")}
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
            onClick={() => openRazorpay(1999, "Unlimited")}
            className="mt-6 w-full py-3 rounded bg-white text-black hover:bg-white/90"
          >
            Go Unlimited 🚀
          </button>
        </div>

      </div>
    </div>
  );
}
