import { formatCurrency } from "@/lib/currency";

export default function PricingPage() {
  return (
    <main className="flex flex-col items-center min-h-screen p-8">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="text-gray-600 mt-2">
          Choose a plan that fits your communication needs.
        </p>
      </header>

      {/* Pricing Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        
        {/* Free Plan */}
        <div className="border rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">Free</h2>
          <p className="text-gray-600 mb-4">
            Basic conflict-resolution scripts.
          </p>

          <p className="text-3xl font-bold mb-6">{formatCurrency(0)}</p>

          <ul className="text-gray-600 space-y-2 leading-relaxed flex-grow">
            <li>✔ 10 scripts per month</li>
            <li>✔ Basic tones (formal / neutral)</li>
            <li>✔ Email / Chat export</li>
          </ul>

          <button className="mt-6 w-full bg-gray-900 text-white py-2 rounded-lg hover:opacity-80 transition">
            Get Started
          </button>
        </div>

        {/* Pro Plan */}
        <div className="border rounded-xl p-6 shadow-lg bg-blue-50 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">Pro</h2>
          <p className="text-gray-700 mb-4">
            Advanced communication options for professionals.
          </p>

          <p className="text-3xl font-bold mb-6">{formatCurrency(499)}</p>

          <ul className="text-gray-700 space-y-2 leading-relaxed flex-grow">
            <li>✔ Unlimited scripts</li>
            <li>✔ Role-based tonality</li>
            <li>✔ Workplace scenario templates</li>
            <li>✔ Priority export formatting</li>
          </ul>

          <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:opacity-80 transition">
            Upgrade to Pro
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="border rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">Enterprise</h2>
          <p className="text-gray-600 mb-4">
            For teams that need organization-wide clarity.
          </p>

          <p className="text-3xl font-bold mb-6">Custom</p>

          <ul className="text-gray-600 space-y-2 leading-relaxed flex-grow">
            <li>✔ Admin dashboard</li>
            <li>✔ Team collaboration</li>
            <li>✔ Customized tone & templates</li>
            <li>✔ SLA + Priority Support</li>
          </ul>

          <button className="mt-6 w-full bg-black text-white py-2 rounded-lg hover:opacity-80 transition">
            Contact Sales
          </button>
        </div>

      </section>

      {/* Footer */}
      <footer className="mt-14 text-sm text-gray-500">
        © {new Date().getFullYear()} Zero-Conflict. All rights reserved.
      </footer>

    </main>
  );
}