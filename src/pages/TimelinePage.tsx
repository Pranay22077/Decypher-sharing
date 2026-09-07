import { useState } from "react";
import { Filter, ChevronRight, MapPin, FileText, Phone, TrendingUp, Users, AlertTriangle, Eye, Shield } from "../components/icons";
import { timelineEvents } from "../data/dummy";

interface Props {
  onNavigate: (page: string, param?: string) => void;
}

const typeConfigs: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  call: { color: "var(--color-primary)", label: "Telecommunication", icon: <Phone size={13} /> },
  transaction: { color: "var(--color-accent)", label: "Financial Flow", icon: <TrendingUp size={13} /> },
  meeting: { color: "var(--color-alert-high)", label: "Physical Rendezvous", icon: <Users size={13} /> },
  sighting: { color: "var(--entity-phone)", label: "CCTV Sighting", icon: <Eye size={13} /> },
  crime: { color: "var(--color-alert-critical)", label: "Incident / Offense", icon: <AlertTriangle size={13} /> },
  report: { color: "var(--color-success)", label: "Intelligence Memo", icon: <FileText size={13} /> },
  media: { color: "var(--entity-account)", label: "Digital Intercept", icon: <Shield size={13} /> },
  travel: { color: "var(--entity-vehicle)", label: "Transit Movement", icon: <MapPin size={13} /> },
};

function confStyle(c: string): React.CSSProperties {
  if (c === "confirmed") return { color: "var(--color-success)", borderColor: "var(--color-success)", background: "var(--color-surface-2)" };
  if (c === "probable") return { color: "var(--color-alert-high)", borderColor: "var(--color-alert-high)", background: "var(--color-surface-2)" };
  return { color: "var(--color-text-muted)", borderColor: "var(--color-border-strong)", background: "var(--color-surface-2)" };
}

export default function TimelinePage({ onNavigate }: Props) {
  const [filterType, setFilterType] = useState("all");
  const [filterConf, setFilterConf] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = timelineEvents.filter((e) => {
    const typeOk = filterType === "all" || e.type === filterType;
    const confOk = filterConf === "all" || e.confidence === filterConf;
    return typeOk && confOk;
  });

  return (
    <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)]">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-6">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Chronological Investigation Timeline</h1>
          <p className="text-[var(--color-text-secondary)] text-[13px] mt-1">CASE-2026-017 · Forensic event sequence · Multi-source correlation</p>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-3.5">
        <div className="max-w-[1440px] mx-auto flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
            <Filter size={14} className="text-[var(--color-primary)]" />
            <span>Event:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["all", "call", "transaction", "meeting", "sighting", "report"].map((t) => (
              <button key={t} className={`gov-chip capitalize ${filterType === t ? "is-active" : ""}`} aria-pressed={filterType === t} onClick={() => setFilterType(t)}>
                {t}
              </button>
            ))}
          </div>

          <span className="text-[var(--color-border-strong)] hidden md:inline">|</span>

          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
            <span>Confidence:</span>
          </div>
          <div className="flex gap-1.5">
            {["all", "confirmed", "probable", "unverified"].map((c) => (
              <button key={c} className={`gov-chip capitalize ${filterConf === c ? "is-active" : ""}`} aria-pressed={filterConf === c} onClick={() => setFilterConf(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-10">
        {/* Timeline container */}
        <div className="relative">
          {/* Vertical spine (solid, institutional) */}
          <div className="absolute left-[130px] top-4 bottom-4 w-0.5 bg-[var(--color-border-strong)]" />

          <div className="space-y-6">
            {filtered.map((ev) => {
              const cfg = typeConfigs[ev.type] || typeConfigs.report;
              const isExpanded = expanded === ev.id;
              return (
                <div key={ev.id} className="flex items-start gap-0 group">
                  {/* Timestamp */}
                  <div className="w-[115px] text-right pr-5 flex-shrink-0 pt-3">
                    <div className="text-[12px] font-mono font-bold text-[var(--color-text-primary)]">{ev.timestamp.split(" ")[0]}</div>
                    <div className="text-[11px] font-mono text-[var(--color-text-muted)]">{ev.timestamp.split(" ")[1] || "00:00"}</div>
                  </div>

                  {/* Node dot */}
                  <div className="relative z-10 flex-shrink-0 pt-3.5">
                    <div className="w-4 h-4 rounded-full border-2 border-[var(--color-surface)]" style={{ background: cfg.color }} />
                  </div>

                  {/* Event card */}
                  <div
                    className={`ml-5 flex-1 gov-panel p-5 cursor-pointer transition-colors ${isExpanded ? "border-[var(--color-primary)]" : "hover:border-[var(--color-border-strong)]"}`}
                    onClick={() => setExpanded((e) => (e === ev.id ? null : ev.id))}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-sm border uppercase tracking-wider flex items-center gap-1.5"
                            style={{ color: cfg.color, borderColor: cfg.color, background: "var(--color-surface-2)" }}
                          >
                            {cfg.icon} {ev.type}
                          </span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm border uppercase tracking-widest" style={confStyle(ev.confidence)}>
                            {ev.confidence}
                          </span>
                        </div>

                        <h3 className="font-bold text-[var(--color-text-primary)] text-[15px] group-hover:text-[var(--color-primary)] transition-colors">{ev.title}</h3>

                        {isExpanded && (
                          <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] space-y-3">
                            <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{ev.description}</p>

                            {ev.location && (
                              <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-muted)]">
                                <MapPin size={13} className="text-[var(--color-primary)]" />
                                <span>{ev.location}</span>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className="text-[11px] text-[var(--color-text-muted)]">Involved entities:</span>
                              {ev.entities.map((e) => (
                                <span key={e} className="text-[10px] bg-[var(--color-surface-2)] border border-[var(--color-border-strong)] text-[var(--color-text-primary)] px-2 py-0.5 rounded-sm font-mono font-semibold">
                                  {e}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between pt-2 text-[11px] text-[var(--color-text-muted)]">
                              <span>
                                Source feed: <strong className="text-[var(--color-text-secondary)]">{ev.source}</strong>
                              </span>
                              <div className="flex gap-4">
                                <button
                                  className="text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate("evidence");
                                  }}
                                >
                                  Examine evidence <ChevronRight size={11} />
                                </button>
                                <button
                                  className="text-[var(--color-accent)] font-semibold hover:underline flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate("graph");
                                  }}
                                >
                                  Trace in graph <ChevronRight size={11} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <ChevronRight
                        size={16}
                        className={`text-[var(--color-text-muted)] flex-shrink-0 transition-transform ${isExpanded ? "rotate-90 text-[var(--color-primary)]" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
