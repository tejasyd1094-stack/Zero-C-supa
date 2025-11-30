export function formatLocalized(amountINR:number) {
  try {
    const locale = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().locale : 'en-IN';
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'INR', maximumFractionDigits:0 }).format(amountINR);
  } catch {
    return `₹${amountINR}`;
  }
}
