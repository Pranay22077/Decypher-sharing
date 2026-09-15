import UiText, { useUiTranslation } from "../components/UiText";
import { useEffect, useState } from "react";
import { Network, Users, Building2, Phone, Car, MapPin, Database, X, ChevronRight, GitBranch } from "../components/icons";
import KnowledgeGraph3D from "../components/KnowledgeGraph3D";
import { graphNodes, graphEdges, persons } from "../data/dummy";
import { entityColor, entityBadge } from "../theme";
import { api, appMode } from "../lib/api";
import type { GraphNode, GraphEdge, EntityType } from "../data/dummy";

interface Props {
  onNavigate: (page: string, param?: string) => void;
}

export default function GraphPage({ onNavigate }: Props) {
  const trUi = useUiTranslation();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodes, setNodes] = useState<GraphNode[]>(graphNodes);
  const [edges, setEdges] = useState<GraphEdge[]>(graphEdges);
  const [source, setSource] = useState(appMode === "full" ? "Connecting to Neo4j…" : "Curated showcase graph");

  useEffect(() => {
    if (appMode !== "full") return;
    api.graph("CASE-2026-017").then((result) => {
      const mappedNodes = result.nodes.map((node: any, index: number) => ({
        id: node.id, label: node.label, type: node.type.toLowerCase() as EntityType,
        x: 120 + (index % 4) * 165, y: 100 + Math.floor(index / 4) * 155,
        highlighted: node.id === "PERSON-P004",
        data: { ...node.properties, evidenceCount: node.evidenceCount },
      }));
      const mappedEdges = result.edges.map((edge: any) => ({
        id: edge.id, source: edge.source, target: edge.target,
        label: edge.type, confidence: edge.confidence, evidenceIds: edge.evidenceIds,
      }));
      setNodes(mappedNodes);
      setEdges(mappedEdges);
      setSource("Neo4j-backed investigation graph");
    }).catch(() => setSource("Backend unavailable — showing curated showcase graph"));
  }, []);

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;
  const selectedPerson = selectedNodeId ? persons.find((p) => p.id === selectedNodeId) : null;
  const connectedEdges = selectedNodeId
    ? edges.filter((e) => e.source === selectedNodeId || e.target === selectedNodeId)
    : [];

  return (
    <div className="min-h-screen bg-[var(--color-base-bg)] text-[var(--color-text-primary)]">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-subtle)] px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]"><UiText>Master Investigation Graph</UiText></h1>
            <p className="text-[var(--color-text-secondary)] text-[12px] mt-0.5 font-mono">
              CASE-2026-017 / OPERATION NIGHTFALL · {nodes.length}<UiText> entities · </UiText>{edges.length}<UiText> relationships
            </UiText></p>
          </div>
          <div className="flex items-center gap-3">
            {/* Source indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 border border-[var(--color-border-subtle)] rounded-lg bg-[var(--color-surface)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
              <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">{source}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Graph area */}
        <div className="flex-1 min-w-0">
          <KnowledgeGraph3D
            nodes={nodes}
            edges={edges}
            height={Math.max(640, window.innerHeight - 200)}
            selectedId={selectedNodeId}
            onNodeSelect={setSelectedNodeId}
          />
        </div>

        {/* ── Detail side panel ── */}
        {selectedNodeId && (
          <div
            className="w-full lg:w-[340px] flex-shrink-0 space-y-4"
            style={{ animation: "slideInRight 0.3s ease" }}
          >
            <style>{`@keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: none; opacity: 1; } }`}</style>

            {/* Entity card */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-[11px] font-mono"
                    style={{ background: entityColor(selectedNode?.type) }}
                  >
                    {entityBadge(selectedNode?.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--color-text-primary)] text-[15px]">
                      {selectedNode?.label || selectedNodeId}
                    </h3>
                    <p className="text-[11px] font-mono text-[var(--color-text-muted)]">{selectedNodeId}</p>
                  </div>
                </div>
                <button
                  className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
                  onClick={() => setSelectedNodeId(null)}
                  aria-label={trUi("Close panel")}
                >
                  <X size={16} />
                </button>
              </div>

              {selectedPerson ? (
                <>
                  <div className="flex items-center gap-4 mb-5">
                    <img src={selectedPerson.photo} alt="" className="w-16 h-16 rounded-xl object-cover border-2 border-[var(--color-border-subtle)]" />
                    <div>
                      <h4 className="font-bold text-[var(--color-text-primary)] text-[15px]">{selectedPerson.name}</h4>
                      <p className="text-[12px] text-[var(--color-text-secondary)]">{selectedPerson.role}</p>
                      <div
                        className="text-[9px] font-bold px-2.5 py-0.5 rounded-lg uppercase mt-1.5 inline-block border"
                        style={{
                          color: selectedPerson.risk === "high" ? "var(--color-alert-critical)" : "var(--color-alert-high)",
                          borderColor: selectedPerson.risk === "high" ? "var(--color-alert-critical)" : "var(--color-alert-high)",
                          background: selectedPerson.risk === "high" ? "rgba(239,68,68,0.1)" : "rgba(249,115,22,0.1)",
                        }}
                      >
                        {selectedPerson.risk}<UiText> Risk
                      </UiText></div>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-[12px] text-[var(--color-text-secondary)] bg-[rgba(255,255,255,0.03)] p-4 rounded-xl border border-[var(--color-border-subtle)] mb-5">
                    <div className="flex items-center gap-2.5">
                      <MapPin size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                      <span className="truncate">{selectedPerson.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                      <span>{selectedPerson.phones.length}<UiText> phone numbers</UiText></span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Car size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                      <span>{selectedPerson.vehicles.length}<UiText> vehicles</UiText></span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Users size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                      <span>{selectedPerson.associates.length}<UiText> known associates</UiText></span>
                    </div>
                  </div>

                  <button
                    className="btn-premium btn-block btn-sm"
                    style={{ borderRadius: 12 }}
                    onClick={() => onNavigate("person", selectedNodeId)}
                  ><UiText>
                    Open full profile
                    </UiText><ChevronRight size={14} />
                  </button>
                </>
              ) : (
                <div className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-lg" style={{ color: entityColor(selectedNode?.type), background: entityColor(selectedNode?.type) + "18" }}>
                      {entityBadge(selectedNode?.type)}
                    </span>
                    <span className="uppercase text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)]">
                      <UiText>{selectedNode?.type}</UiText>
                    </span>
                  </div>
                  <p>
                    <strong className="text-[var(--color-primary)]">{connectedEdges.length}</strong><UiText> evidence-backed connections to other entities in this investigation cluster.
                  </UiText></p>
                </div>
              )}
            </div>

            {/* Connected entities */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-[var(--color-text-primary)] text-[12px] uppercase tracking-wider mb-3 flex items-center gap-2">
                <GitBranch size={14} className="text-[var(--color-primary)]" /><UiText>
                Linked Entities (</UiText>{connectedEdges.length})
              </h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {connectedEdges.map((e) => {
                  const otherId = e.source === selectedNodeId ? e.target : e.source;
                  const otherNode = nodes.find((n) => n.id === otherId);
                  return (
                    <button
                      key={e.id}
                      className="w-full text-left flex items-center justify-between p-3 rounded-xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] transition-all group"
                      onClick={() => setSelectedNodeId(otherId)}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ background: entityColor(otherNode?.type) }}
                        />
                        <div className="min-w-0">
                          <div className="text-[12px] font-semibold text-[var(--color-text-primary)] truncate">
                            {otherNode?.label || otherId}
                          </div>
                          <div className="text-[10px] font-mono text-[var(--color-text-muted)]">
                            {entityBadge(otherNode?.type)} · {otherId}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <div className="text-[10px] font-mono text-[var(--color-primary)]"><UiText>{e.label}</UiText></div>
                        <div className="text-[9px] text-[var(--color-text-muted)]">
                          {Math.round((e.confidence ?? 0.85) * 100)}% conf
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Key targets quick list */}
            <div className="glass-card p-5">
              <h3 className="font-bold text-[var(--color-text-primary)] text-[12px] uppercase tracking-wider mb-3"><UiText>Key Targets</UiText></h3>
              <div className="space-y-2">
                {persons.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left ${
                      selectedNodeId === p.id
                        ? "border-[var(--color-primary)] bg-[rgba(59,130,246,0.08)]"
                        : "border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)]"
                    }`}
                    onClick={() => setSelectedNodeId(p.id)}
                  >
                    <img src={p.photo} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
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

        {/* Default state — no selection */}
        {!selectedNodeId && (
          <div className="w-full lg:w-[300px] flex-shrink-0">
            <div className="glass-card p-6">
              <h3 className="font-bold text-[var(--color-text-primary)] text-[14px] mb-2"><UiText>Select an Entity</UiText></h3>
              <p className="text-[12px] text-[var(--color-text-muted)] mb-5 leading-relaxed"><UiText>
                Click any node in the graph to inspect its relationships, evidence connections, and forensic ties.
              </UiText></p>
              <div className="space-y-2">
                {persons.slice(0, 6).map((p) => (
                  <button
                    key={p.id}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)] transition-all text-left"
                    onClick={() => setSelectedNodeId(p.id)}
                  >
                    <img src={p.photo} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
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
