/**
 * A rotating set of solid accent colors for icon badges/tiles across
 * content grids (guides, principles, tips, etc.) so different items are
 * visually distinct instead of every badge reusing the same primary color.
 */
export const ACCENT_COLORS = [
  { bg: "bg-primary", fg: "text-primary-foreground" },
  { bg: "bg-pink", fg: "text-pink-foreground" },
  { bg: "bg-orange", fg: "text-orange-foreground" },
  { bg: "bg-blue-500", fg: "text-white" },
  { bg: "bg-emerald-500", fg: "text-white" },
] as const;

export function getAccentColor(index: number) {
  return ACCENT_COLORS[index % ACCENT_COLORS.length]!;
}
