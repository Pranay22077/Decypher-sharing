// Single source of truth for entity colours consumed by JS/SVG/three.js.
// Kept in sync with the --entity-* custom properties in src/index.css.
// The palette adapts to the current theme via CSS variables where possible;
// these JS constants are the dark-mode defaults for Three.js rendering.

export type EntityType =
  | "person"
  | "case"
  | "org"
  | "financial"
  | "phone"
  | "account"
  | "vehicle"
  | "location"
  | "event";

export const ENTITY_COLORS: Record<string, string> = {
  person: "#3b82f6",
  case: "#8b5cf6",
  org: "#f59e0b",
  organization: "#f59e0b",
  financial: "#f59e0b",
  phone: "#14b8a6",
  comms: "#14b8a6",
  account: "#0ea5e9",
  vehicle: "#94a3b8",
  location: "#22c55e",
  event: "#64748b",
};

// Dark-mode palette tokens (mirror of index.css dark defaults)
export const PALETTE = {
  primary: "#3b82f6",
  primaryHover: "#60a5fa",
  accent: "#2563eb",
  surface: "#030712",
  surface2: "#1f2937",
  baseBg: "#030712",
  textPrimary: "#f8fafc",
  textSecondary: "#94a3b8",
  textMuted: "#475569",
  borderSubtle: "#1e293b",
  borderStrong: "#334155",
  saffron: "#FF9933",
  indiaGreen: "#138808",
  chakraBlue: "#000080",
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  success: "#22c55e",
} as const;

export function entityColor(type: string | undefined): string {
  if (!type) return PALETTE.textMuted;
  return ENTITY_COLORS[type.toLowerCase()] ?? PALETTE.textMuted;
}

// Short type badge codes used as the primary (non-colour) identity encoding.
export const ENTITY_BADGE: Record<string, string> = {
  person: "PER",
  case: "CAS",
  org: "ORG",
  organization: "ORG",
  financial: "FIN",
  phone: "TEL",
  comms: "TEL",
  account: "ACC",
  vehicle: "VEH",
  location: "GEO",
  event: "EVT",
};

export function entityBadge(type: string | undefined): string {
  if (!type) return "ENT";
  return ENTITY_BADGE[type.toLowerCase()] ?? type.slice(0, 3).toUpperCase();
}
