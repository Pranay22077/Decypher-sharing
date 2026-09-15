export type EntityType = "person" | "org" | "phone" | "vehicle" | "location" | "account" | "case" | "event";

export interface GraphNode {
  id: string;
  label: string;
  type: EntityType;
  x: number;
  y: number;
  highlighted?: boolean;
  data?: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  weight?: number;
  confidence?: number;
  evidenceIds?: string[];
}

export interface Person {
  id: string;
  name: string;
  alias: string[];
  dob: string;
  address: string;
  phones: string[];
  vehicles: string[];
  associates: string[];
  organizations: string[];
  cases: string[];
  risk: "high" | "medium" | "low";
  photo: string;
  role: string;
  financialFlag: boolean;
  communicationFlag: boolean;
  notes: string;
}

export interface Case {
  id: string;
  title: string;
  type: string;
  status: "active" | "pending" | "closed";
  priority: "high" | "medium" | "low";
  date: string;
  location: string;
  description: string;
  assignedTo: string;
  entities: number;
  alerts: number;
  lastUpdated: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: "call" | "transaction" | "meeting" | "sighting" | "crime" | "report" | "media" | "travel";
  title: string;
  description: string;
  entities: string[];
  location?: string;
  source: string;
  confidence: "confirmed" | "probable" | "unverified";
}

export interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  entity: string;
  timestamp: string;
  reason: string;
  normal: string;
  observed: string;
}

export interface EvidenceItem {
  id: string;
  type: "document" | "video" | "audio" | "image" | "data" | "report";
  title: string;
  source: string;
  date: string;
  caseId: string;
  size: string;
  hash: string;
  uploadedBy: string;
  status: "processed" | "processing" | "pending";
  entities: string[];
}

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: string;
  method: string;
  flagged: boolean;
  reason?: string;
}

// ─── CASES ────────────────────────────────────────────────────────────────────
export const cases: Case[] = [
  {
    id: "CASE-2026-017",
    title: "Operation Nightfall",
    type: "Evidence Intelligence / Financial Trail",
    status: "active",
    priority: "high",
    date: "2026-01-14",
    location: "Delhi NCR",
    description: "Fictional demonstration connecting a call record, vehicle sighting, financial transfer and cross-case bridge. Every lead is traceable to synthetic evidence.",
    assignedTo: "Investigator Aditi Rao",
    entities: 11,
    alerts: 1,
    lastUpdated: "2026-09-05 14:32",
  },
  {
    id: "CASE-2026-031",
    title: "Operation Vega",
    type: "Drug Trafficking",
    status: "active",
    priority: "high",
    date: "2026-02-22",
    location: "Rajasthan / Punjab",
    description: "Cross-border drug trafficking ring with 4 identified suspects. Vehicle movement patterns correlate with supply drop points.",
    assignedTo: "Sr. Insp. P. Verma",
    entities: 21,
    alerts: 3,
    lastUpdated: "2026-09-04 09:15",
  },
  {
    id: "CASE-2026-008",
    title: "Operation Trident",
    type: "Cyber Fraud",
    status: "active",
    priority: "medium",
    date: "2025-11-03",
    location: "Hyderabad / Chennai",
    description: "Organized cyber fraud targeting banking customers. OSINT revealed coordinated social media infrastructure.",
    assignedTo: "Insp. A. Kulkarni",
    entities: 18,
    alerts: 2,
    lastUpdated: "2026-09-03 17:45",
  },
  {
    id: "CASE-2025-099",
    title: "Operation Falcon",
    type: "Arms Smuggling",
    status: "pending",
    priority: "medium",
    date: "2025-08-17",
    location: "Gujarat Coast",
    description: "Suspected arms smuggling via coastal route. Three persons of interest identified through CDR analysis.",
    assignedTo: "Insp. M. Nair",
    entities: 14,
    alerts: 1,
    lastUpdated: "2026-08-30 11:20",
  },
  {
    id: "CASE-2025-056",
    title: "Operation Meridian",
    type: "Money Laundering",
    status: "closed",
    priority: "low",
    date: "2025-05-09",
    location: "Mumbai",
    description: "Real-estate money laundering case. 2 convictions. Case closed.",
    assignedTo: "Sr. Insp. D. Joshi",
    entities: 9,
    alerts: 0,
    lastUpdated: "2026-01-20 09:00",
  },
];

// ─── PERSONS ──────────────────────────────────────────────────────────────────
export const persons: Person[] = [
  {
    id: "PERSON-P001",
    name: "Raj Mehta",
    alias: ["Raj", "R. Mehta"],
    dob: "1981-03-14",
    address: "Saket, New Delhi",
    phones: ["PHONE-9810XXXX", "PHONE-9971XXXX"],
    vehicles: ["VEH-DL01-CA-XXXX"],
    associates: ["PERSON-P002", "PERSON-P004", "PERSON-P006"],
    organizations: ["ORG-042", "ORG-007"],
    cases: ["CASE-2026-017", "CASE-2025-056"],
    risk: "high",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    role: "Primary Entity: Suspected Network Coordinator",
    financialFlag: true,
    communicationFlag: true,
    notes: "Shows unusually high CDR activity during late-night hours. 3 phones registered in different names. Financial transactions to multiple accounts flagged.",
  },
  {
    id: "PERSON-P002",
    name: "Arjun Verma",
    alias: ["Arjun", "A. Verma"],
    dob: "1986-07-22",
    address: "Andheri West, Mumbai",
    phones: ["PHONE-9920XXXX"],
    vehicles: ["VEH-MH04-XX-XXXX"],
    associates: ["PERSON-P001", "PERSON-P003"],
    organizations: ["ORG-042"],
    cases: ["CASE-2026-017"],
    risk: "high",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    role: "Financial Intermediary",
    financialFlag: true,
    communicationFlag: false,
    notes: "Multiple transactions traced through ACCT-B1. Frequent travel between Delhi and Mumbai.",
  },
  {
    id: "PERSON-P003",
    name: "Neha Kapoor",
    alias: ["Neha", "N. Kapoor"],
    dob: "1990-11-05",
    address: "Koramangala, Bengaluru",
    phones: ["PHONE-9845XXXX", "PHONE-8970XXXX"],
    vehicles: ["VEH-KA05-MX-XXXX"],
    associates: ["PERSON-P002", "PERSON-P005"],
    organizations: ["ORG-117"],
    cases: ["CASE-2026-017", "CASE-2026-008"],
    risk: "medium",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    role: "IT Infrastructure Provider",
    financialFlag: false,
    communicationFlag: true,
    notes: "Appears in CDR records with Arjun Verma. Maintains servers potentially used for communication.",
  },
  {
    id: "PERSON-P004",
    name: "Vikram Singh",
    alias: ["Vikram", "V. Singh"],
    dob: "1975-01-30",
    address: "Lajpat Nagar, New Delhi",
    phones: ["PHONE-9899XXXX"],
    vehicles: ["VEH-DL07-CX-XXXX", "VEH-DL12-AX-XXXX"],
    associates: ["PERSON-P001", "PERSON-P006"],
    organizations: ["ORG-007"],
    cases: ["CASE-2026-017"],
    risk: "high",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    role: "Logistics Coordinator",
    financialFlag: true,
    communicationFlag: true,
    notes: "Two vehicles. Sighted at LOCATION-05 multiple times. Heavy cash transactions.",
  },
  {
    id: "PERSON-P005",
    name: "Person-E",
    alias: ["Echo"],
    dob: "1993-05-18",
    address: "Anna Nagar, Chennai",
    phones: ["PHONE-9444XXXX"],
    vehicles: [],
    associates: ["PERSON-P003"],
    organizations: ["ORG-117"],
    cases: ["CASE-2026-008"],
    risk: "medium",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    role: "Peripheral Associate",
    financialFlag: false,
    communicationFlag: false,
    notes: "Identified from document analysis. Role not fully established.",
  },
  {
    id: "PERSON-P006",
    name: "Vikram Singh",
    alias: ["Foxtrot"],
    dob: "1984-09-12",
    address: "Jaipur, Rajasthan",
    phones: ["PHONE-9414XXXX", "PHONE-9828XXXX"],
    vehicles: ["VEH-RJ14-XC-XXXX"],
    associates: ["PERSON-P001", "PERSON-P004"],
    organizations: ["ORG-042"],
    cases: ["CASE-2026-017", "CASE-2026-031"],
    risk: "high",
    photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop",
    role: "Bridge Entity: Connects 2 separate groups",
    financialFlag: true,
    communicationFlag: true,
    notes: "Appears in two separate cases as a connecting entity. High-value transactions. Classified bridge node.",
  },
];

// ─── GRAPH NODES ──────────────────────────────────────────────────────────────
export const graphNodes: GraphNode[] = [
  { id: "PERSON-P001", label: "Raj Mehta", type: "person", x: 400, y: 280, highlighted: true },
  { id: "PERSON-P002", label: "Arjun Verma", type: "person", x: 230, y: 160 },
  { id: "PERSON-P003", label: "Neha Kapoor", type: "person", x: 130, y: 310 },
  { id: "PERSON-P004", label: "Vikram Singh", type: "person", x: 570, y: 160 },
  { id: "PERSON-P005", label: "Person-E", type: "person", x: 620, y: 340 },
  { id: "PERSON-P006", label: "Vikram Singh", type: "person", x: 310, y: 420 },
  { id: "ORG-042", label: "ORG-042", type: "org", x: 200, y: 260 },
  { id: "ORG-007", label: "ORG-007", type: "org", x: 540, y: 260 },
  { id: "ORG-117", label: "ORG-117", type: "org", x: 90, y: 420 },
  { id: "PHONE-9810XXXX", label: "PHONE-9810", type: "phone", x: 460, y: 160 },
  { id: "PHONE-9920XXXX", label: "PHONE-9920", type: "phone", x: 160, y: 80 },
  { id: "PHONE-9845XXXX", label: "PHONE-9845", type: "phone", x: 60, y: 230 },
  { id: "VEH-DL01", label: "VEH-DL01", type: "vehicle", x: 480, y: 390 },
  { id: "VEH-MH04", label: "VEH-MH04", type: "vehicle", x: 230, y: 50 },
  { id: "VEH-RJ14", label: "VEH-RJ14", type: "vehicle", x: 350, y: 490 },
  { id: "ACCT-B1", label: "ACCT-B1", type: "account", x: 130, y: 190 },
  { id: "ACCT-A2", label: "ACCT-A2", type: "account", x: 500, y: 80 },
  { id: "LOCATION-01", label: "LOCATION-01\nNew Delhi", type: "location", x: 380, y: 100 },
  { id: "LOCATION-02", label: "LOCATION-02\nMumbai", type: "location", x: 90, y: 130 },
  { id: "LOCATION-05", label: "LOCATION-05\nJaipur", type: "location", x: 620, y: 200 },
  { id: "CASE-2026-031", label: "CASE-2026-031", type: "case", x: 600, y: 440 },
  { id: "EVENT-012", label: "EVENT-012\nMeeting", type: "event", x: 310, y: 200 },
];

export const graphEdges: GraphEdge[] = [
  { id: "e1", source: "PERSON-P001", target: "PERSON-P002", label: "CALLED", weight: 3, confidence: .96, evidenceIds: ["EV-2026-0002"] },
  { id: "e2", source: "PERSON-P001", target: "PERSON-P004", label: "Called (31×)", weight: 3 },
  { id: "e3", source: "PERSON-P001", target: "PERSON-P006", label: "ASSOCIATED_WITH", weight: 2, confidence: .86, evidenceIds: ["EV-2026-0007"] },
  { id: "e4", source: "PERSON-P002", target: "PERSON-P003", label: "Called (12×)", weight: 2 },
  { id: "e5", source: "PERSON-P003", target: "PERSON-P005", label: "Associated", weight: 1 },
  { id: "e6", source: "PERSON-P004", target: "PERSON-P006", label: "Called (22×)", weight: 2 },
  { id: "e7", source: "PERSON-P001", target: "ORG-042", label: "Owns", weight: 2 },
  { id: "e8", source: "PERSON-P002", target: "ORG-042", label: "Director", weight: 2 },
  { id: "e9", source: "PERSON-P004", target: "ORG-007", label: "Linked", weight: 1 },
  { id: "e10", source: "PERSON-P003", target: "ORG-117", label: "Employed", weight: 1 },
  { id: "e11", source: "PERSON-P001", target: "PHONE-9810XXXX", label: "Registered", weight: 1 },
  { id: "e12", source: "PERSON-P002", target: "PHONE-9920XXXX", label: "Registered", weight: 1 },
  { id: "e13", source: "PERSON-P002", target: "ACCT-B1", label: "Owns", weight: 2 },
  { id: "e14", source: "PERSON-P001", target: "ACCT-A2", label: "Owns", weight: 2 },
  { id: "e15", source: "ACCT-A2", target: "ACCT-B1", label: "PAID", weight: 3, confidence: .91, evidenceIds: ["EV-2026-0003"] },
  { id: "e16", source: "PERSON-P001", target: "LOCATION-01", label: "Resides", weight: 1 },
  { id: "e17", source: "PERSON-P002", target: "LOCATION-02", label: "Resides", weight: 1 },
  { id: "e18", source: "PERSON-P004", target: "LOCATION-05", label: "Sighted", weight: 1 },
  { id: "e19", source: "PERSON-P001", target: "VEH-DL01", label: "APPEARS_IN", weight: 1, confidence: .92, evidenceIds: ["EV-2026-0004", "EV-2026-0006"] },
  { id: "e20", source: "PERSON-P006", target: "VEH-RJ14", label: "Registered", weight: 1 },
  { id: "e21", source: "PERSON-P006", target: "CASE-2026-031", label: "MENTIONED_IN", weight: 2, confidence: .86, evidenceIds: ["EV-2026-0007"] },
  { id: "e22", source: "PERSON-P001", target: "EVENT-012", label: "Attended", weight: 2 },
  { id: "e23", source: "PERSON-P004", target: "EVENT-012", label: "Attended", weight: 2 },
  { id: "e24", source: "PERSON-P006", target: "ORG-042", label: "Consultant", weight: 1 },
];

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
export const timelineEvents: TimelineEvent[] = [
  {
    id: "T001",
    timestamp: "2026-01-14 08:30",
    type: "report",
    title: "FIR Filed: CASE-2026-017",
    description: "FIR registered at Delhi police station. Initial suspects identified.",
    entities: ["PERSON-P001"],
    location: "New Delhi",
    source: "FIR-2026-DL-0142",
    confidence: "confirmed",
  },
  {
    id: "T002",
    timestamp: "2026-01-15 23:47",
    type: "call",
    title: "Communication Burst: Raj Mehta to Vikram Singh",
    description: "14 calls in 90 minutes. Unusual pattern flagged by system.",
    entities: ["PERSON-P001", "PERSON-P004"],
    source: "CDR-2026-01-15",
    confidence: "confirmed",
  },
  {
    id: "T003",
    timestamp: "2026-01-18 14:22",
    type: "transaction",
    title: "Large Transfer: ACCT-A2 → ACCT-B1",
    description: "₹18,40,000 transferred via RTGS. Flagged as unusual by pattern analysis.",
    entities: ["PERSON-P001", "PERSON-P002", "ACCT-A2", "ACCT-B1"],
    source: "FINANCIAL-RECORD-001",
    confidence: "confirmed",
  },
  {
    id: "T004",
    timestamp: "2026-01-22 11:00",
    type: "meeting",
    title: "Suspected Meeting: EVENT-012",
    description: "Surveillance report indicates Raj Mehta and Vikram Singh present at location simultaneously.",
    entities: ["PERSON-P001", "PERSON-P004"],
    location: "LOCATION-05, Jaipur",
    source: "SURV-REPORT-012",
    confidence: "probable",
  },
  {
    id: "T005",
    timestamp: "2026-02-03 17:15",
    type: "sighting",
    title: "Vehicle Sighting: VEH-DL01",
    description: "VEH-DL01 captured on CCTV near LOCATION-05. Person inside unconfirmed.",
    entities: ["VEH-DL01", "PERSON-P001"],
    location: "LOCATION-05",
    source: "CCTV-CAM-078",
    confidence: "probable",
  },
  {
    id: "T006",
    timestamp: "2026-02-11 09:00",
    type: "report",
    title: "Intelligence Report: ORG-042 Financial Activity",
    description: "ORG-042 shows unusual corporate account activity. Links to PERSON-P001 confirmed.",
    entities: ["ORG-042", "PERSON-P001", "PERSON-P002"],
    source: "INT-REPORT-042",
    confidence: "confirmed",
  },
  {
    id: "T007",
    timestamp: "2026-03-07 21:30",
    type: "call",
    title: "New Contact: PERSON-P006 Joins Network",
    description: "First CDR contact between PERSON-P001 and PERSON-P006. High frequency thereafter.",
    entities: ["PERSON-P001", "PERSON-P006"],
    source: "CDR-2026-03-07",
    confidence: "confirmed",
  },
  {
    id: "T008",
    timestamp: "2026-04-14 13:00",
    type: "transaction",
    title: "Cash Withdrawal: PERSON-P004",
    description: "₹9,80,000 cash withdrawal from multiple ATMs in Jaipur in one day.",
    entities: ["PERSON-P004"],
    location: "Jaipur",
    source: "FINANCIAL-RECORD-018",
    confidence: "confirmed",
  },
  {
    id: "T009",
    timestamp: "2026-05-20 16:45",
    type: "media",
    title: "Social Media Intelligence: ORG-042",
    description: "OSINT reveals ORG-042 has dormant social media accounts with unusual follower patterns.",
    entities: ["ORG-042"],
    source: "OSINT-REPORT-007",
    confidence: "unverified",
  },
  {
    id: "T010",
    timestamp: "2026-08-28 07:10",
    type: "sighting",
    title: "Vikram Singh Vehicle: RJ14 CCTV Sighting",
    description: "VEH-RJ14 sighted near Delhi border checkpoint. Matches pattern from CASE-2026-031.",
    entities: ["PERSON-P006", "VEH-RJ14"],
    location: "Delhi Border",
    source: "CCTV-BORDER-001",
    confidence: "probable",
  },
];

// ─── ALERTS ──────────────────────────────────────────────────────────────────
export const alerts: Alert[] = [
  {
    id: "ALT-001",
    type: "Communication",
    title: "Unusual Communication Burst: PERSON-P001",
    description: "60 calls in 24 hours. Significantly above baseline.",
    severity: "critical",
    entity: "PERSON-P001",
    timestamp: "2026-09-04 23:47",
    reason: "CDR analysis shows 12× spike above 7-day baseline",
    normal: "~5 calls/day",
    observed: "60 calls in 24 hours",
  },
  {
    id: "ALT-002",
    type: "Financial",
    title: "Large Transaction: ACCT-A2 → ACCT-B1",
    description: "₹18.4L transfer flagged. Threshold: ₹10L. Pattern: split transfers preceding.",
    severity: "critical",
    entity: "PERSON-P001",
    timestamp: "2026-01-18 14:22",
    reason: "Single transaction 1.8× above reporting threshold",
    normal: "Avg. transaction ₹2.3L",
    observed: "₹18,40,000 single transfer",
  },
  {
    id: "ALT-003",
    type: "Network",
    title: "New Cross-Case Connection: PERSON-P006",
    description: "PERSON-P006 appears in both CASE-2026-017 and CASE-2026-031. Bridge entity identified.",
    severity: "high",
    entity: "PERSON-P006",
    timestamp: "2026-09-01 09:15",
    reason: "Same entity with confirmed identity links appears in 2 active cases",
    normal: "Entities typically appear in 1 case",
    observed: "Active in 2 concurrent cases",
  },
  {
    id: "ALT-004",
    type: "Location",
    title: "Vehicle Sighting at Known Location",
    description: "VEH-RJ14 sighted near checkpoint. Previously flagged location.",
    severity: "high",
    entity: "VEH-RJ14",
    timestamp: "2026-08-28 07:10",
    reason: "Location geofence triggered: 3rd occurrence this month",
    normal: "0 geofence triggers",
    observed: "3 triggers in 30 days",
  },
  {
    id: "ALT-005",
    type: "Identity",
    title: "New Phone Number: PERSON-P001",
    description: "Third phone number registered to aliases. Pattern consistent with OPSEC behavior.",
    severity: "medium",
    entity: "PERSON-P001",
    timestamp: "2026-07-22 18:30",
    reason: "Third registered number identified in 6 months",
    normal: "1-2 phone numbers",
    observed: "3rd new number in 6 months",
  },
  {
    id: "ALT-006",
    type: "Document",
    title: "Contradiction: Person Location",
    description: "Report A says PERSON-P004 in Delhi on Jan 22. Surveillance B shows PERSON-P004 in Jaipur.",
    severity: "medium",
    entity: "PERSON-P004",
    timestamp: "2026-01-22 15:00",
    reason: "Two authorized sources give contradicting location for same timestamp",
    normal: "Single source confirmation",
    observed: "Contradicting sources",
  },
  {
    id: "ALT-007",
    type: "Financial",
    title: "Cash Withdrawal Pattern: PERSON-P004",
    description: "Multiple ATM withdrawals totaling ₹9.8L in single day across Jaipur.",
    severity: "medium",
    entity: "PERSON-P004",
    timestamp: "2026-04-14 18:00",
    reason: "Structured withdrawals: below single-transaction threshold but total exceeds limit",
    normal: "Avg. ₹50K/month withdrawal",
    observed: "₹9.8L in one day",
  },
];

// ─── EVIDENCE ─────────────────────────────────────────────────────────────────
export const evidence: EvidenceItem[] = [
  {
    id: "EV-2026-0001",
    type: "document",
    title: "FIR and initial field report",
    source: "Synthetic demo evidence",
    date: "2026-01-14",
    caseId: "CASE-2026-017",
    size: "245 KB",
    hash: "sha256:fa3736ca96c9ef337c879e3b79636db8f622aee5417edc0237c27ce25474d1e2",
    uploadedBy: "Insp. R. Sharma",
    status: "processed",
    entities: ["PERSON-P001", "LOCATION-01"],
  },
  {
    id: "EV-2026-0002",
    type: "data",
    title: "Call detail records",
    source: "Synthetic telecom export",
    date: "2026-09-01",
    caseId: "CASE-2026-017",
    size: "4.2 MB",
    hash: "sha256:01168b14d29cb7eedb9b9ab0cd7223f1254f68815fbcb957c7b7568f13e9945f",
    uploadedBy: "Insp. R. Sharma",
    status: "processed",
    entities: ["PERSON-P001", "PERSON-P002", "PERSON-P004", "PERSON-P006"],
  },
  {
    id: "EV-2026-0003",
    type: "data",
    title: "Financial transaction export",
    source: "Fictional Cooperative Bank",
    date: "2026-09-02",
    caseId: "CASE-2026-017",
    size: "1.8 MB",
    hash: "sha256:8c57082db6d932134dbb7c6bb3aae40dcea0b311d90950ec8be998a2760df6b3",
    uploadedBy: "Insp. R. Sharma",
    status: "processed",
    entities: ["PERSON-P001", "PERSON-P002", "ACCT-A2", "ACCT-B1"],
  },
  {
    id: "EV-2026-0004",
    type: "image",
    title: "Synthetic CCTV still",
    source: "Demo camera CAM-04",
    date: "2026-01-22",
    caseId: "CASE-2026-017",
    size: "890 KB",
    hash: "sha256:fb4290ba38a41e397403455fd58b6635653e8130fdec4ba82fb132b4654ada5a",
    uploadedBy: "Sr. Insp. P. Verma",
    status: "processed",
    entities: ["PERSON-P001", "PERSON-P004", "LOCATION-05"],
  },
  {
    id: "EV-2026-0005",
    type: "audio",
    title: "Synthetic dispatch audio",
    source: "Generated radio-channel sample",
    date: "2026-01-22",
    caseId: "CASE-2026-017",
    size: "2.1 GB",
    hash: "sha256:798640ad5744c2a244371a5c074b4a102dd329be3e2d8dc6704f3b29057765de",
    uploadedBy: "Insp. R. Sharma",
    status: "processed",
    entities: ["VEH-DL01", "PERSON-P001"],
  },
  {
    id: "EV-2026-0006",
    type: "video",
    title: "Synthetic CCTV clip",
    source: "Demo camera CAM-04",
    date: "2026-05-20",
    caseId: "CASE-2026-017",
    size: "1.2 MB",
    hash: "sha256:dd2c5bf0463c3c24912f8b61bb0519826c03cc048a68e303ba6c1e46f50768e5",
    uploadedBy: "Analyst K. Mehta",
    status: "processed",
    entities: ["ORG-042", "PERSON-P001", "PERSON-P002"],
  },
  {
    id: "EV-2026-0007",
    type: "document",
    title: "Investigation note",
    source: "Synthetic field note",
    date: "2026-03-15",
    caseId: "CASE-2026-017",
    size: "18 MB",
    hash: "sha256:0bdddc43e7520e1570cfb66b200663238cc6d9abd808ba4b0a52a8d62ac8a75a",
    uploadedBy: "Forensic Unit",
    status: "processed",
    entities: ["PERSON-P001", "PERSON-P006"],
  },
  {
    id: "EV-2026-0008",
    type: "image",
    title: "Decypher Security Protocols",
    source: "Government ID Records (Authorized)",
    date: "2026-01-16",
    caseId: "CASE-2026-017",
    size: "4.5 MB",
    hash: "sha256:b8c9d0e1f2a3...",
    uploadedBy: "Insp. R. Sharma",
    status: "processed",
    entities: ["PERSON-P001", "PERSON-P002", "PERSON-P004", "PERSON-P006"],
  },
];

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
export const transactions: Transaction[] = [
  { id: "TXN-001", from: "ACCT-A2 (Raj Mehta)", to: "ACCT-B1 (Arjun Verma)", amount: 1840000, date: "2026-01-18", method: "RTGS", flagged: true, reason: "Above ₹10L threshold" },
  { id: "TXN-002", from: "ACCT-B1 (Arjun Verma)", to: "ORG-042 Account", amount: 950000, date: "2026-01-20", method: "NEFT", flagged: true, reason: "Rapid re-transfer pattern" },
  { id: "TXN-003", from: "ORG-042 Account", to: "ACCT-X3 (Unknown)", amount: 420000, date: "2026-01-22", method: "UPI", flagged: true, reason: "Unidentified beneficiary" },
  { id: "TXN-004", from: "PERSON-P004 (Cash)", to: "ATM Withdrawal", amount: 980000, date: "2026-04-14", method: "ATM", flagged: true, reason: "Structured withdrawal" },
  { id: "TXN-005", from: "ACCT-A2 (Raj Mehta)", to: "ACCT-F1 (Vikram Singh)", amount: 350000, date: "2026-03-20", method: "NEFT", flagged: false },
  { id: "TXN-006", from: "ORG-007 Account", to: "ACCT-D2 (Vikram Singh)", amount: 280000, date: "2026-02-05", method: "NEFT", flagged: false },
  { id: "TXN-007", from: "ACCT-F1 (Vikram Singh)", to: "ACCT-B1 (Arjun Verma)", amount: 190000, date: "2026-04-02", method: "UPI", flagged: true, reason: "Loop detected" },
  { id: "TXN-008", from: "ACCT-B1 (Arjun Verma)", to: "ACCT-A2 (Raj Mehta)", amount: 85000, date: "2026-05-10", method: "IMPS", flagged: false },
];

// ─── MAP LOCATIONS ────────────────────────────────────────────────────────────
export const mapLocations = [
  { id: "LOCATION-L001", name: "Connaught Place", lat: 28.6315, lng: 77.2167, type: "primary", entity: "PERSON-P001", description: "CDR location supported by EV-2026-0002" },
  { id: "LOCATION-L002", name: "Gurugram Warehouse", lat: 28.4595, lng: 77.0266, type: "alert", entity: "VEHICLE-V001", description: "Synthetic CCTV sighting supported by EV-2026-0004 and EV-2026-0006" },
  { id: "LOCATION-L003", name: "Noida Sector 62", lat: 28.6270, lng: 77.3723, type: "secondary", entity: "ACCOUNT-A001", description: "Fictional transaction location supported by EV-2026-0003" },
  { id: "LOCATION-L004", name: "India Gate Review Point", lat: 28.6129, lng: 77.2295, type: "peripheral", entity: "PERSON-P004", description: "Manual review lead; not independently confirmed" },
];

export const copilotResponses: Record<string, string> = {
  default: "I am Decypher Copilot. I can analyze case connections, find anomalies in communication patterns, and summarize large evidence files. What would you like to know about CASE-2026-017?",
  connections: "**Connection Analysis:**\nPERSON-P001 has been identified in 3 cross-case contexts.\n- Primary communication line: ORG-042 (Financial Node)\n- Secondary: Met with PERSON-P006 on Jan 22 (See evidence EV-2026-0007)\n- Shared location: Warehouse 3 (Jaipur)\n\n*Would you like to see the communication graph for these nodes?*",
  important: "**High-Priority Findings (Last 24h):**\n- Financial anomaly detected: ₹45L transferred from ACCT-X3 to unknown international account.\n- New CCTV evidence places PERSON-P004 at the Jaipur warehouse during the time of interest.\n- The communications graph density around PERSON-P001 has increased by 400% in the last 48 hours.",
  changed: "**Recent Updates to CASE-2026-017:**\n- 3 new CDR logs added by Forensics team.\n- EV-2026-0005 (CCTV) successfully processed and entity extraction complete.\n- Alert generated: 'Communication burst detected' (Severity: Critical)\n- Person status changed: PERSON-P006 upgraded to 'Primary Suspect'.",
  pattern: "**Historical Pattern Match:**\nThis communication burst pattern (short, encrypted bursts followed by complete silence) matches historical data from CASE-2024-112 and CASE-2025-089.\n- Common entity: ORG-042\n- Probability of coordinated movement: 87%\n\n*Recommendation: Increase surveillance on peripheral nodes associated with ORG-042.*",
  missing: "**Data Gap Analysis:**\nWe are currently missing:\n- Origin details for ACCT-X3 funds.\n- Positive ID for the secondary individual in EV-2026-0005 (CCTV).\n- Geolocation data for PERSON-P001 between Jan 18-20.\n\n*Action suggested: Request expedited financial forensics on ACCT-X3.*",
};
