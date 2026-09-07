import { useState } from "react";
import { Search, Plus, ChevronRight, FolderOpen, Bell, MapPin, Calendar, User, X } from "../components/icons";
import { cases } from "../data/dummy";

interface Props {
  onNavigate: (page: string, param?: string) => void;
}

function statusStyle(s: string): React.CSSProperties {
  if (s === "active") return { color: "var(--color-success)", borderColor: "var(--color-success)", background: "var(--color-surface-2)" };
  if (s === "pending") return { color: "var(--color-alert-high)", borderColor: "var(--color-alert-high)", background: "var(--color-surface-2)" };
  return { color: "var(--color-text-muted)", borderColor: "var(--color-border-strong)", background: "var(--color-surface-2)" };
}

function priorityStyle(p: string): React.CSSProperties {
  if (p === "high") return { color: "var(--color-alert-critical)", borderColor: "var(--color-alert-critical)", background: "var(--color-surface-2)" };
  if (p === "medium") return { color: "var(--color-alert-high)", borderColor: "var(--color-alert-high)", background: "var(--color-surface-2)" };
  return { color: "var(--color-text-muted)", borderColor: "var(--color-border-strong)", background: "var(--color-surface-2)" };
}

const summaryTones = [
  { label: "Total Cases", value: cases.length, tone: "var(--color-primary)" },
  { label: "Active Operations", value: cases.filter(c => c.status === "active").length, tone: "var(--color-success)" },
  { label: "Pending Assessment", value: cases.filter(c => c.status === "pending").length, tone: "var(--color-alert-high)" },
  { label: "Archived Cases", value: cases.filter(c => c.status === "closed").length, tone: "var(--color-text-muted)" },
];

export default function CaseList({ onNavigate }: Props) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showNewCase, setShowNewCase] = useState(false);

  const filtered = cases.filter(c => {
    const matchFilter = filter === "all" || c.status === filter || c.priority === filter;
    const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)]">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-6">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Case Management</h1>
            <p className="text-[var(--color-text-secondary)] text-[13px] mt-1">All active investigations · Decypher Intelligence Platform</p>
          </div>
          <button className="btn-premium self-start md:self-auto" onClick={() => setShowNewCase(true)}>
            <Plus size={16} /> New Case File
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Filters and search */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 bg-[var(--color-surface)] border border-[var(--color-border-strong)] focus-within:border-[var(--color-primary)] rounded-sm px-4 py-2.5 flex-1 min-w-[280px] max-w-md transition-colors">
            <Search size={16} className="text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search by case title, ID, entity..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-[13px] outline-none text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
            />
          </div>

          <div className="flex gap-2 flex-wrap overflow-x-auto">
            {["all", "active", "pending", "closed", "high"].map(f => (
              <button
                key={f}
                className={`gov-chip capitalize whitespace-nowrap ${filter === f ? "is-active" : ""}`}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {summaryTones.map((s, i) => (
            <div key={i} className="gov-panel p-5 gov-accent-top">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">{s.label}</span>
                <span className="w-2 h-2 rounded-full" style={{ background: s.tone }} />
              </div>
              <div className="text-2xl font-bold stat-number" style={{ color: s.tone }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Cases list */}
        <div className="space-y-4">
          {filtered.map(c => (
            <div
              key={c.id}
              className="gov-panel p-6 cursor-pointer group hover:border-[var(--color-primary)] transition-colors"
              onClick={() => onNavigate("case-detail", c.id)}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                    <FolderOpen size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-sm border uppercase tracking-widest" style={statusStyle(c.status)}>{c.status}</span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-sm border uppercase tracking-widest" style={priorityStyle(c.priority)}>{c.priority} priority</span>
                      <span className="text-[12px] font-mono text-[var(--color-text-muted)]">{c.id}</span>
                    </div>
                    <h3 className="font-bold text-[var(--color-text-primary)] text-lg group-hover:text-[var(--color-primary)] transition-colors mb-1">{c.title}</h3>
                    <p className="text-[13px] text-[var(--color-primary)] font-medium mb-2">{c.type}</p>
                    <p className="text-[13px] text-[var(--color-text-secondary)] line-clamp-2 leading-relaxed mb-4">{c.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-[12px] text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-1.5 bg-[var(--color-surface-2)] px-3 py-1 rounded-sm border border-[var(--color-border-subtle)]">
                        <MapPin size={13} className="text-[var(--color-primary)]" />
                        <span>{c.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[var(--color-surface-2)] px-3 py-1 rounded-sm border border-[var(--color-border-subtle)]">
                        <Calendar size={13} className="text-[var(--color-text-muted)]" />
                        <span>{c.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[var(--color-surface-2)] px-3 py-1 rounded-sm border border-[var(--color-border-subtle)]">
                        <User size={13} className="text-[var(--color-success)]" />
                        <span>{c.assignedTo}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--color-border-subtle)]">
                  <div className="bg-[var(--color-surface-2)] border border-[var(--color-border-subtle)] rounded-sm p-3 min-w-[90px] text-center">
                    <div className="text-xl font-bold stat-number text-[var(--color-text-primary)]">{c.entities}</div>
                    <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-0.5">Entities</div>
                  </div>
                  {c.alerts > 0 && (
                    <div className="flex items-center gap-1.5 border rounded-sm px-2.5 py-1" style={{ color: "var(--color-alert-critical)", borderColor: "var(--color-alert-critical)", background: "var(--color-surface-2)" }}>
                      <Bell size={12} />
                      <span className="text-[11px] font-bold">{c.alerts} alerts</span>
                    </div>
                  )}
                  <div className="text-right">
                    <div className="text-[10px] text-[var(--color-text-muted)]">Updated</div>
                    <div className="text-[11px] text-[var(--color-text-secondary)] font-mono">{c.lastUpdated.split(" ")[0]}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4 pt-4 border-t border-[var(--color-border-subtle)]">
                <span className="text-[12px] text-[var(--color-primary)] font-semibold flex items-center gap-1 group-hover:underline">
                  Launch Case Workspace <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Case Modal */}
      {showNewCase && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: "rgba(11,24,45,0.55)" }}>
          <div className="gov-panel bg-[var(--color-surface)] border border-[var(--color-border-strong)] w-full max-w-[520px] p-6 relative">
            <button
              onClick={() => setShowNewCase(false)}
              className="absolute top-6 right-6 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <h2 className="font-bold text-[var(--color-text-primary)] text-lg mb-6 flex items-center gap-2">
              <Plus size={18} className="text-[var(--color-primary)]" />
              Create New Investigation Case
            </h2>
            <div className="space-y-4">
              {[
                { label: "Case Title", placeholder: "e.g. Operation Indra Net" },
                { label: "Case Type", placeholder: "e.g. Financial Fraud, Organized Crime" },
                { label: "Primary Location", placeholder: "e.g. New Delhi, Mumbai" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">{f.label}</label>
                  <input
                    type="text"
                    placeholder={f.placeholder}
                    className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border-strong)] focus:border-[var(--color-primary)] rounded-sm px-4 py-2.5 text-[13px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">Priority</label>
                <select className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border-strong)] focus:border-[var(--color-primary)] rounded-sm px-4 py-2.5 text-[13px] text-[var(--color-text-primary)] outline-none transition-colors">
                  <option className="bg-[var(--color-surface)]">High Priority</option>
                  <option className="bg-[var(--color-surface)]">Medium Priority</option>
                  <option className="bg-[var(--color-surface)]">Low Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-widest mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of investigation intelligence and objectives..."
                  className="w-full bg-[var(--color-surface-2)] border border-[var(--color-border-strong)] focus:border-[var(--color-primary)] rounded-sm px-4 py-2.5 text-[13px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none resize-none transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="btn-premium flex-1" onClick={() => { setShowNewCase(false); onNavigate("case-detail", "CASE-2026-017"); }}>
                Initialize Case
              </button>
              <button className="btn-premium-outline" onClick={() => setShowNewCase(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
