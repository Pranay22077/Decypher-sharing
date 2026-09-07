// Single source of truth for entity colours consumed by JS/SVG/three.js.
// Kept in sync with the --entity-* custom properties in src/index.css.
// Colour is SECONDARY encoding only: the type badge label (PER/ORG/TEL/…)
// carries identity, so the palette is restrained and institutional, never neon.

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
  person: "#12356b",
  case: "#0b2e63",
  org: "#b45309",
  organization: "#b45309",
  financial: "#b45309",
  phone: "#1a6e6e",
  comms: "#1a6e6e",
  account: "#175e8a",
  vehicle: "#5b6472",
  location: "#1a7a4c",
  event: "#6b7280",
};

// Institutional chrome / status tokens (mirror of index.css)
export const PALETTE = {
  primary: "#0b2e63",
  primaryHover: "#082049",
  accent: "#12448f",
  surface: "#fbfcfd",
  surface2: "#eef2f7",
  baseBg: "#e9edf2",
  textPrimary: "#14181f",
  textSecondary: "#45505f",
  textMuted: "#6b7684",
  borderSubtle: "#d3dae2",
  borderStrong: "#b3bdc9",
  saffron: "#FF9933",
  indiaGreen: "#138808",
  chakraBlue: "#000080",
  critical: "#b3261e",
  high: "#b45309",
  medium: "#a16207",
  success: "#1a7a4c",
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
