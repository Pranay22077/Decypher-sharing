import { useState } from "react";
import {
  AlertTriangle, FolderOpen, Clock, Activity, Shield, TrendingUp,
  Users, ChevronRight, Bell, ArrowUpRight, Database, MapPin, User, Search
} from "../components/icons";
import { cases, alerts } from "../data/dummy";

interface Props {
  onNavigate: (page: string, param?: string) => void;
  userRole: string;
}

function priorityStyle(p: string): React.CSSProperties {
  if (p === "high") return { color: "var(--color-alert-critical)", borderColor: "var(--color-alert-critical)", background: "var(--color-surface-2)" };
  if (p === "medium") return { color: "var(--color-alert-high)", borderColor: "var(--color-alert-high)", background: "var(--color-surface-2)" };
  return { color: "var(--color-text-muted)", borderColor: "var(--color-border-strong)", background: "var(--color-surface-2)" };
}

function severityStyle(s: string): React.CSSProperties {
  if (s === "critical") return { color: "var(--color-alert-critical)", borderColor: "var(--color-alert-critical)", background: "var(--color-surface-2)" };
  if (s === "high") return { color: "var(--color-alert-high)", borderColor: "var(--color-alert-high)", background: "var(--color-surface-2)" };
  return { color: "var(--color-text-muted)", borderColor: "var(--color-border-strong)", background: "var(--color-surface-2)" };
}

function dotColor(p: string): string {
  if (p === "critical" || p === "alert") return "var(--color-alert-critical)";
  if (p === "high") return "var(--color-alert-high)";
  if (p === "medium") return "var(--color-alert-medium)";
  if (p === "resolved") return "var(--color-success)";
  if (p === "evidence") return "var(--color-primary)";
  return "var(--color-text-muted)";
}

export default function Dashboard({ onNavigate, userRole }: Props) {
  const [expandAlert, setExpandAlert] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const activeCases = cases.filter((c) => c.status === "active");
  const pendingCases = cases.filter((c) => c.status === "pending");
  const critAlerts = alerts.filter((a) => a.severity === "critical");
  const totalEntities = cases.reduce((s, c) => s + c.entities, 0);

  const q = searchQuery.trim().toLowerCase();
  const shownCases = q
    ? activeCases.filter((c) => c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.type.toLowerCase().includes(q))
    : activeCases;

  const recentActivity = [
    { time: "14:32", text: "New alert: communication burst detected on PERSON-A", type: "alert" },
    { time: "13:15", text: "Evidence processed: CCTV footage EVD-005", type: "evidence" },
    { time: "11:47", text: "CDR records updated: 3 new entries in CASE-2026-017", type: "update" },
    { time: "09:20", text: "Alert resolved: vehicle sighting verified for VEH-RJ14", type: "resolved" },
    { time: "Yesterday", text: "PERSON-F identified as cross-case bridge entity", type: "alert" },
    { time: "Yesterday", text: "Intelligence report processed for ORG-042 activity", type: "evidence" },
  ];

  const queue = [
    { id: "Q1", action: "Review communication burst on PERSON-A", case: "CASE-2026-017", priority: "critical" },
    { id: "Q2", action: "Verify vehicle occupant in VEH-DL01 CCTV sighting", case: "CASE-2026-017", priority: "high" },
    { id: "Q3", action: "Investigate ACCT-X3 unknown beneficiary", case: "CASE-2026-017", priority: "high" },
    { id: "Q4", action: "Confirm PERSON-F identity in CASE-2026-031", case: "CASE-2026-031", priority: "medium" },
    { id: "Q5", action: "Review location contradiction for PERSON-D (Jan 22)", case: "CASE-2026-017", priority: "medium" },
  ];

  const statCards = [
    { label: "Active Cases", value: activeCases.length, icon: <FolderOpen size={20} />, tone: "var(--color-primary)", click: "cases" },
    { label: "Critical Alerts", value: critAlerts.length, icon: <AlertTriangle size={20} />, tone: "var(--color-alert-critical)", click: "cases" },
    { label: "Pending Review", value: pendingCases.length, icon: <Clock size={20} />, tone: "var(--color-alert-high)", click: "cases" },
    { label: "Entities Tracked", value: totalEntities, icon: <Users size={20} />, tone: "var(--color-accent)", click: "graph" },
  ];

  const tools = [
    { label: "Investigation Graph", page: "graph", icon: <Activity size={16} /> },
    { label: "Geo Intelligence", page: "map", icon: <Database size={16} /> },
    { label: "Timeline Analysis", page: "timeline", icon: <Clock size={16} /> },
    { label: "Financial Trails", page: "financial", icon: <TrendingUp size={16} /> },
    { label: "Evidence Vault", page: "evidence", icon: <Shield size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)]">
      {/* Top section */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)]">
        <div className="max-w-[1440px] mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <div className="text-[11px] text-[var(--color-accent)] font-mono uppercase tracking-widest mb-2">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">Command Center</h1>
              <p className="text-[var(--color-text-secondary)] text-[14px] mt-1 capitalize">
                {userRole === "senior" ? "Senior Investigator" : userRole} Dashboard · Decypher Platform
              </p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-[var(--color-base-bg)] border border-[var(--color-border-strong)] focus-within:border-[var(--color-primary)] rounded-sm px-4 py-2 flex-1 md:w-64 transition-colors">
                <Search size={16} className="text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search active cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-[13px] outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
                />
              </div>
              <button className="btn-premium flex-shrink-0" onClick={() => onNavigate("cases")}>
                New Case
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {statCards.map((s, i) => (
              <button
                key={i}
                className="gov-panel gov-accent-top p-5 text-left group hover:border-[var(--color-primary)] transition-colors"
                onClick={() => onNavigate(s.click)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] flex items-center justify-center" style={{ color: s.tone }}>
                    {s.icon}
                  </div>
                  <ArrowUpRight size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
                </div>
                <div className="text-3xl font-bold stat-number tracking-tight" style={{ color: s.tone }}>{s.value}</div>
                <div className="text-[12px] font-medium text-[var(--color-text-secondary)] mt-1 uppercase tracking-wide">{s.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Cases */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[var(--color-text-primary)] text-[16px] uppercase tracking-wider">Active Cases</h2>
              <button className="text-[12px] text-[var(--color-primary)] font-semibold flex items-center gap-1 hover:underline" onClick={() => onNavigate("cases")}>
                View all cases <ChevronRight size={14} />
              </button>
            </div>

            {shownCases.length === 0 && (
              <div className="gov-panel p-8 text-center text-[13px] text-[var(--color-text-muted)]">
                No active cases match "{searchQuery}". Adjust your search to see results.
              </div>
            )}

            {shownCases.map((c) => (
              <div
                key={c.id}
                className="gov-panel p-6 cursor-pointer group hover:border-[var(--color-primary)] transition-colors"
                onClick={() => onNavigate("case-detail", c.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-sm border uppercase tracking-widest" style={priorityStyle(c.priority)}>{c.priority} priority</span>
                      <span className="text-[12px] text-[var(--color-text-muted)] font-mono tracking-wide">{c.id}</span>
                    </div>
                    <h3 className="font-bold text-[var(--color-text-primary)] text-[18px] group-hover:text-[var(--color-primary)] transition-colors mb-1">{c.title}</h3>
                    <p className="text-[13px] text-[var(--color-primary)] font-medium mb-2">{c.type}</p>
                    <p className="text-[13px] text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed mb-4">{c.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-[12px] text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-1.5 bg-[var(--color-surface-2)] px-3 py-1 rounded-sm border border-[var(--color-border-subtle)]">
                        <MapPin size={12} className="text-[var(--color-primary)]" />
                        <span>{c.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[var(--color-surface-2)] px-3 py-1 rounded-sm border border-[var(--color-border-subtle)]">
                        <User size={12} className="text-[var(--color-success)]" />
                        <span>{c.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm p-3 min-w-[80px] text-center">
                      <div className="text-xl font-bold stat-number text-[var(--color-text-primary)]">{c.entities}</div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-0.5">Entities</div>
                    </div>
                    {c.alerts > 0 && (
                      <div className="mt-3 flex items-center justify-center gap-1.5 border rounded-sm px-2 py-1" style={{ color: "var(--color-alert-critical)", borderColor: "var(--color-alert-critical)", background: "var(--color-surface-2)" }}>
                        <Bell size={12} />
                        <span className="text-[11px] font-bold">{c.alerts} alerts</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--color-border-subtle)]">
                  <span className="text-[11px] text-[var(--color-text-muted)]">Last updated: {c.lastUpdated}</span>
                  <span className="text-[12px] text-[var(--color-primary)] font-semibold flex items-center gap-1 group-hover:underline">
                    Open investigation workspace <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}

            {/* Investigation Queue */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[var(--color-text-primary)] text-[16px] uppercase tracking-wider">Action Queue</h2>
                <span className="text-[12px] bg-[var(--color-surface)] border border-[var(--color-border-strong)] px-3 py-1 rounded-sm text-[var(--color-text-secondary)]">{queue.length} pending items</span>
              </div>
              <div className="gov-panel overflow-hidden">
                <div className="divide-y divide-[var(--color-border-subtle)]">
                  {queue.map((item) => (
                    <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-[var(--color-surface-2)] transition-colors cursor-pointer group" onClick={() => onNavigate("case-detail", item.case)}>
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dotColor(item.priority) }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{item.action}</p>
                        <p className="text-[11px] font-mono text-[var(--color-text-muted)] mt-1">{item.case}</p>
                      </div>
                      <span className="p-2 rounded-sm border border-[var(--color-border-strong)] text-[var(--color-text-muted)] group-hover:border-[var(--color-primary)] group-hover:text-[var(--color-primary)] transition-colors">
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-8">
            {/* Alerts */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[var(--color-text-primary)] text-[16px] uppercase tracking-wider">Intelligence Alerts</h2>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-sm border tracking-widest" style={severityStyle("critical")}>{critAlerts.length} CRITICAL</span>
              </div>
              <div className="space-y-3">
                {alerts.slice(0, 5).map((a) => (
                  <div
                    key={a.id}
                    className={`gov-panel p-4 cursor-pointer transition-colors ${expandAlert === a.id ? "border-[var(--color-alert-critical)]" : "hover:border-[var(--color-border-strong)]"}`}
                    onClick={() => setExpandAlert((e) => (e === a.id ? null : a.id))}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-sm mt-0.5 flex-shrink-0 bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)]" style={{ color: dotColor(a.severity) }}>
                        <AlertTriangle size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-sm border uppercase tracking-widest" style={severityStyle(a.severity)}>{a.severity}</span>
                          <span className="text-[10px] text-[var(--color-text-muted)] font-mono">{a.type}</span>
                        </div>
                        <p className="text-[13px] font-medium text-[var(--color-text-primary)] leading-tight">{a.title}</p>

                        {expandAlert === a.id && (
                          <div className="mt-3 pt-3 border-t border-[var(--color-border-subtle)] space-y-2">
                            <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed">{a.description}</p>
                            <div className="bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm p-3 mt-2">
                              <p className="text-[11px] text-[var(--color-text-muted)] mb-1">Baseline: <span className="text-[var(--color-text-primary)] font-mono ml-1">{a.normal}</span></p>
                              <p className="text-[11px] text-[var(--color-alert-critical)] font-medium">Detected: <span className="font-mono ml-1">{a.observed}</span></p>
                            </div>
                            <div className="bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm p-3">
                              <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Rationale</div>
                              <p className="text-[11px] text-[var(--color-text-secondary)]">{a.reason}</p>
                            </div>
                            <button
                              className="btn-premium-outline btn-sm btn-block mt-2"
                              onClick={(e) => { e.stopPropagation(); onNavigate("case-detail", "CASE-2026-017"); }}
                            >
                              Analyze in case view <ChevronRight size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="font-bold text-[var(--color-text-primary)] text-[16px] uppercase tracking-wider mb-4">Activity Feed</h2>
              <div className="gov-panel overflow-hidden">
                <div className="divide-y divide-[var(--color-border-subtle)]">
                  {recentActivity.map((a, i) => (
                    <div key={i} className="p-4 flex items-start gap-3 hover:bg-[var(--color-surface-2)] transition-colors">
                      <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: dotColor(a.type) }} />
                      <div className="flex-1">
                        <p className="text-[12px] text-[var(--color-text-primary)] leading-relaxed">{a.text}</p>
                        <p className="text-[10px] text-[var(--color-text-muted)] font-mono mt-1">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h2 className="font-bold text-[var(--color-text-primary)] text-[16px] uppercase tracking-wider mb-4">Analysis Tools</h2>
              <div className="grid grid-cols-2 gap-3">
                {tools.map((t) => (
                  <button
                    key={t.page}
                    className="gov-panel p-3 text-left flex flex-col gap-3 group hover:border-[var(--color-primary)] transition-colors"
                    onClick={() => onNavigate(t.page)}
                  >
                    <div className="w-9 h-9 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-primary)] flex items-center justify-center">
                      {t.icon}
                    </div>
                    <span className="text-[12px] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
