import { useState } from "react";
import { AlertTriangle, ArrowRight, TrendingUp, ChevronRight, CreditCard } from "../components/icons";
import { transactions } from "../data/dummy";

interface Props {
  onNavigate: (page: string) => void;
}

// Fund-flow topology (data-driven so it can be traced interactively).
const flowNodes = [
  { id: "A2", x: 70, y: 110, label: "ACCT-A2", sub: "Raj Mehta (Origin)", tone: "var(--color-primary)" },
  { id: "B1", x: 250, y: 65, label: "ACCT-B1", sub: "Arjun Verma", tone: "var(--entity-account)" },
  { id: "F1", x: 250, y: 155, label: "ACCT-F1", sub: "Vikram Singh", tone: "var(--entity-account)" },
  { id: "ORG", x: 460, y: 65, label: "ORG-042 Acct", sub: "Shell Company", tone: "var(--entity-org)" },
  { id: "D2", x: 460, y: 155, label: "ACCT-D2", sub: "Vikram Singh", tone: "var(--entity-account)" },
  { id: "X3", x: 660, y: 110, label: "ACCT-X3", sub: "Offshore Term.", tone: "var(--color-alert-critical)" },
];

const flowEdges = [
  { from: "A2", to: "B1", label: "₹18.4L (RTGS)", high: true },
  { from: "A2", to: "F1", label: "₹3.5L (NEFT)", high: false },
  { from: "B1", to: "ORG", label: "₹9.5L (NEFT)", high: true },
  { from: "F1", to: "D2", label: "₹2.8L (NEFT)", high: false },
  { from: "ORG", to: "X3", label: "₹4.2L (UPI Split)", high: true },
];

export default function FinancialPage({ onNavigate }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [trace, setTrace] = useState<string | null>(null);

  const flagged = transactions.filter((t) => t.flagged);
  const totalFlagged = flagged.reduce((s, t) => s + t.amount, 0);

  const summary = [
    { label: "Total Transactions", value: transactions.length, tone: "var(--color-primary)", sub: "Recorded in case" },
    { label: "Flagged Suspicious", value: flagged.length, tone: "var(--color-alert-critical)", sub: "Requires AML review" },
    { label: "High-Risk Volume", value: `₹${(totalFlagged / 100000).toFixed(1)}L`, tone: "var(--color-alert-critical)", sub: "Across 4 beneficiaries" },
    { label: "Tracked Accounts", value: 5, tone: "var(--color-accent)", sub: "Entities identified" },
  ];

  const nodeById = (id: string) => flowNodes.find((n) => n.id === id)!;
  const isNodeConnected = (id: string) =>
    !!trace && flowEdges.some((e) => (e.from === trace && e.to === id) || (e.to === trace && e.from === id));

  return (
    <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)]">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-6">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Financial Intelligence and Trail Analysis</h1>
          <p className="text-[var(--color-text-secondary)] text-[13px] mt-1">Transaction mapping · Hawala anomaly detection · Asset tracing</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {summary.map((s, i) => (
            <div key={i} className="gov-panel p-5 gov-accent-top">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">{s.label}</span>
                <span className="w-2 h-2 rounded-full" style={{ background: s.tone }} />
              </div>
              <div className="text-2xl font-bold stat-number" style={{ color: s.tone }}>
                {s.value}
              </div>
              <div className="text-[11px] text-[var(--color-text-muted)] mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Flow diagram */}
        <div className="gov-panel p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-[var(--color-text-primary)] text-base flex items-center gap-2">
              <TrendingUp size={18} className="text-[var(--color-primary)]" />
              Automated Fund Flow Topology
            </h3>
            <span className="text-[11px] text-[var(--color-text-muted)] font-mono">CASE-2026-017 / FIU-MATCH</span>
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)] mb-4">
            {trace ? (
              <>
                Tracing flows through <strong className="text-[var(--color-primary)] font-mono">{nodeById(trace).label}</strong>.{" "}
                <button className="text-[var(--color-accent)] hover:underline font-medium" onClick={() => setTrace(null)}>
                  Clear trace
                </button>
              </>
            ) : (
              "Select an account to trace the flows that pass through it."
            )}
          </p>

          <div className="overflow-x-auto">
            <svg viewBox="0 0 760 220" className="w-full min-w-[650px]" height="220">
              <defs>
                <marker id="fin-arrow-critical" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="var(--color-alert-critical)" />
                </marker>
                <marker id="fin-arrow-muted" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="var(--color-text-muted)" />
                </marker>
              </defs>

              {/* Edges */}
              {flowEdges.map((e, i) => {
                const src = nodeById(e.from);
                const tgt = nodeById(e.to);
                const x1 = src.x + 55;
                const y1 = src.y;
                const x2 = tgt.x - 55;
                const y2 = tgt.y;
                const midx = (x1 + x2) / 2;
                const midy = (y1 + y2) / 2;
                const connected = !!trace && (e.from === trace || e.to === trace);
                const opacity = trace ? (connected ? 1 : 0.12) : e.high ? 0.95 : 0.7;
                const width = connected ? 2.6 : e.high ? 2 : 1.4;
                const color = e.high ? "var(--color-alert-critical)" : "var(--color-text-muted)";
                const marker = e.high ? "url(#fin-arrow-critical)" : "url(#fin-arrow-muted)";
                return (
                  <g key={i}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={color}
                      strokeWidth={width}
                      strokeOpacity={opacity}
                      markerEnd={marker}
                    />
                    <text x={midx} y={midy - 8} textAnchor="middle" fill={color} fontSize="9" fontWeight={e.high ? 700 : 600} opacity={opacity}>
                      {e.label}
                    </text>
                  </g>
                );
              })}

              {/* Circular layering loop annotation */}
              <path d="M 305 172 Q 355 205 405 172" fill="none" stroke="var(--color-alert-high)" strokeWidth="1.8" strokeDasharray="4,3" markerEnd="url(#fin-arrow-critical)" />
              <text x="355" y="212" textAnchor="middle" fill="var(--color-alert-high)" fontSize="9" fontWeight="700">
                Circular layering loop detected
              </text>

              {/* Nodes */}
              {flowNodes.map((n) => {
                const dim = !!trace && n.id !== trace && !isNodeConnected(n.id);
                const active = trace === n.id;
                return (
                  <g key={n.id} style={{ cursor: "pointer", opacity: dim ? 0.3 : 1 }} onClick={() => setTrace((t) => (t === n.id ? null : n.id))}>
                    {active && <rect x={n.x - 59} y={n.y - 29} width="118" height="56" rx="2" fill="none" stroke="var(--color-saffron)" strokeWidth="2.5" />}
                    <rect x={n.x - 55} y={n.y - 25} width="110" height="48" rx="2" fill="var(--color-surface)" stroke={n.tone} strokeWidth="1.5" />
                    <text x={n.x} y={n.y - 5} textAnchor="middle" fill="var(--color-text-primary)" fontSize="11" fontWeight="700">
                      {n.label}
                    </text>
                    <text x={n.x} y={n.y + 12} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9">
                      {n.sub}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Transaction list */}
        <h3 className="font-bold text-[var(--color-text-primary)] text-base mb-4 uppercase tracking-wider">Transaction Ledger</h3>
        <div className="space-y-3">
          {transactions.map((t) => (
            <div
              key={t.id}
              className={`gov-panel p-5 cursor-pointer transition-colors ${
                t.flagged ? "hover:border-[var(--color-alert-critical)]" : "hover:border-[var(--color-border-strong)]"
              } ${selected === t.id ? "border-[var(--color-primary)]" : ""}`}
              onClick={() => setSelected((s) => (s === t.id ? null : t.id))}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  {t.flagged ? (
                    <div className="p-2 rounded-sm bg-[var(--color-surface-2)] text-[var(--color-alert-critical)] flex-shrink-0 mt-0.5">
                      <AlertTriangle size={16} />
                    </div>
                  ) : (
                    <div className="p-2 rounded-sm bg-[var(--color-surface-2)] text-[var(--color-text-muted)] flex-shrink-0 mt-0.5">
                      <CreditCard size={16} />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[12px] font-mono font-bold text-[var(--color-text-primary)]">{t.id}</span>
                      <span className="text-[11px] text-[var(--color-text-muted)]">{t.date}</span>
                      <span className="text-[10px] font-bold bg-[var(--color-surface-2)] border border-[var(--color-border-strong)] text-[var(--color-text-secondary)] px-2 py-0.5 rounded-sm uppercase">
                        {t.method}
                      </span>
                      {t.flagged && (
                        <span className="text-[10px] font-bold text-white bg-[var(--color-alert-critical)] px-2 py-0.5 rounded-sm uppercase tracking-widest">
                          High Alert
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[14px] mt-1">
                      <span className="font-semibold text-[var(--color-text-primary)]">{t.from}</span>
                      <ArrowRight size={14} className="text-[var(--color-primary)]" />
                      <span className="font-semibold text-[var(--color-text-primary)]">{t.to}</span>
                    </div>
                    {t.reason && <p className="text-[12px] text-[var(--color-alert-critical)] font-medium mt-1">{t.reason}</p>}

                    {selected === t.id && (
                      <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex gap-4">
                        <button
                          className="text-[12px] text-[var(--color-primary)] font-semibold hover:underline flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("evidence");
                          }}
                        >
                          View FIU source document <ChevronRight size={12} />
                        </button>
                        <button
                          className="text-[12px] text-[var(--color-accent)] font-semibold hover:underline flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate("graph");
                          }}
                        >
                          Trace in investigation graph <ChevronRight size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`text-right flex-shrink-0 ${t.flagged ? "text-[var(--color-alert-critical)]" : "text-[var(--color-text-primary)]"}`}>
                  <div className="text-xl font-bold font-mono stat-number">₹{(t.amount / 100000).toFixed(2)}L</div>
                  <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Settled via {t.method}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
