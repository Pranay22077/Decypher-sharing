import { useState, useRef, useCallback, useMemo } from "react";
import { GraphNode, GraphEdge, graphNodes, graphEdges } from "../data/dummy";
import { entityColor, entityBadge, PALETTE } from "../theme";

// Fixed legend order so a filter change never reshuffles identity.
const TYPE_ORDER = ["person", "org", "phone", "vehicle", "location", "account", "case", "event"];
const TYPE_LABEL: Record<string, string> = {
  person: "Person",
  org: "Organization",
  phone: "Phone / Comms",
  vehicle: "Vehicle",
  location: "Location",
  account: "Account",
  case: "Case",
  event: "Event",
};

interface Props {
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  onNodeClick?: (node: GraphNode) => void;
  height?: number;
  showLegend?: boolean;
  filterType?: string | null;
  compact?: boolean;
}

export default function InvestigationGraph({
  nodes = graphNodes,
  edges = graphEdges,
  onNodeClick,
  height = 520,
  showLegend = true,
  filterType = null,
  compact = false,
}: Props) {
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() =>
    Object.fromEntries(nodes.map((n) => [n.id, { x: n.x, y: n.y }]))
  );
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  // Filter nodes/edges
  const visibleNodes = filterType ? nodes.filter((n) => n.type === filterType) : nodes;
  const visibleEdgeIds = new Set(visibleNodes.map((n) => n.id));
  const visibleEdges = filterType
    ? edges.filter((e) => visibleEdgeIds.has(e.source) && visibleEdgeIds.has(e.target))
    : edges;

  const presentTypes = useMemo(() => {
    const seen = new Set(nodes.map((n) => n.type));
    return TYPE_ORDER.filter((t) => seen.has(t));
  }, [nodes]);

  const getPos = (id: string) => positions[id] || { x: 200, y: 200 };

  // Bezier control point
  const getBezier = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const cx = mx - dy * 0.2;
    const cy = my + dx * 0.2;
    return { cx, cy };
  };

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation();
      const pos = getPos(nodeId);
      const svgRect = svgRef.current?.getBoundingClientRect();
      if (!svgRect) return;
      const mx = (e.clientX - svgRect.left - pan.x) / scale;
      const my = (e.clientY - svgRect.top - pan.y) / scale;
      setDragging(nodeId);
      setDragOffset({ x: mx - pos.x, y: my - pos.y });
    },
    [pan, scale, positions]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (dragging) {
        const svgRect = svgRef.current?.getBoundingClientRect();
        if (!svgRect) return;
        const mx = (e.clientX - svgRect.left - pan.x) / scale;
        const my = (e.clientY - svgRect.top - pan.y) / scale;
        setPositions((p) => ({ ...p, [dragging]: { x: mx - dragOffset.x, y: my - dragOffset.y } }));
      } else if (isPanning.current) {
        const dx = e.clientX - panStart.current.x;
        const dy = e.clientY - panStart.current.y;
        setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
        panStart.current = { x: e.clientX, y: e.clientY };
      }
    },
    [dragging, dragOffset, pan, scale]
  );

  const handleSvgMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as Element).tagName === "rect") {
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    isPanning.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((s) => Math.min(Math.max(s * delta, 0.3), 3));
  };

  const getNodeRadius = (node: GraphNode) => {
    if (node.highlighted) return 22;
    if (node.type === "person") return 18;
    if (node.type === "org") return 16;
    return 14;
  };

  const zoomBtn =
    "w-8 h-8 bg-[var(--color-surface)] border border-[var(--color-border-strong)] text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] flex items-center justify-center transition-colors font-bold rounded-sm";

  return (
    <div className="relative bg-[var(--color-base-bg)] overflow-hidden select-none border border-[var(--color-border-subtle)]" style={{ height }}>
      {/* Legend */}
      {showLegend && !compact && (
        <div className="absolute top-3 left-3 z-10 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm p-2.5 max-w-[240px]">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">Entity types</div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {presentTypes.map((type) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: entityColor(type) }} />
                <span className="text-[10px] text-[var(--color-text-secondary)] font-medium">{TYPE_LABEL[type] ?? type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button className={zoomBtn} onClick={() => setScale((s) => Math.min(s * 1.2, 3))} aria-label="Zoom in">
          +
        </button>
        <button className={zoomBtn} onClick={() => setScale((s) => Math.max(s * 0.8, 0.3))} aria-label="Zoom out">
          −
        </button>
        <button
          className={`${zoomBtn} text-[11px] font-mono`}
          onClick={() => {
            setScale(1);
            setPan({ x: 0, y: 0 });
          }}
          aria-label="Reset view"
          title="Reset view"
        >
          1:1
        </button>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className="graph-tooltip" style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}>
          {tooltip.content}
        </div>
      )}

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseDown={handleSvgMouseDown}
        onWheel={handleWheel}
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        <defs>
          {/* Background grid: faint institutional hairline, visible on the light base */}
          <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c9d2dc" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="100%" height="100%" fill="var(--color-base-bg)" />
        <rect width="100%" height="100%" fill="url(#graph-grid)" />

        <g transform={`translate(${pan.x},${pan.y}) scale(${scale})`}>
          {/* Edges */}
          {visibleEdges.map((edge) => {
            const s = getPos(edge.source);
            const t = getPos(edge.target);
            const { cx, cy } = getBezier(s.x, s.y, t.x, t.y);
            const isHovered = hoveredEdge === edge.id;
            const isConnected = selectedNode && (edge.source === selectedNode || edge.target === selectedNode);
            const opacity = selectedNode ? (isConnected ? 0.95 : 0.08) : isHovered ? 0.9 : 0.4;
            const color = isConnected || isHovered ? PALETTE.accent : PALETTE.borderStrong;

            return (
              <g key={edge.id}>
                {/* Hit area */}
                <path
                  d={`M${s.x},${s.y} Q${cx},${cy} ${t.x},${t.y}`}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={14}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    setHoveredEdge(edge.id);
                    const svgRect = svgRef.current?.getBoundingClientRect();
                    if (svgRect) setTooltip({ x: e.clientX - svgRect.left, y: e.clientY - svgRect.top, content: edge.label });
                  }}
                  onMouseLeave={() => {
                    setHoveredEdge(null);
                    setTooltip(null);
                  }}
                />
                {/* Visual edge */}
                <path
                  d={`M${s.x},${s.y} Q${cx},${cy} ${t.x},${t.y}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={isHovered || isConnected ? 2.2 : 1.3}
                  strokeOpacity={opacity}
                  style={{ transition: "stroke-opacity 0.2s" }}
                />
                {/* Edge label on hover */}
                {isHovered && (
                  <text x={cx} y={cy - 8} textAnchor="middle" fill={PALETTE.accent} fontSize="10" fontWeight="600" style={{ pointerEvents: "none" }}>
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {visibleNodes.map((node) => {
            const pos = getPos(node.id);
            const fill = entityColor(node.type);
            const r = getNodeRadius(node);
            const isHovered = hoveredNode === node.id;
            const isSelected = selectedNode === node.id;
            const isConnected =
              selectedNode &&
              edges.some(
                (e) =>
                  (e.source === selectedNode && e.target === node.id) || (e.target === selectedNode && e.source === node.id)
              );
            const isDimmed = selectedNode && !isSelected && !isConnected;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x},${pos.y})`}
                style={{ cursor: "pointer", opacity: isDimmed ? 0.2 : 1, transition: "opacity 0.2s" }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
                onMouseEnter={(e) => {
                  setHoveredNode(node.id);
                  const svgRect = svgRef.current?.getBoundingClientRect();
                  if (svgRect) {
                    setTooltip({ x: e.clientX - svgRect.left, y: e.clientY - svgRect.top, content: `${node.label.split("\n")[0]} (${node.type})` });
                  }
                }}
                onMouseLeave={() => {
                  setHoveredNode(null);
                  setTooltip(null);
                }}
                onClick={() => {
                  setSelectedNode((s) => (s === node.id ? null : node.id));
                  onNodeClick?.(node);
                }}
              >
                {/* Priority ring for the primary node (solid saffron, not a glow) */}
                {node.highlighted && <circle r={r + 6} fill="none" stroke={PALETTE.saffron} strokeWidth="2.5" />}
                {/* Selection / hover ring */}
                {(isSelected || isHovered) && !node.highlighted && (
                  <circle r={r + 4} fill="none" stroke={PALETTE.primary} strokeWidth="2" />
                )}
                {/* Node body with a surface ring to separate it from crossing edges */}
                <circle r={r} fill={fill} stroke="var(--color-surface)" strokeWidth={2} />

                {/* Node category badge */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={8}
                  fontWeight="700"
                  fill="#ffffff"
                  style={{ pointerEvents: "none", userSelect: "none", letterSpacing: "0.5px" }}
                >
                  {entityBadge(node.type)}
                </text>

                {/* Node main label */}
                <text
                  y={r + 14}
                  textAnchor="middle"
                  fill={node.highlighted ? "var(--color-alert-critical)" : isSelected ? "var(--color-text-primary)" : "var(--color-text-secondary)"}
                  fontSize={node.highlighted ? 10 : 9}
                  fontWeight={node.highlighted || isSelected ? "700" : "500"}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {node.label.split("\n")[0]}
                </text>

                {/* "PRIMARY" badge */}
                {node.highlighted && (
                  <g transform={`translate(${r - 4}, ${-r - 2})`}>
                    <rect x="-24" y="-8" width="48" height="13" rx="2" fill="var(--color-alert-critical)" />
                    <text x="0" y="2" textAnchor="middle" fill="white" fontSize="7" fontWeight="700" style={{ pointerEvents: "none" }}>
                      PRIMARY
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Stats overlay */}
        {!compact && (
          <g transform="translate(16, 16)">
            <rect x="0" y={height - 85} width="240" height="64" rx="2" fill="var(--color-surface)" stroke="var(--color-border-subtle)" strokeWidth="1" />
            <text x="12" y={height - 63} fill="var(--color-text-primary)" fontSize="9.5" fontWeight="700">
              CASE-2026-017 / OPERATION INDRA NET
            </text>
            <text x="12" y={height - 49} fill="var(--color-primary)" fontSize="8.5" fontWeight="600">
              {visibleNodes.length} entities · {visibleEdges.length} relationships
            </text>
            <text x="12" y={height - 35} fill="var(--color-text-muted)" fontSize="8">
              Drag to pan · Scroll to zoom · Click a node to focus
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
