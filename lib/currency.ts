export function formatLocalCurrency(amountINR: number) {
  try {
    // Best-effort mapping for common locales -> currency
    const locale = (typeof navigator !== "undefined" && (navigator as any).language) || "en-IN";
    const country = locale.split("-")[1] || "IN";

    const mapping: Record<string,string> = {
      IN: "INR", US: "USD", GB: "GBP", AU: "AUD", CA: "CAD",
      EU: "EUR", SG: "SGD", AE: "AED", SA: "SAR", JP: "JPY"
    };

    const currency = mapping[country.toUpperCase()] || "INR";

    // approximate conversion rates (for display only): INR -> currency.
    // NOTE: For production use a live FX API. These are conservative placeholders.
    const rates: Record<string, number> = {
      INR: 1,
      USD: 0.012,
      GBP: 0.0096,
      EUR: 0.011,
      AUD: 0.018,
      CAD: 0.016,
      SGD: 0.016,
      AED: 0.044,
      SAR: 0.044,
      JPY: 1.8
    };

    const converted = Math.round((amountINR * (rates[currency] || 1)) * 100) / 100;

    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(converted);
  } catch {
    return `₹${amountINR}`;
  }
}