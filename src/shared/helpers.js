export const fmt = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const shortDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const fullDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export const daysUntil = (dateStr) =>
  Math.max(0, Math.ceil((new Date(dateStr) - new Date()) / 86400000));

export const estimateTotal = (items) =>
  items.reduce((s, i) => s + i.qty * i.rate, 0);
