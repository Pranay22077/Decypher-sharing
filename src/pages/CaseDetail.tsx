import { useState } from "react";
import {
  ChevronRight, AlertTriangle, Users, Upload, FileText, Activity,
  Brain, Eye, Network, Plus, CheckCircle, CreditCard, Radio, X
} from "../components/icons";
import { cases, persons, alerts, evidence } from "../data/dummy";
import InvestigationGraph from "../components/InvestigationGraph";
import { graphEdges } from "../data/dummy";

interface Props {
  caseId: string;
  onNavigate: (page: string, param?: string) => void;
}

const tabs = [
  { id: "overview", label: "Overview", icon: <Eye size={14} /> },
  { id: "graph", label: "Investigation Graph", icon: <Network size={14} /> },
  { id: "people", label: "People & Entities", icon: <Users size={14} /> },
  { id: "evidence", label: "Evidence", icon: <FileText size={14} /> },
  { id: "alerts", label: "Alerts", icon: <AlertTriangle size={14} /> },
  { id: "upload", label: "Upload Evidence", icon: <Upload size={14} /> },
];

function priorityStyle(p: string): React.CSSProperties {
  if (p === "high") return { color: "var(--color-alert-critical)", borderColor: "var(--color-alert-critical)", background: "var(--color-surface-2)" };
  return { color: "var(--color-alert-high)", borderColor: "var(--color-alert-high)", background: "var(--color-surface-2)" };
}

function riskStyle(r: string): React.CSSProperties {
  if (r === "high") return { color: "var(--color-alert-critical)", borderColor: "var(--color-alert-critical)", background: "var(--color-surface-2)" };
  if (r === "medium") return { color: "var(--color-alert-high)", borderColor: "var(--color-alert-high)", background: "var(--color-surface-2)" };
  return { color: "var(--color-text-muted)", borderColor: "var(--color-border-strong)", background: "var(--color-surface-2)" };
}

const successStyle: React.CSSProperties = { color: "var(--color-success)", borderColor: "var(--color-success)", background: "var(--color-surface-2)" };
const criticalStyle: React.CSSProperties = { color: "var(--color-alert-critical)", borderColor: "var(--color-alert-critical)", background: "var(--color-surface-2)" };

export default function CaseDetail({ caseId, onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState("graph");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const [uploadStep, setUploadStep] = useState(0);
  const [showPersonProfile, setShowPersonProfile] = useState<string | null>(null);

  const currentCase = cases.find(c => c.id === caseId) || cases[0];
  const caseAlerts = alerts.slice(0, 5);
  const caseEvidence = evidence;
  const casePersons = persons;

  const uploadSteps = [
    "Hashing & Securing File", "Verifying Chain of Custody", "Optical Character Recognition", "Extracting Entities (NLP/NER)",
    "Resolving Cross-Case Entities", "Mapping Knowledge Graph Relationships", "Generating Explainable Insights"
  ];

  const handleUpload = () => {
    setShowUploadFlow(true);
    setUploadStep(0);
    const interval = setInterval(() => {
      setUploadStep(s => {
        if (s >= uploadSteps.length - 1) { clearInterval(interval); return s; }
        return s + 1;
      });
    }, 600);
  };

  const composition = [
    { label: "Persons", value: 6, color: "var(--entity-person)" },
    { label: "Organizations", value: 3, color: "var(--entity-org)" },
    { label: "Phone Numbers", value: 3, color: "var(--entity-phone)" },
    { label: "Vehicles", value: 3, color: "var(--entity-vehicle)" },
    { label: "Locations", value: 2, color: "var(--entity-location)" },
    { label: "Accounts", value: 2, color: "var(--entity-account)" },
    { label: "Cases", value: 1, color: "var(--entity-case)" },
    { label: "Events", value: 1, color: "var(--entity-event)" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)]">
      {/* Case header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-6">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2 text-[11px] text-[var(--color-text-muted)] mb-3">
            <button className="hover:text-[var(--color-text-primary)] transition-colors" onClick={() => onNavigate("cases")}>Cases</button>
            <ChevronRight size={12} />
            <span className="text-[var(--color-primary)] font-mono">{currentCase.id}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-sm border uppercase tracking-widest" style={priorityStyle(currentCase.priority)}>
                  {currentCase.priority} Priority
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-sm border uppercase tracking-widest" style={successStyle}>
                  {currentCase.status}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">{currentCase.title}</h1>
              <p className="text-[var(--color-text-secondary)] text-[13px] mt-1">{currentCase.id} · {currentCase.type} · {currentCase.location}</p>
            </div>
            <div className="flex gap-3 flex-shrink-0 self-start md:self-auto">
              <button className="btn-premium" onClick={() => setActiveTab("upload")}>
                <Upload size={14} /> Ingest Evidence
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-8 mt-6 pt-5 border-t border-[var(--color-border-subtle)] flex-wrap">
            {[
              { v: currentCase.entities, l: "Tracked Entities", color: "text-[var(--color-primary)]" },
              { v: caseAlerts.length, l: "Active Alerts", color: "text-[var(--color-alert-critical)]" },
              { v: caseEvidence.length, l: "Evidence Items", color: "text-[var(--color-success)]" },
              { v: casePersons.length, l: "Persons of Interest", color: "text-[var(--color-accent)]" },
            ].map((s, i) => (
              <div key={i} className="text-left">
                <div className={`text-2xl font-bold stat-number ${s.color}`}>{s.v}</div>
                <div className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] sticky top-16 z-30">
        <div className="max-w-[1440px] mx-auto px-6 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`gov-tab flex items-center gap-2 whitespace-nowrap ${activeTab === t.id ? "is-active" : ""}`}
              onClick={() => { setActiveTab(t.id); if (t.id === "upload") setShowUploadFlow(false); }}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-6">
        {/* ── GRAPH TAB ──────────────────────────────────────────────── */}
        {activeTab === "graph" && (
          <div>
            {/* Type filters */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-[12px] text-[var(--color-text-muted)] font-medium">Filter Nodes:</span>
              {["All", "person", "org", "phone", "vehicle", "location", "account", "case", "event"].map(t => {
                const active = (t === "All" && !selectedFilter) || selectedFilter === t;
                return (
                  <button
                    key={t}
                    className={`gov-chip capitalize ${active ? "is-active" : ""}`}
                    aria-pressed={active}
                    onClick={() => setSelectedFilter(t === "All" ? null : t)}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="gov-panel p-2">
                  <InvestigationGraph
                    filterType={selectedFilter}
                    height={580}
                    onNodeClick={n => {
                      if (n.type === "person") setShowPersonProfile(n.id);
                    }}
                  />
                </div>
                <p className="text-[11px] text-[var(--color-text-muted)] mt-2.5 text-center">
                  Click a node to focus · Drag to reposition · Scroll to zoom · Click Person node to launch 360° profile
                </p>
              </div>

              <div className="space-y-4">
                {/* Graph info */}
                <div className="gov-panel p-5">
                  <h3 className="font-bold text-[var(--color-text-primary)] text-[14px] uppercase tracking-wider mb-4">Network Composition</h3>
                  <div className="space-y-2.5">
                    {composition.map(s => (
                      <div key={s.label} className="flex items-center justify-between text-[12px]">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: s.color }} />
                          <span className="text-[var(--color-text-secondary)]">{s.label}</span>
                        </div>
                        <span className="font-semibold text-[var(--color-text-primary)]">{s.value}</span>
                      </div>
                    ))}
                    <div className="border-t border-[var(--color-border-subtle)] pt-3 mt-3">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-[var(--color-text-muted)]">Total Relationships</span>
                        <span className="font-bold text-[var(--color-primary)]">{graphEdges.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Roles */}
                <div className="gov-panel p-5" style={{ borderColor: "var(--color-alert-critical)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={15} className="text-[var(--color-alert-critical)]" />
                    <h3 className="font-bold text-[var(--color-alert-critical)] text-[13px] uppercase tracking-wider">Detected Roles</h3>
                  </div>
                  {[
                    { id: "PERSON-A", role: "Primary Entity, degree centrality 7", color: "text-[var(--color-alert-critical)]" },
                    { id: "PERSON-F", role: "Bridge Node, connects 2 cross-case clusters", color: "text-[var(--color-alert-high)]" },
                    { id: "ORG-042", role: "Hub Entity, 3 primary suspects linked", color: "text-[var(--color-primary)]" },
                  ].map(r => (
                    <button
                      key={r.id}
                      className="w-full text-left p-2.5 rounded-sm bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] hover:border-[var(--color-border-strong)] transition-colors mb-2 group"
                      onClick={() => setShowPersonProfile(r.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{r.id}</span>
                        <ChevronRight size={13} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]" />
                      </div>
                      <div className={`text-[11px] mt-0.5 ${r.color}`}>{r.role}</div>
                    </button>
                  ))}
                </div>

                {/* Copilot hint */}
                <div className="gov-panel p-4 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                    <Brain size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[12px] font-semibold text-[var(--color-text-primary)]">AI Copilot Ready</div>
                    <div className="text-[11px] text-[var(--color-text-muted)]">Click floating assistant in bottom-right</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── OVERVIEW TAB ────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="gov-panel p-6">
                <h3 className="font-bold text-[var(--color-text-primary)] text-[15px] uppercase tracking-wider mb-3">Case Brief</h3>
                <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed">{currentCase.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-[12px]">
                  {[
                    ["Case ID", currentCase.id],
                    ["Type", currentCase.type],
                    ["Status", currentCase.status],
                    ["Priority", currentCase.priority],
                    ["Date Filed", currentCase.date],
                    ["Location", currentCase.location],
                    ["Assigned To", currentCase.assignedTo],
                    ["Last Updated", currentCase.lastUpdated],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-[var(--color-surface-2)] rounded-sm p-3 border border-[var(--color-border-subtle)]">
                      <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest mb-1">{k}</div>
                      <div className="font-semibold text-[var(--color-text-primary)]">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="gov-panel p-6">
                <h3 className="font-bold text-[var(--color-text-primary)] text-[15px] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity size={16} className="text-[var(--color-primary)]" /> Investigation Progress & Changes
                </h3>
                <div className="space-y-3">
                  {[
                    "Critical alert generated: Communication burst detected on PERSON-A (60 calls/day)",
                    "3 new CDR records ingested and cross-matched with telecom cell towers",
                    "Bridge entity resolved: PERSON-F connected to CASE-2025-089 syndicate",
                    "CCTV surveillance footage processed via facial recognition pipeline",
                    "Financial anomaly flagged: ₹18.4L transfer to offshore transit entity",
                  ].map((c, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-[var(--color-surface-2)] rounded-sm border border-[var(--color-border-subtle)]">
                      <span className="w-1.5 h-1.5 bg-[var(--color-primary)] mt-[6px] flex-shrink-0" />
                      <span className="text-[13px] text-[var(--color-text-secondary)]">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-[var(--color-text-primary)] text-[14px] uppercase tracking-wider">High-Priority Alerts</h3>
              {caseAlerts.slice(0, 3).map(a => (
                <div key={a.id} className="gov-panel p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={16} className={a.severity === "critical" ? "text-[var(--color-alert-critical)] mt-0.5" : "text-[var(--color-alert-high)] mt-0.5"} />
                    <div>
                      <div className="text-[12px] font-bold text-[var(--color-text-primary)]">{a.title}</div>
                      <div className="text-[11px] text-[var(--color-text-secondary)] mt-1 leading-relaxed">{a.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PEOPLE TAB ──────────────────────────────────────────────── */}
        {activeTab === "people" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {casePersons.map(p => (
              <div key={p.id} className="gov-panel p-5 cursor-pointer group hover:border-[var(--color-primary)] transition-colors" onClick={() => onNavigate("person", p.id)}>
                <div className="flex items-start gap-4">
                  <img src={p.photo} alt="" className="w-14 h-14 rounded-sm object-cover border border-[var(--color-border-strong)] group-hover:border-[var(--color-primary)] transition-colors" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[var(--color-text-primary)] text-[14px] group-hover:text-[var(--color-primary)] transition-colors truncate">{p.name}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm border uppercase tracking-widest" style={riskStyle(p.risk)}>{p.risk}</span>
                    </div>
                    <p className="text-[12px] text-[var(--color-text-secondary)] truncate">{p.role}</p>
                    <div className="flex gap-2 mt-2">
                      {p.financialFlag && (
                        <span className="text-[10px] bg-[var(--color-surface-2)] text-[var(--color-primary)] border border-[var(--color-primary)] px-2 py-0.5 rounded-sm flex items-center gap-1 font-semibold">
                          <CreditCard size={10} /> Fin. Flag
                        </span>
                      )}
                      {p.communicationFlag && (
                        <span className="text-[10px] bg-[var(--color-surface-2)] text-[var(--color-alert-high)] border border-[var(--color-alert-high)] px-2 py-0.5 rounded-sm flex items-center gap-1 font-semibold">
                          <Radio size={10} /> CDR Alert
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between text-[11px]">
                  <span className="text-[var(--color-text-muted)]">{p.associates.length} associates · {p.cases.length} cases</span>
                  <span className="text-[var(--color-primary)] font-semibold group-hover:underline flex items-center gap-1">
                    360° Profile <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── EVIDENCE TAB ────────────────────────────────────────────── */}
        {activeTab === "evidence" && (
          <div className="space-y-4">
            {caseEvidence.map(ev => (
              <div key={ev.id} className="gov-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-[var(--color-text-primary)] text-[14px]">{ev.title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm border uppercase tracking-widest" style={successStyle}>{ev.status}</span>
                      <span className="text-[11px] font-mono text-[var(--color-text-muted)]">{ev.id}</span>
                    </div>
                    <p className="text-[12px] text-[var(--color-text-secondary)]">{ev.source} · {ev.date} · {ev.size}</p>
                    <p className="text-[11px] font-mono text-[var(--color-text-muted)] mt-1">{ev.hash}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {ev.entities.map(e => (
                        <span key={e} className="text-[10px] bg-[var(--color-surface-2)] border border-[var(--color-border-strong)] text-[var(--color-text-primary)] px-2 py-0.5 rounded-sm font-mono">{e}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 text-[11px] text-[var(--color-text-muted)]">
                  <div>Chain of Custody:</div>
                  <div className="font-semibold text-[var(--color-text-primary)] mt-0.5">{ev.uploadedBy}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ALERTS TAB ──────────────────────────────────────────────── */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            {caseAlerts.map(a => (
              <div key={a.id} className="gov-panel gov-accent-top p-6" style={{ borderTopColor: "var(--color-alert-critical)" }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-sm border uppercase tracking-widest" style={criticalStyle}>{a.severity}</span>
                      <span className="text-[11px] bg-[var(--color-surface-2)] border border-[var(--color-border-strong)] text-[var(--color-text-secondary)] px-2.5 py-0.5 rounded-sm font-mono">{a.type}</span>
                      <span className="text-[11px] text-[var(--color-text-muted)]">{a.timestamp}</span>
                    </div>
                    <h3 className="font-bold text-[var(--color-text-primary)] text-base mb-1">{a.title}</h3>
                    <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{a.description}</p>

                    <div className="mt-4 bg-[var(--color-surface-2)] rounded-sm p-4 border border-[var(--color-border-subtle)]">
                      <div className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">Anomaly Baseline Analysis</div>
                      <p className="text-[12px] text-[var(--color-text-primary)] mb-3">{a.reason}</p>
                      <div className="flex gap-6 text-[12px]">
                        <div>
                          <span className="text-[var(--color-text-muted)]">Standard Baseline: </span>
                          <span className="text-[var(--color-text-primary)] font-mono ml-1">{a.normal}</span>
                        </div>
                        <div>
                          <span className="text-[var(--color-text-muted)]">Observed Spike: </span>
                          <span className="text-[var(--color-alert-critical)] font-bold font-mono ml-1">{a.observed}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-4 text-[12px]">
                      <button className="text-[var(--color-primary)] font-semibold flex items-center gap-1 hover:underline" onClick={() => onNavigate("graph")}>
                        View in Master Graph <ChevronRight size={12} />
                      </button>
                      <button className="text-[var(--color-text-secondary)] font-semibold flex items-center gap-1 hover:underline" onClick={() => onNavigate("evidence")}>
                        Examine Linked Evidence <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── UPLOAD TAB ──────────────────────────────────────────────── */}
        {activeTab === "upload" && (
          <div className="max-w-[760px] mx-auto">
            <div className="gov-panel p-8">
              <h2 className="font-bold text-[var(--color-text-primary)] text-xl mb-1">Ingest Evidence & Telemetry</h2>
              <p className="text-[13px] text-[var(--color-text-secondary)] mb-6">Upload FIRs, CDR records, financial statements, CCTV logs, or surveillance reports.</p>

              {!showUploadFlow ? (
                <>
                  <div className="border-2 border-dashed border-[var(--color-border-strong)] hover:border-[var(--color-primary)] rounded-sm p-12 text-center transition-colors cursor-pointer group bg-[var(--color-surface-2)]" onClick={handleUpload}>
                    <Upload size={36} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] mx-auto mb-3 transition-colors" />
                    <p className="font-semibold text-[var(--color-text-primary)] text-base">Select file or drag and drop to ingest</p>
                    <p className="text-[12px] text-[var(--color-text-muted)] mt-1.5">Supported: PDF, CSV, MP4, MP3, JPG, JSON (Max 500 MB)</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                    {["FIR / Charge Sheet", "CDR / IPDR Logs", "Bank Statements", "CCTV Video Footage", "Wiretap Audio", "Intelligence Memo"].map(t => (
                      <button key={t} className="border border-[var(--color-border-subtle)] rounded-sm bg-[var(--color-surface-2)] p-3.5 text-[12px] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-colors text-left flex items-center gap-2" onClick={handleUpload}>
                        <Plus size={13} className="flex-shrink-0" /> {t}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <div className="text-[15px] font-bold text-[var(--color-text-primary)]">Processing Evidence Stream...</div>
                    <div className="text-[12px] font-mono text-[var(--color-primary)] mt-1">FIR-2026-DL-INTELLIGENCE.pdf</div>
                  </div>
                  {uploadSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)]">
                      <div className="flex-shrink-0">
                        {i < uploadStep ? (
                          <CheckCircle size={18} className="text-[var(--color-success)]" />
                        ) : i === uploadStep ? (
                          <div className="w-4 h-4 border-2 border-[var(--color-border-strong)] border-t-[var(--color-primary)] rounded-full animate-spin" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-[var(--color-border-strong)] rounded-full" />
                        )}
                      </div>
                      <span className={`text-[13px] ${i <= uploadStep ? "text-[var(--color-text-primary)] font-medium" : "text-[var(--color-text-muted)]"}`}>{step}</span>
                    </div>
                  ))}

                  {uploadStep === uploadSteps.length - 1 && (
                    <div className="mt-6 p-5 bg-[var(--color-surface-2)] border border-[var(--color-success)] rounded-sm">
                      <h3 className="font-bold text-[var(--color-success)] text-[14px] mb-2 flex items-center gap-2">
                        <CheckCircle size={16} /> Knowledge Graph Updated Successfully
                      </h3>
                      <p className="text-[12px] text-[var(--color-text-secondary)] mb-3">6 entities and 8 relationships resolved from document:</p>
                      <div className="flex flex-wrap gap-2">
                        {["PERSON-A", "LOCATION-01", "PHONE-9810XXXX", "ORG-042", "2026-01-14", "EVENT-001"].map(e => (
                          <span key={e} className="text-[11px] bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-text-primary)] px-2.5 py-1 rounded-sm font-mono">{e}</span>
                        ))}
                      </div>
                      <button className="btn-premium btn-sm mt-4" onClick={() => setActiveTab("graph")}>
                        Inspect in Master Graph
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Person quick profile modal */}
      {showPersonProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(11,24,45,0.55)" }}>
          <div className="gov-panel bg-[var(--color-surface)] border border-[var(--color-border-strong)] w-full max-w-[480px] p-6 relative">
            <button className="absolute top-5 right-5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]" onClick={() => setShowPersonProfile(null)} aria-label="Close">
              <X size={18} />
            </button>
            <h3 className="font-bold text-[var(--color-text-primary)] text-lg mb-2">{showPersonProfile}</h3>
            <p className="text-[13px] text-[var(--color-text-secondary)] mb-6">Explore comprehensive timeline, communication logs, financial records, and associates.</p>
            <div className="flex gap-3">
              <button className="btn-premium flex-1" onClick={() => { setShowPersonProfile(null); onNavigate("person", showPersonProfile); }}>
                Open 360° Profile
              </button>
              <button className="btn-premium-outline" onClick={() => setShowPersonProfile(null)}>Dismiss</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
