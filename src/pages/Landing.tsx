import { useState } from "react";
import {
  Search, Network, Users, MapPin, Database, Activity,
  FileText, Brain, Eye, GitBranch, Shield, Lock, ClipboardList, ArrowRight
} from "../components/icons";
import ProblemsCarousel from "../components/ProblemsCarousel";

interface Props { onNavigate: (page: string) => void; }

// Illustrative entity network for the hero. Restrained institutional palette,
// entity identity carried by colour + label; no glow, no rainbow.
function NetworkShowcase() {
  const nodes = [
    { id: "A", x: 340, y: 180, type: "person", label: "Person-A", primary: true },
    { id: "B", x: 180, y: 100, type: "person", label: "Person-B" },
    { id: "C", x: 100, y: 220, type: "person", label: "Person-C" },
    { id: "D", x: 490, y: 100, type: "person", label: "Person-D" },
    { id: "E", x: 560, y: 240, type: "person", label: "Person-E" },
    { id: "F", x: 240, y: 290, type: "person", label: "Person-F" },
    { id: "O1", x: 220, y: 190, type: "org", label: "ORG-042" },
    { id: "O2", x: 460, y: 200, type: "org", label: "ORG-007" },
    { id: "Ph1", x: 380, y: 80, type: "phone", label: "PHONE-9810" },
    { id: "V1", x: 430, y: 310, type: "vehicle", label: "VEH-DL01" },
    { id: "L1", x: 300, y: 60, type: "location", label: "LOCATION-01" },
    { id: "Ac1", x: 130, y: 160, type: "account", label: "ACCT-B1" },
    { id: "Ac2", x: 490, y: 340, type: "account", label: "ACCT-A2" },
    { id: "Ev1", x: 310, y: 250, type: "event", label: "EVENT-012" },
    { id: "Ca1", x: 560, y: 340, type: "case", label: "CASE-031" },
  ];
  const edges = [
    { s: "A", t: "B" }, { s: "A", t: "D" }, { s: "A", t: "F" }, { s: "B", t: "C" },
    { s: "A", t: "O1" }, { s: "D", t: "O2" }, { s: "B", t: "O1" }, { s: "A", t: "Ph1" },
    { s: "A", t: "L1" }, { s: "B", t: "Ac1" }, { s: "Ac1", t: "Ac2" }, { s: "A", t: "Ev1" },
    { s: "F", t: "V1" }, { s: "F", t: "Ca1" }, { s: "D", t: "F" },
  ];

  const colorMap: Record<string, string> = {
    person: "var(--entity-person)",
    org: "var(--entity-org)",
    phone: "var(--entity-phone)",
    vehicle: "var(--entity-vehicle)",
    location: "var(--entity-location)",
    account: "var(--entity-account)",
    event: "var(--entity-event)",
    case: "var(--entity-case)",
  };

  const nMap = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <svg viewBox="0 0 670 400" className="w-full h-full" style={{ maxHeight: 360 }}>
      <defs>
        <pattern id="lgrid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--color-border-subtle)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="670" height="400" fill="url(#lgrid)" />

      {/* Edges */}
      {edges.map((e, i) => {
        const s = nMap[e.s];
        const t = nMap[e.t];
        if (!s || !t) return null;
        const mx = (s.x + t.x) / 2 - (t.y - s.y) * 0.15;
        const my = (s.y + t.y) / 2 + (t.x - s.x) * 0.15;
        return (
          <path
            key={i}
            d={`M${s.x},${s.y} Q${mx},${my} ${t.x},${t.y}`}
            fill="none"
            stroke="var(--color-border-strong)"
            strokeWidth="1.3"
            strokeOpacity="0.7"
            strokeDasharray="5,4"
            className="dash-flow"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const color = colorMap[node.type];
        const r = node.primary ? 19 : 12;
        return (
          <g key={node.id} transform={`translate(${node.x},${node.y})`}>
            {node.primary && <circle r={r + 6} fill="none" stroke="var(--color-saffron)" strokeWidth="2.5" />}
            <circle r={r} fill={color} stroke="var(--color-surface)" strokeWidth="2" />
            {node.primary && (
              <>
                <rect x="-24" y={r + 5} width="48" height="13" rx="2" fill="var(--color-primary)" />
                <text x="0" y={r + 15} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="700">PRIMARY</text>
              </>
            )}
            <text
              y={r + (node.primary ? 24 : 14)}
              textAnchor="middle"
              fill={node.primary ? "var(--color-text-primary)" : "var(--color-text-secondary)"}
              fontSize={node.primary ? 8.5 : 7.5}
              fontWeight={node.primary ? "700" : "500"}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {node.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Landing({ onNavigate }: Props) {
  const [searchQuery, setSearchQuery] = useState("");

  const capabilities = [
    { icon: <Database size={20} />, label: "Multi-Source Ingestion", sub: "Documents, CDR, FIU feeds" },
    { icon: <Users size={20} />, label: "Entity Resolution", sub: "People, orgs and assets" },
    { icon: <Network size={20} />, label: "Knowledge Graph", sub: "Relationship mapping" },
    { icon: <Activity size={20} />, label: "Pattern Detection", sub: "Statistical baselines" },
    { icon: <MapPin size={20} />, label: "Geospatial Analysis", sub: "Movement and co-location" },
    { icon: <Brain size={20} />, label: "Explainable AI", sub: "Evidence-linked output" },
  ];

  const intelligenceServices = [
    {
      icon: <FileText size={20} />,
      title: "Case Intelligence",
      desc: "Bring the information associated with an investigation into one connected analytical view, converting fragmented case records into a searchable network with full evidence traceability.",
      features: ["Multi-source integration", "Evidence preservation", "Chain of custody"],
      tag: "Case-centric",
    },
    {
      icon: <Users size={20} />,
      title: "Entity Intelligence",
      desc: "Extract and connect people, organizations, locations, vehicles and phone numbers. Resolve aliases and inconsistent identifiers to canonical records.",
      features: ["Identity resolution", "Alias detection", "Cross-reference matching"],
      tag: "Identity resolution",
    },
    {
      icon: <Network size={20} />,
      title: "Network Analysis",
      desc: "Discover direct and indirect relationships across fragmented records. Identify communities, bridges and influential nodes with explainable graph algorithms.",
      features: ["Link discovery", "Community detection", "Path analysis"],
      tag: "Multi-hop traversal",
    },
    {
      icon: <Activity size={20} />,
      title: "Pattern Detection",
      desc: "Identify unusual activity, recurring relationships and potentially significant patterns. Apply statistical baselines and rule-based detection with full explanation.",
      features: ["Anomaly detection", "Behavioral analysis", "Temporal patterns"],
      tag: "Real-time alerts",
    },
    {
      icon: <MapPin size={20} />,
      title: "Geospatial Intelligence",
      desc: "Understand how entities, events and locations relate geographically. Detect impossible travel, co-location patterns and routes with timeline correlation.",
      features: ["Location tracking", "Movement analysis", "Conflict detection"],
      tag: "GPS and tower data",
    },
    {
      icon: <Database size={20} />,
      title: "Data Ingestion",
      desc: "Process authorized structured and unstructured information securely. Support documents, tables, images, audio and video with automatic entity extraction and validation.",
      features: ["Multi-format support", "OCR processing", "Media analysis"],
      tag: "Multimodal",
    },
  ];

  const processSteps = [
    { num: "01", title: "INGEST", desc: "Process authorized structured and unstructured information.", icon: <Database size={20} /> },
    { num: "02", title: "EXTRACT", desc: "Identify entities, events and key information using AI and NLP.", icon: <Brain size={20} /> },
    { num: "03", title: "CONNECT", desc: "Resolve related entities and discover their relationships.", icon: <GitBranch size={20} /> },
    { num: "04", title: "ANALYZE", desc: "Construct and analyze relationship graphs, patterns and timelines.", icon: <Network size={20} /> },
    { num: "05", title: "EXPLAIN", desc: "Present evidence-linked analytical insights for investigator review.", icon: <Eye size={20} /> },
  ];

  const pillars = [
    { icon: <Shield size={22} />, title: "Human Oversight", desc: "Final investigative decisions remain with authorized personnel." },
    { icon: <Eye size={22} />, title: "Explainability", desc: "Analytical insights stay connected to their supporting evidence." },
    { icon: <Lock size={22} />, title: "Data Governance", desc: "Information is processed under applicable authorization, privacy and retention rules." },
    { icon: <ClipboardList size={22} />, title: "Auditability", desc: "Actions and analytical workflows support accountability and traceability." },
  ];

  return (
    <div className="bg-[var(--color-base-bg)] min-h-screen text-[var(--color-text-primary)]">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)]">
        {/* Tiranga hero backdrop (bg.png). Kept faint so headline contrast holds. */}
        <div
          className="absolute inset-0 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: "url('/bg.png')", opacity: 0.18 }}
          aria-hidden="true"
        />
        {/* Faint institutional grid */}
        <div className="absolute inset-0 pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="var(--color-primary)" strokeWidth="0.4" strokeOpacity="0.08" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 py-16 lg:py-20 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: thesis + search */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-5">
              <span className="tricolor-strip w-10">
                <span className="flag-saffron" />
                <span className="flag-white" />
                <span className="flag-green" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                Ministry of Home Affairs · Intelligence Platform
              </span>
            </div>

            <h1 className="text-4xl lg:text-[52px] font-bold leading-[1.08] tracking-tight mb-6">
              Where criminal intelligence{" "}
              <span className="text-[var(--color-primary)] border-b-4 border-[var(--color-saffron)] pb-1">converges</span>
            </h1>

            <p className="text-[var(--color-text-secondary)] text-lg mb-8 max-w-[560px]">
              Decypher is an AI-assisted investigation platform that transforms fragmented crime-related information into connected, explainable and actionable intelligence.
            </p>

            {/* Search */}
            <div className="flex items-center bg-[var(--color-surface)] rounded-sm border border-[var(--color-border-strong)] overflow-hidden focus-within:border-[var(--color-primary)] transition-colors max-w-[560px]">
              <Search size={18} className="text-[var(--color-text-muted)] ml-4 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by Case ID, Person, Phone or Vehicle"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onNavigate("dashboard")}
                className="flex-1 min-w-0 px-3 py-3.5 text-[15px] bg-transparent outline-none placeholder-[var(--color-text-muted)] text-[var(--color-text-primary)]"
              />
              <button
                className="btn-premium"
                style={{ borderRadius: 0 }}
                onClick={() => onNavigate("dashboard")}
              >
                Search
              </button>
            </div>

            <div className="flex flex-wrap gap-2 items-center mt-5">
              <span className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider mr-1">Quick access</span>
              {[
                { label: "Case Registry", page: "cases" },
                { label: "Network Graph", page: "graph" },
                { label: "Geospatial Map", page: "map" },
              ].map((q) => (
                <button key={q.page} className="gov-chip" onClick={() => onNavigate(q.page)}>
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: signature network visual */}
          <div className="gov-panel gov-accent-top p-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                Entity Relationship Network
              </span>
              <span className="text-[10px] font-mono text-[var(--color-text-muted)]">ILLUSTRATIVE</span>
            </div>
            <div className="bg-[var(--color-base-bg)] border border-[var(--color-border-subtle)] rounded-sm">
              <NetworkShowcase />
            </div>
            <p className="text-[10px] text-[var(--color-text-muted)] mt-2 px-1">
              Sample graph for demonstration. Live investigations render inside the analysis workspace.
            </p>
          </div>
        </div>
      </section>

      {/* ── PRIORITY CHALLENGES (auto-rotating brief) ────────────────── */}
      <ProblemsCarousel onNavigate={onNavigate} />

      {/* ── CAPABILITY BAND ──────────────────────────────────────────── */}
      <section className="bg-[var(--color-primary)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-6 divide-y lg:divide-y-0 lg:divide-x divide-white/15">
            {capabilities.map((c, i) => (
              <div key={i} className="px-5 py-7 text-center">
                <div className="text-white flex justify-center mb-2.5">{c.icon}</div>
                <div className="text-[12px] font-semibold text-white tracking-wide mb-1 uppercase">{c.label}</div>
                <div className="text-[11px] text-white/70">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTELLIGENCE SERVICES ────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight mb-3">Intelligence Services</h2>
            <p className="text-[var(--color-text-secondary)] text-lg">
              Analytical capabilities for complex national security investigations, each linked back to source evidence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {intelligenceServices.map((s, i) => (
              <div
                key={i}
                className="gov-panel p-6 cursor-pointer transition-colors hover:border-[var(--color-border-strong)]"
                onClick={() => onNavigate("dashboard")}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h3 className="font-bold text-[16px] text-[var(--color-text-primary)]">{s.title}</h3>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-sm border uppercase tracking-wider whitespace-nowrap"
                        style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)", background: "var(--color-surface-2)" }}
                      >
                        {s.tag}
                      </span>
                    </div>
                    <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-4">{s.desc}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-4">
                      {s.features.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-[12px] text-[var(--color-text-secondary)]">
                          <span className="w-1.5 h-1.5 bg-[var(--color-primary)] flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-primary)] uppercase tracking-wide">
                      Open module <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="py-20 bg-[var(--color-surface)] border-y border-[var(--color-border-subtle)]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-3">How Decypher Works</h2>
            <p className="text-[var(--color-text-secondary)] text-lg">A structured pipeline from raw data to reviewable intelligence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {processSteps.map((step, i) => (
              <div key={i} className="relative">
                <div className="text-[12px] font-bold font-mono text-[var(--color-accent)] mb-3">{step.num}</div>
                <div className="w-11 h-11 rounded-sm border border-[var(--color-border-subtle)] flex items-center justify-center mb-4 bg-[var(--color-surface-2)] text-[var(--color-primary)]">
                  {step.icon}
                </div>
                <h3 className="font-bold text-[15px] mb-2 text-[var(--color-text-primary)]">{step.title}</h3>
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{step.desc}</p>
                {i < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-[68px] -right-3 w-6 h-px bg-[var(--color-border-strong)]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESPONSIBLE AI ───────────────────────────────────────────── */}
      <section className="py-20 border-b border-[var(--color-border-subtle)]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="flex flex-col items-center mb-12 text-center">
            <span className="tricolor-strip w-16 mb-4">
              <span className="flag-saffron" />
              <span className="flag-white" />
              <span className="flag-green" />
            </span>
            <h2 className="text-3xl font-bold tracking-tight mb-3">Built for Responsible Intelligence</h2>
            <p className="text-[var(--color-text-secondary)] text-lg">Technology to support investigators, never to replace judgment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p, i) => (
              <div key={i} className="gov-panel p-6">
                <div className="w-11 h-11 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-primary)] flex items-center justify-center mb-5">
                  {p.icon}
                </div>
                <h3 className="font-bold text-[15px] mb-2 text-[var(--color-text-primary)]">{p.title}</h3>
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ───────────────────────────────────────────── */}
      <section className="py-20 bg-[var(--color-surface)]">
        <div className="max-w-[820px] mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-5 text-[var(--color-primary)]">
            Turn disconnected data into intelligence
          </h2>
          <p className="text-[var(--color-text-secondary)] text-lg mb-9 leading-relaxed">
            Decypher brings AI, NLP and graph analytics together to help authorized investigators discover relationships hidden across fragmented information.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button className="btn-premium btn-lg" onClick={() => onNavigate("login")}>Access the Platform</button>
            <button className="btn-premium-outline btn-lg" onClick={() => onNavigate("capabilities")}>View Capabilities</button>
          </div>
        </div>
      </section>
    </div>
  );
}
