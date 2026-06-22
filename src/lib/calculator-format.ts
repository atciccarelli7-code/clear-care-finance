export const parseCalculatorValue = (value: string) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatCurrency = (value: number, maximumFractionDigits = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(Number.isFinite(value) ? value : 0);

export const formatPercent = (value: number, maximumFractionDigits = 1) =>
  new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits,
  }).format((Number.isFinite(value) ? value : 0) / 100);

export const formatMonths = (value: number | null) => {
  if (value === null) return "Add a monthly savings amount";
  if (value === 0) return "Goal reached";
  return `${Math.ceil(value)} ${Math.ceil(value) === 1 ? "month" : "months"}`;
};
