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
    title: "Operation Indra Net",
    type: "Financial Crime / Organized Network",
    status: "active",
    priority: "high",
    date: "2026-01-14",
    location: "Delhi / Mumbai / Bengaluru",
    description: "Multi-city organized financial crime network with suspected hawala operations, CDR analysis reveals coordinated communication burst patterns across 6 suspects.",
    assignedTo: "Insp. R. Sharma",
    entities: 34,
    alerts: 7,
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
    id: "PERSON-A",
    name: "Person-A",
    alias: ["Alpha", "Raj K."],
    dob: "1981-03-14",
    address: "Saket, New Delhi",
    phones: ["PHONE-9810XXXX", "PHONE-9971XXXX"],
    vehicles: ["VEH-DL01-CA-XXXX"],
    associates: ["PERSON-B", "PERSON-D", "PERSON-F"],
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
    id: "PERSON-B",
    name: "Person-B",
    alias: ["Bravo"],
    dob: "1986-07-22",
    address: "Andheri West, Mumbai",
    phones: ["PHONE-9920XXXX"],
    vehicles: ["VEH-MH04-XX-XXXX"],
    associates: ["PERSON-A", "PERSON-C"],
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
    id: "PERSON-C",
    name: "Person-C",
    alias: ["Charlie", "C. Mehta"],
    dob: "1990-11-05",
    address: "Koramangala, Bengaluru",
    phones: ["PHONE-9845XXXX", "PHONE-8970XXXX"],
    vehicles: ["VEH-KA05-MX-XXXX"],
    associates: ["PERSON-B", "PERSON-E"],
    organizations: ["ORG-117"],
    cases: ["CASE-2026-017", "CASE-2026-008"],
    risk: "medium",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    role: "IT Infrastructure Provider",
    financialFlag: false,
    communicationFlag: true,
    notes: "Appears in CDR records with Person-B. Maintains servers potentially used for communication.",
  },
  {
    id: "PERSON-D",
    name: "Person-D",
    alias: ["Delta"],
    dob: "1975-01-30",
    address: "Lajpat Nagar, New Delhi",
    phones: ["PHONE-9899XXXX"],
    vehicles: ["VEH-DL07-CX-XXXX", "VEH-DL12-AX-XXXX"],
    associates: ["PERSON-A", "PERSON-F"],
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
    id: "PERSON-E",
    name: "Person-E",
    alias: ["Echo"],
    dob: "1993-05-18",
    address: "Anna Nagar, Chennai",
    phones: ["PHONE-9444XXXX"],
    vehicles: [],
    associates: ["PERSON-C"],
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
    id: "PERSON-F",
    name: "Person-F",
    alias: ["Foxtrot"],
    dob: "1984-09-12",
    address: "Jaipur, Rajasthan",
    phones: ["PHONE-9414XXXX", "PHONE-9828XXXX"],
    vehicles: ["VEH-RJ14-XC-XXXX"],
    associates: ["PERSON-A", "PERSON-D"],
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
  { id: "PERSON-A", label: "Person-A", type: "person", x: 400, y: 280, highlighted: true },
  { id: "PERSON-B", label: "Person-B", type: "person", x: 230, y: 160 },
  { id: "PERSON-C", label: "Person-C", type: "person", x: 130, y: 310 },
  { id: "PERSON-D", label: "Person-D", type: "person", x: 570, y: 160 },
  { id: "PERSON-E", label: "Person-E", type: "person", x: 620, y: 340 },
  { id: "PERSON-F", label: "Person-F", type: "person", x: 310, y: 420 },
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
  { id: "e1", source: "PERSON-A", target: "PERSON-B", label: "Called (47×)", weight: 3 },
  { id: "e2", source: "PERSON-A", target: "PERSON-D", label: "Called (31×)", weight: 3 },
  { id: "e3", source: "PERSON-A", target: "PERSON-F", label: "Associated", weight: 2 },
  { id: "e4", source: "PERSON-B", target: "PERSON-C", label: "Called (12×)", weight: 2 },
  { id: "e5", source: "PERSON-C", target: "PERSON-E", label: "Associated", weight: 1 },
  { id: "e6", source: "PERSON-D", target: "PERSON-F", label: "Called (22×)", weight: 2 },
  { id: "e7", source: "PERSON-A", target: "ORG-042", label: "Owns", weight: 2 },
  { id: "e8", source: "PERSON-B", target: "ORG-042", label: "Director", weight: 2 },
  { id: "e9", source: "PERSON-D", target: "ORG-007", label: "Linked", weight: 1 },
  { id: "e10", source: "PERSON-C", target: "ORG-117", label: "Employed", weight: 1 },
  { id: "e11", source: "PERSON-A", target: "PHONE-9810XXXX", label: "Registered", weight: 1 },
  { id: "e12", source: "PERSON-B", target: "PHONE-9920XXXX", label: "Registered", weight: 1 },
  { id: "e13", source: "PERSON-B", target: "ACCT-B1", label: "Owns", weight: 2 },
  { id: "e14", source: "PERSON-A", target: "ACCT-A2", label: "Owns", weight: 2 },
  { id: "e15", source: "ACCT-A2", target: "ACCT-B1", label: "Transferred ₹18L", weight: 3 },
  { id: "e16", source: "PERSON-A", target: "LOCATION-01", label: "Resides", weight: 1 },
  { id: "e17", source: "PERSON-B", target: "LOCATION-02", label: "Resides", weight: 1 },
  { id: "e18", source: "PERSON-D", target: "LOCATION-05", label: "Sighted", weight: 1 },
  { id: "e19", source: "PERSON-A", target: "VEH-DL01", label: "Owned", weight: 1 },
  { id: "e20", source: "PERSON-F", target: "VEH-RJ14", label: "Registered", weight: 1 },
  { id: "e21", source: "PERSON-F", target: "CASE-2026-031", label: "Mentioned In", weight: 2 },
  { id: "e22", source: "PERSON-A", target: "EVENT-012", label: "Attended", weight: 2 },
  { id: "e23", source: "PERSON-D", target: "EVENT-012", label: "Attended", weight: 2 },
  { id: "e24", source: "PERSON-F", target: "ORG-042", label: "Consultant", weight: 1 },
];

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
export const timelineEvents: TimelineEvent[] = [
  {
    id: "T001",
    timestamp: "2026-01-14 08:30",
    type: "report",
    title: "FIR Filed: CASE-2026-017",
    description: "FIR registered at Delhi police station. Initial suspects identified.",
    entities: ["PERSON-A"],
    location: "New Delhi",
    source: "FIR-2026-DL-0142",
    confidence: "confirmed",
  },
  {
    id: "T002",
    timestamp: "2026-01-15 23:47",
    type: "call",
    title: "Communication Burst: Person-A to Person-D",
    description: "14 calls in 90 minutes. Unusual pattern flagged by system.",
    entities: ["PERSON-A", "PERSON-D"],
    source: "CDR-2026-01-15",
    confidence: "confirmed",
  },
  {
    id: "T003",
    timestamp: "2026-01-18 14:22",
    type: "transaction",
    title: "Large Transfer: ACCT-A2 → ACCT-B1",
    description: "₹18,40,000 transferred via RTGS. Flagged as unusual by pattern analysis.",
    entities: ["PERSON-A", "PERSON-B", "ACCT-A2", "ACCT-B1"],
    source: "FINANCIAL-RECORD-001",
    confidence: "confirmed",
  },
  {
    id: "T004",
    timestamp: "2026-01-22 11:00",
    type: "meeting",
    title: "Suspected Meeting: EVENT-012",
    description: "Surveillance report indicates Person-A and Person-D present at location simultaneously.",
    entities: ["PERSON-A", "PERSON-D"],
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
    entities: ["VEH-DL01", "PERSON-A"],
    location: "LOCATION-05",
    source: "CCTV-CAM-078",
    confidence: "probable",
  },
  {
    id: "T006",
    timestamp: "2026-02-11 09:00",
    type: "report",
    title: "Intelligence Report: ORG-042 Financial Activity",
    description: "ORG-042 shows unusual corporate account activity. Links to PERSON-A confirmed.",
    entities: ["ORG-042", "PERSON-A", "PERSON-B"],
    source: "INT-REPORT-042",
    confidence: "confirmed",
  },
  {
    id: "T007",
    timestamp: "2026-03-07 21:30",
    type: "call",
    title: "New Contact: PERSON-F Joins Network",
    description: "First CDR contact between PERSON-A and PERSON-F. High frequency thereafter.",
    entities: ["PERSON-A", "PERSON-F"],
    source: "CDR-2026-03-07",
    confidence: "confirmed",
  },
  {
    id: "T008",
    timestamp: "2026-04-14 13:00",
    type: "transaction",
    title: "Cash Withdrawal: PERSON-D",
    description: "₹9,80,000 cash withdrawal from multiple ATMs in Jaipur in one day.",
    entities: ["PERSON-D"],
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
    title: "Person-F Vehicle: RJ14 CCTV Sighting",
    description: "VEH-RJ14 sighted near Delhi border checkpoint. Matches pattern from CASE-2026-031.",
    entities: ["PERSON-F", "VEH-RJ14"],
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
    title: "Unusual Communication Burst: PERSON-A",
    description: "60 calls in 24 hours. Significantly above baseline.",
    severity: "critical",
    entity: "PERSON-A",
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
    entity: "PERSON-A",
    timestamp: "2026-01-18 14:22",
    reason: "Single transaction 1.8× above reporting threshold",
    normal: "Avg. transaction ₹2.3L",
    observed: "₹18,40,000 single transfer",
  },
  {
    id: "ALT-003",
    type: "Network",
    title: "New Cross-Case Connection: PERSON-F",
    description: "PERSON-F appears in both CASE-2026-017 and CASE-2026-031. Bridge entity identified.",
    severity: "high",
    entity: "PERSON-F",
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
    title: "New Phone Number: PERSON-A",
    description: "Third phone number registered to aliases. Pattern consistent with OPSEC behavior.",
    severity: "medium",
    entity: "PERSON-A",
    timestamp: "2026-07-22 18:30",
    reason: "Third registered number identified in 6 months",
    normal: "1-2 phone numbers",
    observed: "3rd new number in 6 months",
  },
  {
    id: "ALT-006",
    type: "Document",
    title: "Contradiction: Person Location",
    description: "Report A says PERSON-D in Delhi on Jan 22. Surveillance B shows PERSON-D in Jaipur.",
    severity: "medium",
    entity: "PERSON-D",
    timestamp: "2026-01-22 15:00",
    reason: "Two authorized sources give contradicting location for same timestamp",
    normal: "Single source confirmation",
    observed: "Contradicting sources",
  },
  {
    id: "ALT-007",
    type: "Financial",
    title: "Cash Withdrawal Pattern: PERSON-D",
    description: "Multiple ATM withdrawals totaling ₹9.8L in single day across Jaipur.",
    severity: "medium",
    entity: "PERSON-D",
    timestamp: "2026-04-14 18:00",
    reason: "Structured withdrawals: below single-transaction threshold but total exceeds limit",
    normal: "Avg. ₹50K/month withdrawal",
    observed: "₹9.8L in one day",
  },
];

// ─── EVIDENCE ─────────────────────────────────────────────────────────────────
export const evidence: EvidenceItem[] = [
  {
    id: "EVD-001",
    type: "document",
    title: "FIR: CASE-2026-017",
    source: "Delhi Police Station 42",
    date: "2026-01-14",
    caseId: "CASE-2026-017",
    size: "245 KB",
    hash: "sha256:a1b2c3d4e5f6...",
    uploadedBy: "Insp. R. Sharma",
    status: "processed",
    entities: ["PERSON-A", "LOCATION-01"],
  },
  {
    id: "EVD-002",
    type: "data",
    title: "CDR Records: Jan-Sep 2026",
    source: "Telecom Provider (Authorized)",
    date: "2026-09-01",
    caseId: "CASE-2026-017",
    size: "4.2 MB",
    hash: "sha256:b2c3d4e5f6a7...",
    uploadedBy: "Insp. R. Sharma",
    status: "processed",
    entities: ["PERSON-A", "PERSON-B", "PERSON-D", "PERSON-F"],
  },
  {
    id: "EVD-003",
    type: "data",
    title: "Bank Transaction Records: ACCT-A2, ACCT-B1",
    source: "Financial Intelligence Unit",
    date: "2026-09-02",
    caseId: "CASE-2026-017",
    size: "1.8 MB",
    hash: "sha256:c3d4e5f6a7b8...",
    uploadedBy: "Insp. R. Sharma",
    status: "processed",
    entities: ["PERSON-A", "PERSON-B", "ACCT-A2", "ACCT-B1"],
  },
  {
    id: "EVD-004",
    type: "report",
    title: "Surveillance Report: EVENT-012",
    source: "Field Unit 07",
    date: "2026-01-22",
    caseId: "CASE-2026-017",
    size: "890 KB",
    hash: "sha256:d4e5f6a7b8c9...",
    uploadedBy: "Sr. Insp. P. Verma",
    status: "processed",
    entities: ["PERSON-A", "PERSON-D", "LOCATION-05"],
  },
  {
    id: "EVD-005",
    type: "video",
    title: "CCTV Footage: LOCATION-05 (Jan 22)",
    source: "CCTV Network: CAM-078",
    date: "2026-01-22",
    caseId: "CASE-2026-017",
    size: "2.1 GB",
    hash: "sha256:e5f6a7b8c9d0...",
    uploadedBy: "Insp. R. Sharma",
    status: "processed",
    entities: ["VEH-DL01", "PERSON-A"],
  },
  {
    id: "EVD-006",
    type: "report",
    title: "OSINT Report: ORG-042 Social Intelligence",
    source: "OSINT Unit",
    date: "2026-05-20",
    caseId: "CASE-2026-017",
    size: "1.2 MB",
    hash: "sha256:f6a7b8c9d0e1...",
    uploadedBy: "Analyst K. Mehta",
    status: "processed",
    entities: ["ORG-042", "PERSON-A", "PERSON-B"],
  },
  {
    id: "EVD-007",
    type: "audio",
    title: "Intercepted Communication: 2026-03-15",
    source: "Authorized Intercept: Court Order 2026/42",
    date: "2026-03-15",
    caseId: "CASE-2026-017",
    size: "18 MB",
    hash: "sha256:a7b8c9d0e1f2...",
    uploadedBy: "Forensic Unit",
    status: "processed",
    entities: ["PERSON-A", "PERSON-F"],
  },
  {
    id: "EVD-008",
    type: "image",
    title: "Decypher Security Protocols",
    source: "Government ID Records (Authorized)",
    date: "2026-01-16",
    caseId: "CASE-2026-017",
    size: "4.5 MB",
    hash: "sha256:b8c9d0e1f2a3...",
    uploadedBy: "Insp. R. Sharma",
    status: "processed",
    entities: ["PERSON-A", "PERSON-B", "PERSON-D", "PERSON-F"],
  },
];

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
export const transactions: Transaction[] = [
  { id: "TXN-001", from: "ACCT-A2 (Person-A)", to: "ACCT-B1 (Person-B)", amount: 1840000, date: "2026-01-18", method: "RTGS", flagged: true, reason: "Above ₹10L threshold" },
  { id: "TXN-002", from: "ACCT-B1 (Person-B)", to: "ORG-042 Account", amount: 950000, date: "2026-01-20", method: "NEFT", flagged: true, reason: "Rapid re-transfer pattern" },
  { id: "TXN-003", from: "ORG-042 Account", to: "ACCT-X3 (Unknown)", amount: 420000, date: "2026-01-22", method: "UPI", flagged: true, reason: "Unidentified beneficiary" },
  { id: "TXN-004", from: "PERSON-D (Cash)", to: "ATM Withdrawal", amount: 980000, date: "2026-04-14", method: "ATM", flagged: true, reason: "Structured withdrawal" },
  { id: "TXN-005", from: "ACCT-A2 (Person-A)", to: "ACCT-F1 (Person-F)", amount: 350000, date: "2026-03-20", method: "NEFT", flagged: false },
  { id: "TXN-006", from: "ORG-007 Account", to: "ACCT-D2 (Person-D)", amount: 280000, date: "2026-02-05", method: "NEFT", flagged: false },
  { id: "TXN-007", from: "ACCT-F1 (Person-F)", to: "ACCT-B1 (Person-B)", amount: 190000, date: "2026-04-02", method: "UPI", flagged: true, reason: "Loop detected" },
  { id: "TXN-008", from: "ACCT-B1 (Person-B)", to: "ACCT-A2 (Person-A)", amount: 85000, date: "2026-05-10", method: "IMPS", flagged: false },
];

// ─── MAP LOCATIONS ────────────────────────────────────────────────────────────
export const mapLocations = [
  { id: "LOCATION-01", name: "New Delhi HQ", lat: 28.6139, lng: 77.2090, type: "primary", entity: "PERSON-A", description: "Primary residence / meeting point" },
  { id: "LOCATION-02", name: "Mumbai Node", lat: 19.0760, lng: 72.8777, type: "secondary", entity: "PERSON-B", description: "Financial transactions traced here" },
  { id: "LOCATION-03", name: "Bengaluru IT Node", lat: 12.9716, lng: 77.5946, type: "secondary", entity: "PERSON-C", description: "IT infrastructure location" },
  { id: "LOCATION-04", name: "Chennai Link", lat: 13.0827, lng: 80.2707, type: "peripheral", entity: "PERSON-E", description: "Peripheral contact location" },
  { id: "LOCATION-05", name: "Jaipur Meeting Point", lat: 26.9124, lng: 75.7873, type: "primary", entity: "PERSON-D", description: "Multiple meetings confirmed here. Surveillance evidence." },
  { id: "LOCATION-06", name: "Gujarat Coast", lat: 22.3072, lng: 70.8021, type: "alert", entity: "CASE-2025-099", description: "Arms smuggling route (CASE-2025-099)" },
  { id: "LOCATION-07", name: "Kolkata Transit", lat: 22.5726, lng: 88.3639, type: "secondary", entity: "ORG-042", description: "Cross-border shell entity operations & logistics hub" },
  { id: "LOCATION-08", name: "Hyderabad Terminal", lat: 17.3850, lng: 78.4867, type: "alert", entity: "ACCT-X3", description: "Suspicious Hawala clearing terminal & crypto off-ramp" },
  { id: "LOCATION-09", name: "Lucknow Node", lat: 26.8467, lng: 80.9462, type: "peripheral", entity: "PERSON-F", description: "Transit corridor & burner handset exchange point" },
  { id: "LOCATION-10", name: "Pune Safehouse", lat: 18.5204, lng: 73.8567, type: "secondary", entity: "VEH-DL01", description: "Secondary vehicle sighting and storage facility" },
];

export const copilotResponses: Record<string, string> = {
  default: "I am Decypher Copilot. I can analyze case connections, find anomalies in communication patterns, and summarize large evidence files. What would you like to know about CASE-2026-017?",
  connections: "**Connection Analysis:**\nPERSON-A has been identified in 3 cross-case contexts.\n- Primary communication line: ORG-042 (Financial Node)\n- Secondary: Met with PERSON-F on Jan 22 (See evidence EVD-044)\n- Shared location: Warehouse 3 (Jaipur)\n\n*Would you like to see the communication graph for these nodes?*",
  important: "**High-Priority Findings (Last 24h):**\n- Financial anomaly detected: ₹45L transferred from ACCT-X3 to unknown international account.\n- New CCTV evidence places PERSON-D at the Jaipur warehouse during the time of interest.\n- The communications graph density around PERSON-A has increased by 400% in the last 48 hours.",
  changed: "**Recent Updates to CASE-2026-017:**\n- 3 new CDR logs added by Forensics team.\n- EVD-005 (CCTV) successfully processed and entity extraction complete.\n- Alert generated: 'Communication burst detected' (Severity: Critical)\n- Person status changed: PERSON-F upgraded to 'Primary Suspect'.",
  pattern: "**Historical Pattern Match:**\nThis communication burst pattern (short, encrypted bursts followed by complete silence) matches historical data from CASE-2024-112 and CASE-2025-089.\n- Common entity: ORG-042\n- Probability of coordinated movement: 87%\n\n*Recommendation: Increase surveillance on peripheral nodes associated with ORG-042.*",
  missing: "**Data Gap Analysis:**\nWe are currently missing:\n- Origin details for ACCT-X3 funds.\n- Positive ID for the secondary individual in EVD-005 (CCTV).\n- Geolocation data for PERSON-A between Jan 18-20.\n\n*Action suggested: Request expedited financial forensics on ACCT-X3.*",
};
