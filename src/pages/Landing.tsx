import {
  Search, Network, Users, MapPin, Database, Activity,
  FileText, Brain, Eye, GitBranch, Shield, Lock, ClipboardList, ArrowRight
} from "../components/icons";
import Threads from "../components/Threads";
import CountUp from "../components/CountUp";
import FadeIn from "../components/FadeIn";

interface Props { onNavigate: (page: string) => void; }

export default function Landing({ onNavigate }: Props) {
  const capabilities = [
    { icon: <FileText size={22} />, title: "Case Intelligence", desc: "Bring investigation data into one connected analytical view with full evidence traceability and chain of custody.", features: ["Multi-source integration", "Evidence preservation", "Chain of custody"], tag: "Case-centric" },
    { icon: <Users size={22} />, title: "Entity Intelligence", desc: "Extract and connect people, organizations, locations, vehicles and phone numbers. Resolve aliases to canonical records.", features: ["Identity resolution", "Alias detection", "Cross-reference matching"], tag: "Identity resolution" },
    { icon: <Network size={22} />, title: "Network Analysis", desc: "Discover direct and indirect relationships across fragmented records. Identify communities, bridges and influential nodes.", features: ["Link discovery", "Community detection", "Path analysis"], tag: "Multi-hop traversal" },
    { icon: <Activity size={22} />, title: "Pattern Detection", desc: "Identify unusual activity, recurring relationships and significant patterns with statistical baselines and rule-based detection.", features: ["Anomaly detection", "Behavioral analysis", "Temporal patterns"], tag: "Real-time alerts" },
    { icon: <MapPin size={22} />, title: "Geospatial Intelligence", desc: "Understand how entities, events and locations relate geographically. Detect impossible travel and co-location patterns.", features: ["Location tracking", "Movement analysis", "Conflict detection"], tag: "GPS and tower data" },
    { icon: <Database size={22} />, title: "Data Ingestion", desc: "Process authorized structured and unstructured information securely across documents, tables, images, audio and video.", features: ["Multi-format support", "OCR processing", "Media analysis"], tag: "Multimodal" },
  ];

  const processSteps = [
    { num: "01", title: "INGEST", desc: "Process authorized structured and unstructured information.", icon: <Database size={22} /> },
    { num: "02", title: "EXTRACT", desc: "Identify entities, events and key information using AI and NLP.", icon: <Brain size={22} /> },
    { num: "03", title: "CONNECT", desc: "Resolve related entities and discover their relationships.", icon: <GitBranch size={22} /> },
    { num: "04", title: "ANALYZE", desc: "Construct and analyze relationship graphs, patterns and timelines.", icon: <Network size={22} /> },
    { num: "05", title: "EXPLAIN", desc: "Present evidence-linked insights for investigator review.", icon: <Eye size={22} /> },
  ];

  const pillars = [
    { icon: <Shield size={24} />, title: "Human Oversight", desc: "Final investigative decisions remain with authorized personnel." },
    { icon: <Eye size={24} />, title: "Explainability", desc: "Analytical insights stay connected to their supporting evidence." },
    { icon: <Lock size={24} />, title: "Data Governance", desc: "Information is processed under applicable authorization, privacy and retention rules." },
    { icon: <ClipboardList size={24} />, title: "Auditability", desc: "Actions and analytical workflows support accountability and traceability." },
  ];

  const stats = [
    { value: 7, suffix: "", label: "Evidence Types" },
    { value: 11, suffix: "", label: "Entity Classes" },
    { value: 4, suffix: "", label: "Graph Algorithms" },
    { value: 256, suffix: "-bit", label: "Encryption" },
  ];

  return (
    <div className="bg-[var(--color-base-bg)] min-h-screen text-[var(--color-text-primary)]">

      {/* ══════════════════════════════════════════════════════════════════
          HERO — Full viewport, Threads WebGL background, bold headline
         ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* WebGL Threads background — saffron/blue tones, subtle */}
        <Threads
          color={[0.35, 0.55, 0.95]}
          amplitude={0.8}
          distance={0.3}
          enableMouseInteraction
          style={{ opacity: 0.35 }}
        />

        {/* Faint radial gradient overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,130,246,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Tricolour accent band at top */}
        <div className="absolute top-0 left-0 w-full h-1 flex z-10">
          <div className="flex-1 flag-saffron" />
          <div className="flex-1 flag-white" />
          <div className="flex-1 flag-green" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-12 w-full">
          <FadeIn delay={100} duration={800}>
            <div className="flex items-center gap-3 mb-8">
              <span className="tricolor-strip w-10" style={{ height: 4 }}>
                <span className="flag-saffron" />
                <span className="flag-white" />
                <span className="flag-green" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
                Decypher by Epoch · Intelligence Prototype
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={250} duration={900}>
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-8 max-w-4xl">
              Where criminal{" "}
              <br className="hidden lg:block" />
              intelligence{" "}
              <span className="gradient-text-blue">converges</span>
            </h1>
          </FadeIn>

          <FadeIn delay={450} duration={800}>
            <p className="text-lg lg:text-xl text-[var(--color-text-secondary)] mb-10 max-w-2xl leading-relaxed">
              An AI-assisted investigation platform that transforms fragmented crime-related information
              into connected, explainable and actionable intelligence.
            </p>
          </FadeIn>

          <FadeIn delay={600} duration={700}>
            <div className="flex flex-wrap gap-4 items-center">
              <button
                className="btn-premium btn-lg"
                style={{ borderRadius: 12, padding: "14px 32px", fontSize: "0.9rem" }}
                onClick={() => onNavigate("login")}
              >
                <Lock size={16} />
                Access the Platform
              </button>
              <button
                className="btn-premium-outline btn-lg"
                style={{ borderRadius: 12, padding: "14px 32px", fontSize: "0.9rem" }}
                onClick={() => onNavigate("capabilities")}
              >
                View Capabilities
                <ArrowRight size={16} />
              </button>
            </div>
          </FadeIn>

          <FadeIn delay={800} duration={700}>
            <div className="flex flex-wrap gap-3 items-center mt-8">
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
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-[var(--color-border-strong)] flex justify-center pt-1.5">
            <div
              className="w-1 h-2 rounded-full bg-[var(--color-text-muted)]"
              style={{ animation: "scrollBounce 2s ease-in-out infinite" }}
            />
          </div>
          <style>{`@keyframes scrollBounce { 0%,100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(6px); opacity: 0.3; } }`}</style>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          STATS BAND — Animated counters
         ══════════════════════════════════════════════════════════════════ */}
      <section className="relative border-y border-[var(--color-border-subtle)] py-12"
        style={{ background: "linear-gradient(180deg, rgba(59,130,246,0.04) 0%, transparent 100%)" }}
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
                    {s.label}
                  </div>
                </div>
                {i < stats.length - 1 && <div className="stat-divider hidden lg:block" />}
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
                Capabilities
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">Intelligence Services</h2>
              <p className="text-[var(--color-text-secondary)] text-lg leading-relaxed">
                Analytical capabilities for complex national security investigations, each linked back to source evidence.
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
                    <h3 className="font-bold text-[17px] text-[var(--color-text-primary)]">{s.title}</h3>
                  </div>

                  <span
                    className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-md border uppercase tracking-wider mb-4"
                    style={{ color: "var(--color-primary)", borderColor: "rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.08)" }}
                  >
                    {s.tag}
                  </span>

                  <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed mb-5">{s.desc}</p>

                  <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5">
                    {s.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-[12px] text-[var(--color-text-secondary)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-primary)] uppercase tracking-wide group-hover:gap-3 transition-all">
                    Open module <ArrowRight size={14} />
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
      <section className="py-24 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(17,24,39,0.6) 0%, var(--color-base-bg) 100%)" }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
          <FadeIn>
            <div className="mb-16 text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-4 block">
                Methodology
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">How Decypher Works</h2>
              <p className="text-[var(--color-text-secondary)] text-lg max-w-xl mx-auto">
                A structured pipeline from raw data to reviewable intelligence.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {processSteps.map((step, i) => (
              <FadeIn key={i} delay={i * 150} duration={600}>
                <div className="relative text-center md:text-left">
                  <div className="text-[13px] font-bold font-mono text-[var(--color-primary)] mb-4">{step.num}</div>
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center mb-5 text-[var(--color-primary)] mx-auto md:mx-0 glow-ring">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-[16px] mb-3 text-[var(--color-text-primary)]">{step.title}</h3>
                  <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{step.desc}</p>

                  {/* Connector line */}
                  {i < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-[82px] -right-4 w-8"
                      style={{
                        height: 1,
                        background: "linear-gradient(90deg, var(--color-primary), transparent)",
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
                Trust & Responsibility
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">Built for Responsible Intelligence</h2>
              <p className="text-[var(--color-text-secondary)] text-lg max-w-xl">
                Technology to support investigators, never to replace judgment.
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
                  <h3 className="font-bold text-[16px] mb-3 text-[var(--color-text-primary)]">{p.title}</h3>
                  <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{p.desc}</p>
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
          style={{ background: "linear-gradient(180deg, var(--color-base-bg), transparent 30%, transparent 70%, var(--color-base-bg))" }}
        />

        <div className="relative z-10 max-w-[820px] mx-auto px-6 text-center">
          <FadeIn>
            <div className="tricolor-strip w-12 mx-auto mb-8" style={{ height: 4 }}>
              <span className="flag-saffron" />
              <span className="flag-white" />
              <span className="flag-green" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">
              Turn disconnected data into{" "}
              <span className="gradient-text">intelligence</span>
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg mb-10 leading-relaxed max-w-xl mx-auto">
              Decypher brings AI, NLP and graph analytics together to help authorized investigators
              discover relationships hidden across fragmented information.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                className="btn-premium btn-lg"
                style={{ borderRadius: 12, padding: "14px 32px", fontSize: "0.9rem" }}
                onClick={() => onNavigate("login")}
              >
                <Lock size={16} />
                Access the Platform
              </button>
              <button
                className="btn-premium-outline btn-lg"
                style={{ borderRadius: 12, padding: "14px 32px", fontSize: "0.9rem" }}
                onClick={() => onNavigate("capabilities")}
              >
                View Capabilities
                <ArrowRight size={16} />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
