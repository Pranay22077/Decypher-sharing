import { useState } from "react";
import { Network, Users, Building2, Phone, Car, MapPin, Database, X, ChevronRight } from "../components/icons";
import KnowledgeGraph3D from "../components/KnowledgeGraph3D";
import { graphNodes, graphEdges, persons } from "../data/dummy";

interface Props {
  onNavigate: (page: string, param?: string) => void;
}

const viewModes = [
  { id: "all", label: "All Relationships", icon: <Network size={14} /> },
  { id: "person", label: "People Network", icon: <Users size={14} /> },
  { id: "org", label: "Organization Network", icon: <Building2 size={14} /> },
  { id: "phone", label: "Communication Network", icon: <Phone size={14} /> },
  { id: "vehicle", label: "Vehicle Network", icon: <Car size={14} /> },
  { id: "location", label: "Location Network", icon: <MapPin size={14} /> },
  { id: "account", label: "Financial Network", icon: <Database size={14} /> },
];

export default function GraphPage({ onNavigate }: Props) {
  const [viewMode, setViewMode] = useState("all");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedPerson = selectedNodeId ? persons.find((p) => p.id === selectedNodeId) : null;

  return (
    <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)]">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-5">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">Master Investigation Graph</h1>
            <p className="text-[var(--color-text-secondary)] text-[12px] mt-0.5 font-mono">
              CASE-2026-017 / OPERATION INDRA NET · {graphNodes.length} entities · {graphEdges.length} relationships
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-[var(--color-border-subtle)] rounded-sm bg-[var(--color-surface)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
            <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">Graph engine online</span>
          </div>
        </div>
      </div>

      {/* View mode bar */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-2.5 overflow-x-auto">
        <div className="max-w-[1440px] mx-auto flex gap-2">
          {viewModes.map((v) => (
            <button
              key={v.id}
              className={`gov-chip whitespace-nowrap ${viewMode === v.id ? "is-active" : ""}`}
              aria-pressed={viewMode === v.id}
              onClick={() => setViewMode(v.id)}
            >
              {v.icon}
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <KnowledgeGraph3D
            nodes={viewMode === "all" ? graphNodes : graphNodes.filter((n) => n.type === viewMode)}
            edges={graphEdges}
            height={640}
            selectedId={selectedNodeId}
            onNodeSelect={setSelectedNodeId}
          />
          <p className="text-[11px] text-[var(--color-text-muted)] mt-2">
            Interactive 3D relationship graph. Drag to rotate, scroll to zoom, and select any node to inspect its linked entities.
          </p>
        </div>

        {/* Side panel */}
        {selectedNodeId ? (
          <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
            <div className="gov-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                  <h3 className="font-bold text-[var(--color-text-primary)] text-[14px] font-mono">{selectedNodeId}</h3>
                </div>
                <button
                  className="p-1 rounded-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]"
                  onClick={() => setSelectedNodeId(null)}
                  aria-label="Close panel"
                >
                  <X size={16} />
                </button>
              </div>

              {selectedPerson ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <img src={selectedPerson.photo} alt="" className="w-14 h-14 rounded-sm object-cover border border-[var(--color-border-strong)]" />
                    <div>
                      <h4 className="font-bold text-[var(--color-text-primary)] text-[14px]">{selectedPerson.name}</h4>
                      <p className="text-[12px] text-[var(--color-text-secondary)]">{selectedPerson.role}</p>
                      <div
                        className="text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase mt-1 inline-block border"
                        style={{
                          color: selectedPerson.risk === "high" ? "var(--color-alert-critical)" : "var(--color-alert-high)",
                          borderColor: selectedPerson.risk === "high" ? "var(--color-alert-critical)" : "var(--color-alert-high)",
                          background: "var(--color-surface-2)",
                        }}
                      >
                        {selectedPerson.risk} Risk
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-[12px] text-[var(--color-text-secondary)] bg-[var(--color-surface-2)] p-3 rounded-sm border border-[var(--color-border-subtle)] mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                      <span className="truncate">{selectedPerson.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                      <span>{selectedPerson.phones.length} phone numbers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                      <span>{selectedPerson.vehicles.length} vehicles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                      <span>{selectedPerson.associates.length} associates</span>
                    </div>
                  </div>

                  <button className="btn-premium btn-block btn-sm" onClick={() => onNavigate("person", selectedNodeId)}>
                    Open full profile
                  </button>
                </>
              ) : (
                <div className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                  Entity type: <strong className="text-[var(--color-text-primary)] font-mono">{graphNodes.find((n) => n.id === selectedNodeId)?.type}</strong>
                  <p className="mt-2">
                    Connected to{" "}
                    <strong className="text-[var(--color-primary)]">
                      {graphEdges.filter((e) => e.source === selectedNodeId || e.target === selectedNodeId).length}
                    </strong>{" "}
                    other entities in this cluster.
                  </p>
                </div>
              )}
            </div>

            {/* Connections */}
            <div className="gov-panel p-5">
              <h3 className="font-bold text-[var(--color-text-primary)] text-[12px] uppercase tracking-wider mb-3">Linked entities</h3>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {graphEdges
                  .filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
                  .map((e) => {
                    const other = e.source === selectedNodeId ? e.target : e.source;
                    return (
                      <button
                        key={e.id}
                        className="w-full text-left flex items-center justify-between p-2 rounded-sm bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] transition-colors"
                        onClick={() => setSelectedNodeId(other)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full flex-shrink-0" />
                          <span className="text-[12px] font-mono text-[var(--color-text-primary)] truncate">{other}</span>
                        </div>
                        <span className="text-[10px] text-[var(--color-text-muted)] font-mono">{e.label}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="gov-panel p-5">
              <h3 className="font-bold text-[var(--color-text-primary)] text-[13px] uppercase tracking-wider mb-2">Key targets</h3>
              <p className="text-[12px] text-[var(--color-text-muted)] mb-4">Select an entity to examine relationships and forensic ties.</p>
              <div className="space-y-2">
                {persons.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    className="w-full flex items-center gap-3 p-2 rounded-sm bg-[var(--color-surface-2)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] transition-colors text-left"
                    onClick={() => setSelectedNodeId(p.id)}
                  >
                    <img src={p.photo} alt="" className="w-7 h-7 rounded-sm object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-[var(--color-text-primary)] truncate">{p.name}</div>
                      <div className="text-[10px] font-mono text-[var(--color-text-muted)]">{p.id}</div>
                    </div>
                    <ChevronRight size={14} className="text-[var(--color-text-muted)]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
