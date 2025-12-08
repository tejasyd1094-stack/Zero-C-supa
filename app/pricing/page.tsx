import { formatCurrency } from "@/lib/currency";

export default function PricingPage() {
  const basic = formatCurrency(499);
  const pro = formatCurrency(999);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Pricing</h1>

      <div style={{ marginTop: "1rem" }}>
        <h2>Basic Plan</h2>
        <p>{basic}</p>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h2>Pro Plan</h2>
        <p>{pro}</p>
      </div>
    </div>
  );
}