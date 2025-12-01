export function getCurrency(countryCode: string) {
  const map: any = {
    IN: "₹",
    US: "$",
    GB: "£",
    EU: "€",
    AU: "A$",
    CA: "C$",
  };

  return map[countryCode] || "$";
}