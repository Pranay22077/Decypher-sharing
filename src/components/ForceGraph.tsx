import { useEffect, useRef, useState, useCallback } from "react";
import { entityColor, entityBadge, ENTITY_COLORS } from "../theme";
import { ZoomIn, ZoomOut, Maximize, Search } from "./icons";
import type { GraphNode, GraphEdge } from "../data/dummy";

interface Props {
  nodes: GraphNode[];
  edges: GraphEdge[];
  height?: number;
  selectedId?: string | null;
  onNodeSelect?: (id: string | null) => void;
  onNodeNavigate?: (id: string) => void;
}

interface SimNode {
  id: string;
  label: string;
  type: string;
  highlighted?: boolean;
  data?: Record<string, unknown>;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

// ── Force simulation constants ──
const REPULSION = 8000;
const ATTRACTION = 0.006;
const CENTER_GRAVITY = 0.01;
const DAMPING = 0.88;
const MIN_DIST = 60;

const TYPE_ORDER = ["person", "case", "org", "phone", "vehicle", "location", "account", "event"];
const TYPE_LABEL: Record<string, string> = {
  person: "Person", case: "Case", org: "Organization", phone: "Phone",
  vehicle: "Vehicle", location: "Location", account: "Account", event: "Event",
};

export default function ForceGraph({
  nodes,
  edges,
  height = 700,
  selectedId = null,
  onNodeSelect,
  onNodeNavigate,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<SimNode[]>([]);
  const rafRef = useRef(0);

  // View state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<Set<string>>(() => new Set(TYPE_ORDER));

  // Interaction refs (avoid re-render during drag)
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);
  const draggingNode = useRef<string | null>(null);
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const hoveredRef = useRef<string | null>(null);
  const selectedRef = useRef<string | null>(selectedId);

  panRef.current = pan;
  zoomRef.current = zoom;
  selectedRef.current = selectedId;

  // Adjacency map
  const neighborsRef = useRef(new Map<string, Set<string>>());

  // Initialize simulation nodes
  useEffect(() => {
    const simNodes: SimNode[] = nodes.map((n, i) => {
      const angle = (i / nodes.length) * Math.PI * 2;
      const r = 200 + Math.random() * 100;
      return {
        id: n.id,
        label: n.label,
        type: n.type,
        highlighted: n.highlighted,
        data: n.data,
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r,
        vx: 0,
        vy: 0,
        radius: n.highlighted ? 22 : n.type === "person" || n.type === "case" ? 16 : 12,
      };
    });
    simRef.current = simNodes;

    // Build adjacency
    const adj = new Map<string, Set<string>>();
    nodes.forEach((n) => adj.set(n.id, new Set()));
    edges.forEach((e) => {
      adj.get(e.source)?.add(e.target);
      adj.get(e.target)?.add(e.source);
    });
    neighborsRef.current = adj;
  }, [nodes, edges]);

  // ── Force simulation step ──
  const simulate = useCallback(() => {
    const sim = simRef.current;
    const n = sim.length;

    // Repulsion (charge)
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = sim[j].x - sim[i].x;
        let dy = sim[j].y - sim[i].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MIN_DIST) dist = MIN_DIST;
        const force = REPULSION / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        sim[i].vx -= fx;
        sim[i].vy -= fy;
        sim[j].vx += fx;
        sim[j].vy += fy;
      }
    }

    // Attraction (springs along edges)
    const nodeMap = new Map(sim.map((s) => [s.id, s]));
    edges.forEach((e) => {
      const a = nodeMap.get(e.source);
      const b = nodeMap.get(e.target);
      if (!a || !b) return;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 1) return;
      const force = (dist - 120) * ATTRACTION;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    });

    // Center gravity
    sim.forEach((s) => {
      s.vx -= s.x * CENTER_GRAVITY;
      s.vy -= s.y * CENTER_GRAVITY;
    });

    // Apply velocity + damping
    sim.forEach((s) => {
      if (draggingNode.current === s.id) {
        s.vx = 0;
        s.vy = 0;
        return;
      }
      s.vx *= DAMPING;
      s.vy *= DAMPING;
      s.x += s.vx;
      s.y += s.vy;
    });
  }, [edges]);

  // ── Canvas rendering ──
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const z = zoomRef.current;
    const p = panRef.current;
    const sel = selectedRef.current;
    const hov = hoveredRef.current;
    const neighbors = neighborsRef.current;

    // Clear
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, w, h);

    // Dot grid background
    ctx.save();
    ctx.translate(w / 2 + p.x, h / 2 + p.y);
    ctx.scale(z, z);

    const gridSize = 40;
    const startX = Math.floor((-w / 2 / z - p.x / z) / gridSize) * gridSize;
    const startY = Math.floor((-h / 2 / z - p.y / z) / gridSize) * gridSize;
    const endX = startX + (w / z + 200);
    const endY = startY + (h / z + 200);
    ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
    for (let x = startX; x < endX; x += gridSize) {
      for (let y = startY; y < endY; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const sim = simRef.current;
    const nodeMap = new Map(sim.map((s) => [s.id, s]));
    const focusNeighbors = (sel || hov) ? neighbors.get(sel || hov!) : null;

    // ── Draw edges ──
    edges.forEach((e) => {
      const a = nodeMap.get(e.source);
      const b = nodeMap.get(e.target);
      if (!a || !b) return;
      if (!activeTypes.has(a.type) || !activeTypes.has(b.type)) return;

      const isConnected = sel
        ? (e.source === sel || e.target === sel)
        : hov
          ? (e.source === hov || e.target === hov)
          : true;

      const alpha = (sel || hov) ? (isConnected ? 0.7 : 0.05) : 0.25;

      // Curved edge
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const cx = mx - dy * 0.08;
      const cy = my + dx * 0.08;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(cx, cy, b.x, b.y);
      ctx.strokeStyle = isConnected && (sel || hov) ? "rgba(59, 130, 246, " + alpha + ")" : "rgba(148, 163, 184, " + alpha + ")";
      ctx.lineWidth = isConnected && (sel || hov) ? 2 : 1;
      ctx.stroke();

      // Edge label (only when connected and zoomed in)
      if (isConnected && (sel || hov) && z > 0.7 && e.label) {
        ctx.save();
        ctx.font = `${10 / z}px var(--font-mono, monospace)`;
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.textAlign = "center";
        ctx.fillText(e.label, cx, cy - 4);
        ctx.restore();
      }
    });

    // ── Draw nodes ──
    sim.forEach((node) => {
      if (!activeTypes.has(node.type)) return;

      const isSelected = sel === node.id;
      const isHovered = hov === node.id;
      const isNeighbor = focusNeighbors?.has(node.id);
      const isFocusNode = isSelected || node.id === hov;

      let alpha = 1;
      if (sel || hov) {
        alpha = (isFocusNode || isNeighbor) ? 1 : 0.12;
      }

      const color = entityColor(node.type);
      const r = node.radius;

      // Glow ring for selected/hovered
      if (isSelected || isHovered) {
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 12, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(node.x, node.y, r, node.x, node.y, r + 16);
        glow.addColorStop(0, color);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.restore();
      }

      // Highlighted ring (primary entity)
      if (node.highlighted) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 5, 0, Math.PI * 2);
        ctx.strokeStyle = "#FF9933";
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = alpha;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fill();

      // Selection ring
      if (isSelected) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Node label
      if (z > 0.5 && (alpha > 0.5 || isSelected || isHovered)) {
        const fontSize = Math.max(10, 12 / z);
        ctx.font = `600 ${fontSize}px var(--font-sans, system-ui)`;
        ctx.textAlign = "center";
        ctx.fillStyle = "rgba(248, 250, 252, " + alpha + ")";
        ctx.fillText(node.label.split("\n")[0], node.x, node.y + r + fontSize + 4);

        // Type badge
        ctx.font = `700 ${fontSize * 0.75}px var(--font-mono, monospace)`;
        ctx.fillStyle = "rgba(148, 163, 184, " + (alpha * 0.7) + ")";
        ctx.fillText(entityBadge(node.type), node.x, node.y + r + fontSize * 1.8 + 4);
      }

      ctx.globalAlpha = 1;
    });

    ctx.restore();
  }, [edges, activeTypes]);

  // ── Animation loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = container.clientWidth;
      canvas.width = w * dpr;
      canvas.height = height * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = height + "px";
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let running = true;
    const tick = () => {
      if (!running) return;
      simulate();
      render();
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [height, simulate, render]);

  // ── Mouse interaction ──
  const screenToWorld = useCallback((sx: number, sy: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2 + panRef.current.x;
    const cy = rect.height / 2 + panRef.current.y;
    return {
      x: (sx - rect.left - cx) / zoomRef.current,
      y: (sy - rect.top - cy) / zoomRef.current,
    };
  }, []);

  const findNode = useCallback((wx: number, wy: number): SimNode | null => {
    const sim = simRef.current;
    for (let i = sim.length - 1; i >= 0; i--) {
      const n = sim[i];
      if (!activeTypes.has(n.type)) continue;
      const dx = wx - n.x;
      const dy = wy - n.y;
      if (dx * dx + dy * dy < (n.radius + 4) * (n.radius + 4)) return n;
    }
    return null;
  }, [activeTypes]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const w = screenToWorld(e.clientX, e.clientY);
    const node = findNode(w.x, w.y);
    if (node) {
      draggingNode.current = node.id;
    } else {
      isPanning.current = true;
    }
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, [screenToWorld, findNode]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };

    if (draggingNode.current) {
      const w = screenToWorld(e.clientX, e.clientY);
      const node = simRef.current.find((n) => n.id === draggingNode.current);
      if (node) {
        node.x = w.x;
        node.y = w.y;
      }
      return;
    }

    if (isPanning.current) {
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
      return;
    }

    // Hover detection
    const w = screenToWorld(e.clientX, e.clientY);
    const node = findNode(w.x, w.y);
    const newId = node?.id ?? null;
    if (newId !== hoveredRef.current) {
      hoveredRef.current = newId;
      setHoveredId(newId);
    }
  }, [screenToWorld, findNode]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (draggingNode.current) {
      // Check if it was a click (not a drag)
      const w = screenToWorld(e.clientX, e.clientY);
      const node = findNode(w.x, w.y);
      if (node && node.id === draggingNode.current) {
        const next = selectedRef.current === node.id ? null : node.id;
        onNodeSelect?.(next);
      }
      draggingNode.current = null;
    }
    isPanning.current = false;
  }, [screenToWorld, findNode, onNodeSelect]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.max(0.2, Math.min(4, z * delta)));
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    const w = screenToWorld(e.clientX, e.clientY);
    const node = findNode(w.x, w.y);
    if (node && onNodeNavigate) {
      onNodeNavigate(node.id);
    }
  }, [screenToWorld, findNode, onNodeNavigate]);

  // ── Controls ──
  const zoomIn = () => setZoom((z) => Math.min(4, z * 1.3));
  const zoomOut = () => setZoom((z) => Math.max(0.2, z / 1.3));
  const fitView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleType = (t: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const presentTypes = [...new Set(nodes.map((n) => n.type))].sort(
    (a, b) => TYPE_ORDER.indexOf(a) - TYPE_ORDER.indexOf(b)
  );

  // Search highlight
  const searchMatch = searchQuery.trim()
    ? nodes.find((n) =>
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  useEffect(() => {
    if (searchMatch) {
      const sim = simRef.current.find((s) => s.id === searchMatch.id);
      if (sim) {
        setPan({ x: -sim.x * zoomRef.current, y: -sim.y * zoomRef.current });
        onNodeSelect?.(searchMatch.id);
      }
    }
  }, [searchMatch, onNodeSelect]);

  const hoveredNode = hoveredId ? nodes.find((n) => n.id === hoveredId) : null;

  return (
    <div ref={containerRef} className="relative rounded-2xl overflow-hidden border border-[var(--color-border-subtle)]" style={{ height, background: "#030712" }}>
      <canvas
        ref={canvasRef}
        className="block cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          isPanning.current = false;
          draggingNode.current = null;
          hoveredRef.current = null;
          setHoveredId(null);
        }}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      />

      {/* ── Search bar (top-center) ── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center bg-[rgba(17,24,39,0.8)] backdrop-blur-lg border border-[rgba(255,255,255,0.1)] rounded-xl px-4 py-2 gap-2 min-w-[280px]">
          <Search size={14} className="text-[var(--color-text-muted)] flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entities..."
            className="bg-transparent outline-none text-[13px] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] w-full"
          />
        </div>
      </div>

      {/* ── Entity type legend (top-left) ── */}
      <div className="absolute top-4 left-4 z-20 bg-[rgba(17,24,39,0.85)] backdrop-blur-lg border border-[rgba(255,255,255,0.08)] rounded-xl p-3 max-w-[200px]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">Entity Types</div>
        <div className="flex flex-wrap gap-1.5">
          {presentTypes.map((t) => {
            const on = activeTypes.has(t);
            return (
              <button
                key={t}
                onClick={() => toggleType(t)}
                aria-pressed={on}
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all text-[10px] font-semibold"
                style={{
                  borderColor: on ? entityColor(t) : "rgba(255,255,255,0.08)",
                  background: on ? entityColor(t) + "18" : "transparent",
                  color: on ? entityColor(t) : "var(--color-text-muted)",
                  opacity: on ? 1 : 0.5,
                }}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entityColor(t) }} />
                {TYPE_LABEL[t] || t}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Zoom controls (bottom-right) ── */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
        <button onClick={zoomIn} className="w-9 h-9 rounded-xl bg-[rgba(17,24,39,0.85)] backdrop-blur-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-primary)] transition-all" title="Zoom in">
          <ZoomIn size={16} />
        </button>
        <button onClick={zoomOut} className="w-9 h-9 rounded-xl bg-[rgba(17,24,39,0.85)] backdrop-blur-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-primary)] transition-all" title="Zoom out">
          <ZoomOut size={16} />
        </button>
        <button onClick={fitView} className="w-9 h-9 rounded-xl bg-[rgba(17,24,39,0.85)] backdrop-blur-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-primary)] transition-all" title="Fit to view">
          <Maximize size={16} />
        </button>
      </div>

      {/* ── Stats (bottom-left) ── */}
      <div className="absolute bottom-4 left-4 z-20 bg-[rgba(17,24,39,0.85)] backdrop-blur-lg border border-[rgba(255,255,255,0.08)] rounded-xl px-4 py-2.5">
        <div className="font-mono text-[12px] text-[var(--color-text-primary)] font-semibold">
          {nodes.filter((n) => activeTypes.has(n.type)).length} entities · {edges.length} relationships
        </div>
        <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
          Drag nodes · Scroll to zoom · Click to inspect · Double-click to navigate
        </div>
      </div>

      {/* ── Zoom indicator (bottom-center) ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-[rgba(17,24,39,0.7)] backdrop-blur-sm rounded-lg px-3 py-1 text-[10px] font-mono text-[var(--color-text-muted)]">
        {Math.round(zoom * 100)}%
      </div>

      {/* ── Hover tooltip ── */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none bg-[rgba(17,24,39,0.95)] backdrop-blur-lg border border-[rgba(255,255,255,0.15)] rounded-xl px-4 py-3 shadow-2xl"
          style={{
            left: Math.min(lastMouse.current.x - (containerRef.current?.getBoundingClientRect().left || 0) + 16, (containerRef.current?.clientWidth || 400) - 220),
            top: lastMouse.current.y - (containerRef.current?.getBoundingClientRect().top || 0) - 10,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full" style={{ background: entityColor(hoveredNode.type) }} />
            <span className="font-semibold text-[13px] text-white">{hoveredNode.label}</span>
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)]">
            <span className="font-mono font-semibold" style={{ color: entityColor(hoveredNode.type) }}>
              {entityBadge(hoveredNode.type)}
            </span>
            <span className="mx-1.5">·</span>
            {hoveredNode.id}
          </div>
          {hoveredNode.data?.evidenceCount != null && (
            <div className="text-[10px] text-[var(--color-text-muted)] mt-1">
              {String(hoveredNode.data.evidenceCount)} evidence items
            </div>
          )}
        </div>
      )}
    </div>
  );
}
