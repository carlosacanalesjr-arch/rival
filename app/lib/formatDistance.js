// Shared "3.2K" / "5K" style compact formatting for multi-component challenge
// breakdowns (e.g. HYROX Engine's "Row 3.2K/5K"). Keeps that formatting logic in one
// place since both the accordion row and the detail page need to render it identically.
export function formatCompactDistance(value) {
  if (value >= 1000) {
    const k = value / 1000;
    return `${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return `${value}`;
}
