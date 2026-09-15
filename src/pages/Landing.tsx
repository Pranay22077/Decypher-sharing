import UiText from "../components/UiText"
import { useState } from "react"
import {
  Search,
  Network,
  Users,
  MapPin,
  Database,
  Activity,
  FileText,
  Brain,
  Eye,
  GitBranch,
  Shield,
  Lock,
  ClipboardList,
  ArrowRight,
} from "../components/icons"
import Threads from "../components/Threads"
import CountUp from "../components/CountUp"
import FadeIn from "../components/FadeIn"

interface Props {
  onNavigate: (page: string) => void
}

export default function Landing({ onNavigate }: Props) {
  const [query, setQuery] = useState("")
  const capabilities = [
    {
      icon: <FileText size={22} />,
      title: "Case Intelligence",
      desc: "Bring investigation data into one connected analytical view with full evidence traceability and chain of custody.",
      features: [
        "Multi-source integration",
        "Evidence preservation",
        "Chain of custody",
      ],
      tag: "Case-centric",
    },
    {
      icon: <Users size={22} />,
      title: "Entity Intelligence",
      desc: "Extract and connect people, organizations, locations, vehicles and phone numbers. Resolve aliases to canonical records.",
      features: [
        "Identity resolution",
        "Alias detection",
        "Cross-reference matching",
      ],
      tag: "Identity resolution",
    },
    {
      icon: <Network size={22} />,
      title: "Network Analysis",
      desc: "Discover direct and indirect relationships across fragmented records. Identify communities, bridges and influential nodes.",
      features: ["Link discovery", "Community detection", "Path analysis"],
      tag: "Multi-hop traversal",
    },
    {
      icon: <Activity size={22} />,
      title: "Pattern Detection",
      desc: "Identify unusual activity, recurring relationships and significant patterns with statistical baselines and rule-based detection.",
      features: [
        "Anomaly detection",
        "Behavioral analysis",
        "Temporal patterns",
      ],
      tag: "Real-time alerts",
    },
    {
      icon: <MapPin size={22} />,
      title: "Geospatial Intelligence",
      desc: "Understand how entities, events and locations relate geographically. Detect impossible travel and co-location patterns.",
      features: [
        "Location tracking",
        "Movement analysis",
        "Conflict detection",
      ],
      tag: "GPS and tower data",
    },
    {
      icon: <Database size={22} />,
      title: "Data Ingestion",
      desc: "Process authorized structured and unstructured information securely across documents, tables, images, audio and video.",
      features: ["Multi-format support", "OCR processing", "Media analysis"],
      tag: "Multimodal",
    },
  ]

  const processSteps = [
    {
      num: "01",
      title: "INGEST",
      desc: "Process authorized structured and unstructured information.",
      icon: <Database size={22} />,
    },
    {
      num: "02",
      title: "EXTRACT",
      desc: "Identify entities, events and key information using AI and NLP.",
      icon: <Brain size={22} />,
    },
    {
      num: "03",
      title: "CONNECT",
      desc: "Resolve related entities and discover their relationships.",
      icon: <GitBranch size={22} />,
    },
    {
      num: "04",
      title: "ANALYZE",
      desc: "Construct and analyze relationship graphs, patterns and timelines.",
      icon: <Network size={22} />,
    },
    {
      num: "05",
      title: "EXPLAIN",
      desc: "Present evidence-linked insights for investigator review.",
      icon: <Eye size={22} />,
    },
  ]

  const pillars = [
    {
      icon: <Shield size={24} />,
      title: "Human Oversight",
      desc: "Final investigative decisions remain with authorized personnel.",
    },
    {
      icon: <Eye size={24} />,
      title: "Explainability",
      desc: "Analytical insights stay connected to their supporting evidence.",
    },
    {
      icon: <Lock size={24} />,
      title: "Data Governance",
      desc: "Information is processed under applicable authorization, privacy and retention rules.",
    },
    {
      icon: <ClipboardList size={24} />,
      title: "Auditability",
      desc: "Actions and analytical workflows support accountability and traceability.",
    },
  ]

  const stats = [
    { value: 7, suffix: "", label: "Evidence Types" },
    { value: 11, suffix: "", label: "Entity Classes" },
    { value: 4, suffix: "", label: "Graph Algorithms" },
    { value: 256, suffix: "-bit", label: "Encryption" },
  ]

  return (
    <div className="bg-[var(--color-base-bg)] min-h-screen text-[var(--color-text-primary)]">
      <section className="relative overflow-hidden border-b border-[var(--color-border-subtle)] min-h-[620px] flex items-center">
        <div
          className="institutional-flag-bg absolute inset-0"
          aria-hidden="true"
        />
        <div
          className="institutional-flag-scrim absolute inset-0"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto w-full px-6 lg:px-14 py-14 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(520px,1.08fr)] gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-24 h-1 bg-[var(--color-saffron)]" />
              <span className="w-24 h-1 bg-[var(--color-india-green)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
                <UiText>
                  Ministry of Home Affairs · Intelligence Platform
                </UiText>
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] leading-[1.04] mb-6 max-w-2xl">
              <UiText>Where criminal intelligence</UiText>
              <br />
              <span className="text-[var(--color-primary)]">
                <UiText>converges</UiText>
              </span>
            </h1>
            <div className="h-1 w-44 bg-[var(--color-saffron)] mb-5" />
            <p className="text-base lg:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-2xl mb-8">
              <UiText>
                Decypher is an AI-assisted investigation platform that
                transforms fragmented crime-related information into connected,
                explainable and actionable intelligence.
              </UiText>
            </p>
            <form
              className="flex max-w-2xl mb-5 border border-[var(--color-border-strong)] bg-[var(--color-surface)]"
              onSubmit={(event) => {
                event.preventDefault()
                onNavigate("cases")
              }}
            >
              <label className="sr-only" htmlFor="landing-search">
                <UiText>Search cases and entities</UiText>
              </label>
              <Search
                size={18}
                className="ml-4 my-auto text-[var(--color-text-muted)] shrink-0"
              />
              <input
                id="landing-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent px-4 py-3.5 outline-none"
                placeholder="Search by Case ID, Person, Phone or Vehicle"
              />
              <button className="btn-premium rounded-none px-7" type="submit">
                <UiText>Search</UiText>
              </button>
            </form>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)] mr-1">
                <UiText>Quick access</UiText>
              </span>
              <button className="gov-chip" onClick={() => onNavigate("cases")}>
                <UiText>Case Registry</UiText>
              </button>
              <button className="gov-chip" onClick={() => onNavigate("graph")}>
                <UiText>Network Graph</UiText>
              </button>
              <button className="gov-chip" onClick={() => onNavigate("map")}>
                <UiText>Geospatial Map</UiText>
              </button>
            </div>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border-strong)] border-t-[3px] border-t-[var(--color-primary)] p-4 shadow-lg">
            <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide mb-3">
              <UiText>Entity Relationship Network</UiText>
              <span className="text-[var(--color-text-muted)]">
                <UiText>Illustrative</UiText>
              </span>
            </div>
            <HeroNetwork />
            <p className="text-[11px] text-[var(--color-text-muted)] mt-3">
              <UiText>
                Sample graph for demonstration. Live investigations render
                inside the analysis workspace.
              </UiText>
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STATS BAND — Animated counters
         ══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative border-y border-[var(--color-border-subtle)] py-12"
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.04) 0%, transparent 100%)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-0">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-8 lg:gap-12">
                <div className="text-center min-w-[120px]">
                  <div className="text-3xl lg:text-4xl font-bold stat-number text-[var(--color-primary)]">
                    <CountUp end={s.value} suffix={s.suffix} duration={2000} />
                  </div>
                  <div className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-[0.15em] mt-2 font-semibold">
                    <UiText>{s.label}</UiText>
                  </div>
                </div>
                {i < stats.length - 1 && (
                  <div className="stat-divider hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          INTELLIGENCE SERVICES — Glassmorphism cards
         ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="mb-16 max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4 block">
                <UiText>Capabilities</UiText>
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                <UiText>Intelligence Services</UiText>
              </h2>
              <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
                <UiText>
                  Analytical capabilities for complex national security
                  investigations, each linked back to source evidence.
                </UiText>
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((s, i) => (
              <FadeIn key={i} delay={i * 100} duration={600}>
                <div
                  className="glass-card p-7 cursor-pointer h-full group"
                  onClick={() => onNavigate("dashboard")}
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] flex items-center justify-center mb-5 group-hover:bg-[var(--color-primary)]/20 transition-colors">
                    {s.icon}
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-[17px] text-[var(--color-text-primary)]">
                      <UiText>{s.title}</UiText>
                    </h3>
                  </div>

                  <span
                    className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-md border uppercase tracking-wider mb-4"
                    style={{
                      color: "var(--color-primary)",
                      borderColor: "rgba(59,130,246,0.3)",
                      background: "rgba(59,130,246,0.08)",
                    }}
                  >
                    <UiText>{s.tag}</UiText>
                  </span>

                  <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-5">
                    <UiText>{s.desc}</UiText>
                  </p>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5">
                    {s.features.map((f) => (
                      <div
                        key={f}
                        className="flex items-center gap-2 text-[12px] text-[var(--color-text-secondary)]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                        <span>
                          <UiText>{f}</UiText>
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-primary)] uppercase tracking-wide group-hover:gap-3 transition-all">
                    <UiText>Open module </UiText>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          HOW IT WORKS — Pipeline steps
         ══════════════════════════════════════════════════════════════════ */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(17,24,39,0.6) 0%, var(--color-base-bg) 100%)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="mb-16 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4 block">
                <UiText>Methodology</UiText>
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                <UiText>How Decypher Works</UiText>
              </h2>
              <p className="text-[var(--color-text-secondary)] text-lg max-w-xl mx-auto">
                <UiText>
                  A structured pipeline from raw data to reviewable
                  intelligence.
                </UiText>
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {processSteps.map((step, i) => (
              <FadeIn key={i} delay={i * 150} duration={600}>
                <div className="relative text-center md:text-left">
                  <div className="text-[13px] font-bold font-mono text-[var(--color-primary)] mb-4">
                    {step.num}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center mb-5 text-[var(--color-primary)] mx-auto md:mx-0 glow-ring">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-[16px] mb-3 text-[var(--color-text-primary)]">
                    <UiText>{step.title}</UiText>
                  </h3>
                  <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                    <UiText>{step.desc}</UiText>
                  </p>

                  {/* Connector line */}
                  {i < processSteps.length - 1 && (
                    <div
                      className="hidden md:block absolute top-[82px] -right-4 w-8"
                      style={{
                        height: 1,
                        background:
                          "linear-gradient(90deg, var(--color-primary), transparent)",
                        opacity: 0.4,
                      }}
                    />
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          RESPONSIBLE AI — Pillar cards with tricolour accent
         ══════════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="flex flex-col items-center mb-14 text-center">
              <div className="tricolor-strip w-16 mb-6" style={{ height: 4 }}>
                <span className="flag-saffron" />
                <span className="flag-white" />
                <span className="flag-green" />
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4 block">
                <UiText>Trust & Responsibility</UiText>
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                <UiText>Built for Responsible Intelligence</UiText>
              </h2>
              <p className="text-[var(--color-text-secondary)] text-lg max-w-xl">
                <UiText>
                  Technology to support investigators, never to replace
                  judgment.
                </UiText>
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <FadeIn key={i} delay={i * 120} duration={600}>
                <div className="glass-card p-7 h-full">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-saffron)]/10 border border-[var(--color-saffron)]/20 text-[var(--color-saffron)] flex items-center justify-center mb-6">
                    {p.icon}
                  </div>
                  <h3 className="font-bold text-[16px] mb-3 text-[var(--color-text-primary)]">
                    <UiText>{p.title}</UiText>
                  </h3>
                  <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                    <UiText>{p.desc}</UiText>
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          CALL TO ACTION — Threads background variant
         ══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden">
        <Threads
          color={[1.0, 0.6, 0.2]}
          amplitude={0.6}
          distance={0.4}
          style={{ opacity: 0.15 }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, var(--color-base-bg), transparent 30%, transparent 70%, var(--color-base-bg))",
          }}
        />

        <div className="relative z-10 max-w-[820px] mx-auto px-6 text-center">
          <FadeIn>
            <div
              className="tricolor-strip w-12 mx-auto mb-8"
              style={{ height: 4 }}
            >
              <span className="flag-saffron" />
              <span className="flag-white" />
              <span className="flag-green" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">
              <UiText>Turn disconnected data into</UiText>
              <UiText> </UiText>
              <span className="gradient-text">
                <UiText>intelligence</UiText>
              </span>
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg mb-10 leading-relaxed max-w-xl mx-auto">
              <UiText>
                Decypher brings AI, NLP and graph analytics together to help
                authorized investigators discover relationships hidden across
                fragmented information.
              </UiText>
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                className="btn-premium btn-lg"
                style={{
                  borderRadius: 12,
                  padding: "14px 32px",
                  fontSize: "0.9rem",
                }}
                onClick={() => onNavigate("login")}
              >
                <Lock size={16} />
                <UiText>Access the Platform</UiText>
              </button>
              <button
                className="btn-premium-outline btn-lg"
                style={{
                  borderRadius: 12,
                  padding: "14px 32px",
                  fontSize: "0.9rem",
                }}
                onClick={() => onNavigate("capabilities")}
              >
                <UiText>View Capabilities</UiText>
                <ArrowRight size={16} />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

function HeroNetwork() {
  const nodes = [
    [50, 105, "Person-C", "#0b2e63"],
    [100, 70, "ACCT-B1", "#176b91"],
    [145, 35, "Person-B", "#0b2e63"],
    [175, 92, "ORG-042", "#b45309"],
    [215, 132, "EVENT-012", "#64748b"],
    [225, 18, "LOCATION-01", "#16834f"],
    [270, 62, "Person-A", "#0b2e63"],
    [300, 25, "PHONE-9810", "#147c7c"],
    [355, 96, "ORG-007", "#b45309"],
    [385, 38, "Person-D", "#0b2e63"],
    [430, 120, "Person-E", "#0b2e63"],
    [345, 150, "VEH-DL01", "#64748b"],
    [230, 168, "Person-F", "#0b2e63"],
    [390, 175, "ACCT-A2", "#176b91"],
    [455, 175, "CASE-031", "#0b2e63"],
  ] as const
  return (
    <svg
      viewBox="0 0 500 205"
      className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)]"
      role="img"
      aria-label="Illustrative entity relationship graph"
    >
      <g
        stroke="var(--color-border-strong)"
        strokeDasharray="4 4"
        strokeWidth="1"
      >
        {nodes.map((node, i) =>
          i === 6 ? null : (
            <line key={i} x1={node[0]} y1={node[1]} x2="270" y2="62" />
          ),
        )}
      </g>
      {nodes.map(([x, y, label, color], i) => (
        <g key={label}>
          <circle
            cx={x}
            cy={y}
            r={i === 6 ? 15 : 9}
            fill={color}
            stroke="white"
            strokeWidth="3"
          />
          {i === 6 && (
            <circle
              cx={x}
              cy={y}
              r="21"
              fill="none"
              stroke="var(--color-saffron)"
              strokeWidth="2"
            />
          )}
          <text
            x={x}
            y={y + 17 + (i === 6 ? 7 : 0)}
            textAnchor="middle"
            fontSize="7"
            fill="var(--color-text-secondary)"
          >
            {label}
          </text>
        </g>
      ))}
    </svg>
  )
}
