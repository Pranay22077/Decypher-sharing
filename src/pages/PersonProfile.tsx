import { useState } from "react";
import {
  ChevronRight, Phone, Car, MapPin, FileText, AlertTriangle,
  Activity, Shield, Link2, Network, CreditCard, Radio, Folder
} from "../components/icons";
import { persons, timelineEvents, transactions, alerts } from "../data/dummy";

interface Props {
  personId: string;
  onNavigate: (page: string, param?: string) => void;
}

const tabs = ["Overview", "Network", "Timeline", "Communications", "Financial", "Evidence", "Alerts"];

function riskStyle(r: string): React.CSSProperties {
  if (r === "high") return { color: "var(--color-alert-critical)", borderColor: "var(--color-alert-critical)", background: "var(--color-surface-2)" };
  if (r === "medium") return { color: "var(--color-alert-high)", borderColor: "var(--color-alert-high)", background: "var(--color-surface-2)" };
  return { color: "var(--color-text-muted)", borderColor: "var(--color-border-strong)", background: "var(--color-surface-2)" };
}

export default function PersonProfile({ personId, onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState("Overview");
  const person = persons.find((p) => p.id === personId) || persons[0];

  const personAlerts = alerts.filter((a) => a.entity === person.id);
  const personTimeline = timelineEvents.filter((e) => e.entities.includes(person.id));

  const importanceReasons = [
    { reason: "Highest degree centrality: 7 direct connections", icon: <Link2 size={16} className="text-[var(--color-primary)]" /> },
    { reason: "Betweenness centrality: connects 3 separate cluster groups", icon: <Network size={16} className="text-[var(--color-accent)]" /> },
    { reason: "Financial anomaly flag: ₹18.4L flagged transaction", icon: <CreditCard size={16} className="text-[var(--color-alert-critical)]" /> },
    { reason: "Communication burst: 60 calls/day spike (12× normal baseline)", icon: <Radio size={16} className="text-[var(--color-alert-high)]" /> },
    { reason: "Cross-case entity: appears in multiple active investigations", icon: <Folder size={16} className="text-[var(--color-success)]" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)]">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)] mb-4">
            <button className="hover:text-[var(--color-text-primary)] transition-colors" onClick={() => onNavigate("case-detail", "CASE-2026-017")}>
              CASE-2026-017
            </button>
            <ChevronRight size={12} />
            <span className="text-[var(--color-primary)] font-mono">360° Intelligence Profile</span>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              <img src={person.photo} alt="" className="w-20 h-20 rounded-sm object-cover border border-[var(--color-border-strong)] flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-sm border uppercase tracking-widest" style={riskStyle(person.risk)}>
                    {person.risk} Risk Indicator
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)] font-mono">{person.id}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">{person.name}</h1>
                <p className="text-[var(--color-primary)] text-[14px] font-medium mt-0.5">{person.role}</p>
                {person.alias.length > 0 && <p className="text-[12px] text-[var(--color-text-muted)] mt-1">Aliases: {person.alias.join(", ")}</p>}
              </div>
            </div>

            <div className="flex gap-2.5 flex-wrap self-start md:self-auto">
              {person.financialFlag && (
                <span className="text-[11px] bg-[var(--color-surface-2)] text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1.5 rounded-sm font-semibold flex items-center gap-1.5">
                  <CreditCard size={13} /> Financial Alert
                </span>
              )}
              {person.communicationFlag && (
                <span className="text-[11px] bg-[var(--color-surface-2)] text-[var(--color-alert-high)] border border-[var(--color-alert-high)] px-3 py-1.5 rounded-sm font-semibold flex items-center gap-1.5">
                  <Radio size={13} /> CDR Anomaly
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-[1440px] mx-auto px-6 flex gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t} className={`gov-tab whitespace-nowrap ${activeTab === t ? "is-active" : ""}`} onClick={() => setActiveTab(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        {activeTab === "Overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Identity info */}
              <div className="gov-panel p-6">
                <h3 className="font-bold text-[var(--color-text-primary)] text-[15px] uppercase tracking-wider mb-4">Identity Intelligence</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ["Full Legal Name", person.name],
                    ["Entity Identifier", person.id],
                    ["Date of Birth", person.dob],
                    ["Registered Address", person.address],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-[var(--color-surface-2)] rounded-sm p-3.5 border border-[var(--color-border-subtle)]">
                      <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest mb-1">{k}</div>
                      <div className="text-[13px] font-medium text-[var(--color-text-primary)]">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Why important */}
              {person.risk === "high" && (
                <div className="gov-panel p-6" style={{ borderColor: "var(--color-alert-critical)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-[var(--color-alert-critical)]" />
                    <h3 className="font-bold text-[var(--color-alert-critical)] text-[14px] uppercase tracking-wider">Algorithmic Risk Drivers</h3>
                  </div>
                  <p className="text-[12px] text-[var(--color-text-muted)] mb-4 italic">
                    Automated analytical correlation generated from knowledge graph topology and evidence matching. Requires human investigator verification.
                  </p>
                  <div className="space-y-2.5">
                    {importanceReasons.map((r, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-[var(--color-surface-2)] rounded-sm border border-[var(--color-border-subtle)]">
                        <div className="p-2 rounded-sm bg-[var(--color-surface)] border border-[var(--color-border-strong)] flex-shrink-0">{r.icon}</div>
                        <span className="text-[13px] text-[var(--color-text-primary)] font-medium">{r.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Case notes */}
              <div className="gov-panel p-6">
                <h3 className="font-bold text-[var(--color-text-primary)] text-[15px] uppercase tracking-wider mb-2">Investigator Field Notes</h3>
                <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{person.notes}</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Phone numbers */}
              <div className="gov-panel p-5">
                <h3 className="font-bold text-[var(--color-text-primary)] text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Phone size={14} className="text-[var(--color-primary)]" /> Communications
                </h3>
                {person.phones.map((ph) => (
                  <div key={ph} className="flex items-center gap-2 py-2 border-b border-[var(--color-border-subtle)] last:border-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--entity-phone)" }} />
                    <span className="text-[13px] font-mono text-[var(--color-text-primary)]">{ph}</span>
                  </div>
                ))}
              </div>

              {/* Vehicles */}
              {person.vehicles.length > 0 && (
                <div className="gov-panel p-5">
                  <h3 className="font-bold text-[var(--color-text-primary)] text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Car size={14} className="text-[var(--color-accent)]" /> Associated Vehicles
                  </h3>
                  {person.vehicles.map((v) => (
                    <div key={v} className="flex items-center gap-2 py-2 border-b border-[var(--color-border-subtle)] last:border-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--entity-vehicle)" }} />
                      <span className="text-[13px] font-mono text-[var(--color-text-primary)]">{v}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Associates */}
              <div className="gov-panel p-5">
                <h3 className="font-bold text-[var(--color-text-primary)] text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Activity size={14} className="text-[var(--color-primary)]" /> Network Associates
                </h3>
                {person.associates.map((a) => (
                  <button
                    key={a}
                    className="w-full flex items-center gap-2 py-2 border-b border-[var(--color-border-subtle)] last:border-0 group hover:bg-[var(--color-surface-2)] rounded-sm px-2 transition-colors"
                    onClick={() => onNavigate("person", a)}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--color-primary)" }} />
                    <span className="text-[13px] font-mono text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{a}</span>
                    <ChevronRight size={12} className="text-[var(--color-text-muted)] ml-auto group-hover:text-[var(--color-primary)]" />
                  </button>
                ))}
              </div>

              {/* Cases */}
              <div className="gov-panel p-5">
                <h3 className="font-bold text-[var(--color-text-primary)] text-[13px] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={14} className="text-[var(--color-accent)]" /> Linked Case Dossiers
                </h3>
                {person.cases.map((c) => (
                  <button
                    key={c}
                    className="w-full flex items-center gap-2 py-2 border-b border-[var(--color-border-subtle)] last:border-0 group hover:bg-[var(--color-surface-2)] rounded-sm px-2 transition-colors"
                    onClick={() => onNavigate("case-detail", c)}
                  >
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--color-accent)" }} />
                    <span className="text-[13px] font-mono text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{c}</span>
                    <ChevronRight size={12} className="text-[var(--color-text-muted)] ml-auto group-hover:text-[var(--color-primary)]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Timeline" && (
          <div className="relative max-w-[760px] mx-auto py-4">
            <div className="timeline-line" />
            {personTimeline.map((ev, i) => (
              <div key={ev.id} className={`relative flex ${i % 2 === 0 ? "justify-start" : "justify-end"} mb-6`}>
                <div className="absolute left-1/2 top-4 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-[var(--color-surface)] z-10 bg-[var(--color-primary)]" />
                <div className={`w-[45%] gov-panel p-4 ${i % 2 === 0 ? "mr-auto" : "ml-auto"}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-[var(--color-primary)]">{ev.timestamp}</span>
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm border uppercase"
                      style={{ color: "var(--color-success)", borderColor: "var(--color-success)", background: "var(--color-surface-2)" }}
                    >
                      {ev.confidence}
                    </span>
                  </div>
                  <h4 className="font-bold text-[13px] text-[var(--color-text-primary)]">{ev.title}</h4>
                  <p className="text-[11px] text-[var(--color-text-secondary)] mt-1 leading-relaxed">{ev.description}</p>
                  {ev.location && (
                    <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)] mt-2">
                      <MapPin size={11} className="text-[var(--color-primary)]" />
                      <span>{ev.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Financial" && (
          <div className="space-y-4">
            <div className="gov-panel p-6">
              <h3 className="font-bold text-[var(--color-text-primary)] text-base mb-4 uppercase tracking-wider">Financial Pattern Analysis</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm p-4">
                  <div className="text-2xl font-bold text-[var(--color-alert-critical)] stat-number">₹18.4L</div>
                  <div className="text-[11px] text-[var(--color-text-muted)] mt-1 uppercase tracking-wider">Highest Anomaly Spike</div>
                </div>
                <div className="bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm p-4">
                  <div className="text-2xl font-bold text-[var(--color-alert-high)] stat-number">3</div>
                  <div className="text-[11px] text-[var(--color-text-muted)] mt-1 uppercase tracking-wider">Flagged Movements</div>
                </div>
                <div className="bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm p-4">
                  <div className="text-2xl font-bold text-[var(--color-primary)] stat-number">ACCT-A2</div>
                  <div className="text-[11px] text-[var(--color-text-muted)] mt-1 uppercase tracking-wider">Primary Transit Node</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {transactions.map((t) => (
                <div key={t.id} className="gov-panel p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {t.flagged && <AlertTriangle size={14} className="text-[var(--color-alert-critical)]" />}
                        <span className="text-[12px] font-mono text-[var(--color-text-muted)]">{t.id}</span>
                        <span className="text-[11px] text-[var(--color-text-muted)]">{t.date}</span>
                        <span className="text-[10px] bg-[var(--color-surface-2)] border border-[var(--color-border-strong)] px-1.5 py-0.5 rounded-sm text-[var(--color-text-secondary)] uppercase">
                          {t.method}
                        </span>
                      </div>
                      <p className="text-[14px] text-[var(--color-text-primary)] font-semibold mt-1">
                        {t.from} <span className="text-[var(--color-primary)]">→</span> {t.to}
                      </p>
                      {t.reason && <p className="text-[12px] text-[var(--color-alert-critical)] mt-1">{t.reason}</p>}
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold stat-number ${t.flagged ? "text-[var(--color-alert-critical)]" : "text-[var(--color-text-primary)]"}`}>
                        ₹{(t.amount / 100000).toFixed(1)}L
                      </div>
                      <div className="text-[10px] uppercase font-bold tracking-wider mt-0.5 text-[var(--color-text-muted)]">
                        {t.flagged ? "Flagged Flow" : "Audited Clear"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Alerts" && (
          <div className="space-y-4">
            {personAlerts.length === 0 ? (
              <div className="gov-panel p-12 text-center">
                <Shield size={32} className="text-[var(--color-text-muted)] mx-auto mb-3" />
                <p className="text-[var(--color-text-secondary)] text-sm">No unresolved alerts for this entity profile.</p>
              </div>
            ) : (
              personAlerts.map((a) => (
                <div key={a.id} className="gov-panel gov-accent-top p-6" style={{ borderTopColor: "var(--color-alert-critical)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={16} className="text-[var(--color-alert-critical)] flex-shrink-0" />
                    <h3 className="font-bold text-[var(--color-text-primary)] text-base">{a.title}</h3>
                  </div>
                  <p className="text-[13px] text-[var(--color-text-secondary)] mb-3">{a.description}</p>
                  <div className="bg-[var(--color-surface-2)] rounded-sm p-3.5 border border-[var(--color-border-subtle)] text-[12px]">
                    <span className="text-[var(--color-text-muted)]">Expected baseline: {a.normal} · </span>
                    <span className="text-[var(--color-alert-critical)] font-bold font-mono">Observed anomaly: {a.observed}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {(activeTab === "Network" || activeTab === "Communications" || activeTab === "Evidence") && (
          <div className="gov-panel p-16 text-center max-w-xl mx-auto">
            <Activity size={36} className="text-[var(--color-primary)] mx-auto mb-4" />
            <h3 className="font-bold text-[var(--color-text-primary)] text-lg mb-2">{activeTab} Intelligence View</h3>
            <p className="text-[13px] text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              {activeTab === "Network"
                ? "Inspect this entity's direct linkages, transitive paths, and cluster density in the interactive knowledge graph."
                : activeTab === "Communications"
                ? "CDR analysis reveals call volume spikes and nocturnal communications with associated burner phones."
                : "Explore cross-referenced forensic artifacts, CCTV extractions, and FIU data associated with this individual."}
            </p>
            <button className="btn-premium" onClick={() => onNavigate(activeTab === "Evidence" ? "evidence" : "graph")}>
              {activeTab === "Network" ? "Open in Investigation Graph" : activeTab === "Communications" ? "Launch Telemetry Visualizer" : "Examine Evidence Vault"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
