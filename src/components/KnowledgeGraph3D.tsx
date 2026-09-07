import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { entityColor, entityBadge, PALETTE } from "../theme";

interface Node {
  id: string;
  label: string;
  type: string;
  highlighted?: boolean;
}

interface Edge {
  source: string;
  target: string;
  label: string;
}

interface Props {
  nodes: Node[];
  edges: Edge[];
  height?: number;
  selectedId?: string | null;
  onNodeSelect?: (id: string | null) => void;
}

// Fixed cluster/legend order so a repaint never reshuffles identity.
const TYPE_ORDER = ["person", "case", "org", "financial", "account", "phone", "vehicle", "location", "event"];

// Deterministic point on a Fibonacci sphere of the given radius.
function fibPoint(i: number, n: number, radius: number): [number, number, number] {
  if (n <= 1) return [0, 0, 0];
  const y = 1 - (i / (n - 1)) * 2;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const phi = Math.PI * (3 - Math.sqrt(5));
  const theta = phi * i;
  return [Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius];
}

interface NodeObj {
  mesh: THREE.Mesh;
  label: CSS2DObject;
  type: string;
  material: THREE.MeshStandardMaterial;
  baseScale: number;
}
interface EdgeObj {
  line: THREE.Line;
  material: THREE.LineBasicMaterial;
  source: string;
  target: string;
}

export default function KnowledgeGraph3D({ nodes, edges, height = 620, selectedId = null, onNodeSelect }: Props) {
  const glRef = useRef<HTMLDivElement>(null);
  const labelHostRef = useRef<HTMLDivElement>(null);

  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [hover, setHover] = useState<{ label: string; type: string; x: number; y: number } | null>(null);

  const presentTypes = useMemo(() => {
    const seen = new Set(nodes.map((n) => n.type));
    return TYPE_ORDER.filter((t) => seen.has(t)).concat([...seen].filter((t) => !TYPE_ORDER.includes(t)));
  }, [nodes]);

  const [activeTypes, setActiveTypes] = useState<Set<string>>(() => new Set(presentTypes));
  useEffect(() => setActiveTypes(new Set(presentTypes)), [presentTypes]);

  // Imperative bridges (React panel state -> three objects) kept in refs.
  const refreshRef = useRef<() => void>(() => {});
  const fitRef = useRef<() => void>(() => {});
  const resetRef = useRef<() => void>(() => {});
  const selectedRef = useRef<string | null>(selectedId);
  const activeRef = useRef<Set<string>>(activeTypes);
  const labelsRef = useRef<boolean>(showLabels);
  const autoRotateApplyRef = useRef<(v: boolean) => void>(() => {});

  // Live counts for the stats panel.
  const visibleCounts = useMemo(() => {
    const nvis = nodes.filter((n) => activeTypes.has(n.type));
    const ids = new Set(nvis.map((n) => n.id));
    const evis = edges.filter((e) => ids.has(e.source) && ids.has(e.target));
    return { nodes: nvis.length, edges: evis.length };
  }, [nodes, edges, activeTypes]);

  // ── Scene construction ──────────────────────────────────────────────────
  useEffect(() => {
    const glHost = glRef.current;
    const labelHost = labelHostRef.current;
    if (!glHost || !labelHost) return;

    let w = glHost.clientWidth || 900;
    const h = height;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(PALETTE.surface);

    const camera = new THREE.PerspectiveCamera(60, w / h, 1, 5000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    glHost.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(w, h);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0";
    labelRenderer.domElement.style.left = "0";
    labelRenderer.domElement.style.pointerEvents = "none";
    labelHost.appendChild(labelRenderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(120, 160, 140);
    scene.add(dir);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotateSpeed = 0.8;
    controls.autoRotate = autoRotate;

    // Adjacency for neighbour emphasis.
    const neighbors = new Map<string, Set<string>>();
    nodes.forEach((n) => neighbors.set(n.id, new Set()));
    edges.forEach((e) => {
      neighbors.get(e.source)?.add(e.target);
      neighbors.get(e.target)?.add(e.source);
    });

    // Deterministic clustered-by-type layout.
    const byType = new Map<string, Node[]>();
    nodes.forEach((n) => {
      if (!byType.has(n.type)) byType.set(n.type, []);
      byType.get(n.type)!.push(n);
    });
    const clusterTypes = [...byType.keys()];
    const positions = new Map<string, THREE.Vector3>();
    const R_CLUSTER = clusterTypes.length > 1 ? 96 : 0;
    clusterTypes.forEach((t, ti) => {
      const [cx, cy, cz] = fibPoint(ti, clusterTypes.length, R_CLUSTER);
      const group = byType.get(t)!;
      const rLocal = 16 + Math.min(group.length, 22) * 1.7;
      group.forEach((n, j) => {
        const [lx, ly, lz] = fibPoint(j, group.length, rLocal);
        positions.set(n.id, new THREE.Vector3(cx + lx, cy + ly, cz + lz));
      });
    });

    const nodeObjs = new Map<string, NodeObj>();
    const sphereGeoCache = new Map<number, THREE.SphereGeometry>();
    const getSphere = (r: number) => {
      if (!sphereGeoCache.has(r)) sphereGeoCache.set(r, new THREE.SphereGeometry(r, 28, 28));
      return sphereGeoCache.get(r)!;
    };
    const ringGeos: THREE.BufferGeometry[] = [];

    nodes.forEach((n) => {
      const pos = positions.get(n.id)!;
      const isPrimary = !!n.highlighted;
      const r = isPrimary ? 8 : n.type === "person" || n.type === "case" ? 6 : 5;
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(entityColor(n.type)),
        roughness: 0.55,
        metalness: 0.05,
        transparent: true,
        opacity: 1,
      });
      const mesh = new THREE.Mesh(getSphere(r), material);
      mesh.position.copy(pos);
      mesh.userData = { id: n.id };
      scene.add(mesh);

      // Priority ring (saffron) instead of a neon glow.
      if (isPrimary) {
        const ringGeo = new THREE.TorusGeometry(r * 1.7, 0.7, 10, 40);
        ringGeos.push(ringGeo);
        const ring = new THREE.Mesh(
          ringGeo,
          new THREE.MeshBasicMaterial({ color: new THREE.Color(PALETTE.saffron) })
        );
        mesh.add(ring);
      }

      // CSS2D label chip.
      const div = document.createElement("div");
      div.style.cssText =
        "padding:2px 6px;font:600 10px/1.2 var(--font-sans);color:#14181f;" +
        "background:rgba(251,252,253,0.92);border:1px solid #b3bdc9;border-radius:2px;" +
        "white-space:nowrap;pointer-events:none;";
      div.textContent = `${entityBadge(n.type)} · ${n.label.split("\n")[0]}`;
      const label = new CSS2DObject(div);
      label.position.set(0, r + 6, 0);
      mesh.add(label);

      nodeObjs.set(n.id, { mesh, label, type: n.type, material, baseScale: 1 });
    });

    const edgeObjs: EdgeObj[] = [];
    const edgeGeos: THREE.BufferGeometry[] = [];
    edges.forEach((e) => {
      const a = positions.get(e.source);
      const b = positions.get(e.target);
      if (!a || !b) return;
      const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
      edgeGeos.push(geo);
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(PALETTE.borderStrong),
        transparent: true,
        opacity: 0.5,
      });
      const line = new THREE.Line(geo, material);
      scene.add(line);
      edgeObjs.push({ line, material, source: e.source, target: e.target });
    });

    // ── Fit / reset view ──
    const maxR = Math.max(40, ...[...positions.values()].map((p) => p.length()));
    const fitDist = (maxR / Math.tan((camera.fov * Math.PI) / 360)) * 1.25;
    const home = new THREE.Vector3(fitDist * 0.35, fitDist * 0.28, fitDist);
    const applyHome = () => {
      camera.position.copy(home);
      controls.target.set(0, 0, 0);
      controls.update();
    };
    applyHome();
    fitRef.current = applyHome;
    resetRef.current = applyHome;

    // ── Appearance refresh (selection / filter / labels) ──
    const nodeTypeOf = (id: string) => nodeObjs.get(id)?.type;
    const refresh = () => {
      const sel = selectedRef.current;
      const active = activeRef.current;
      const showL = labelsRef.current;
      nodeObjs.forEach((o, id) => {
        const typeOn = active.has(o.type);
        o.mesh.visible = typeOn;
        const near = !sel || sel === id || neighbors.get(sel)?.has(id);
        o.label.visible = typeOn && showL && !!near;
        const opacity = sel ? (near ? 1 : 0.12) : 1;
        o.material.opacity = opacity;
        o.mesh.scale.setScalar(sel === id ? 1.4 : 1);
      });
      edgeObjs.forEach((e) => {
        const on = active.has(nodeTypeOf(e.source) ?? "") && active.has(nodeTypeOf(e.target) ?? "");
        e.line.visible = on;
        const inc = e.source === sel || e.target === sel;
        e.material.color.set(new THREE.Color(sel && inc ? PALETTE.accent : PALETTE.borderStrong));
        e.material.opacity = sel ? (inc ? 0.95 : 0.05) : 0.5;
      });
    };
    refreshRef.current = refresh;
    refresh();

    // ── Raycast hover + click (click distinguished from drag) ──
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let down: { x: number; y: number } | null = null;

    const meshes = () => [...nodeObjs.values()].filter((o) => o.mesh.visible).map((o) => o.mesh);
    const pick = (ev: PointerEvent): string | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hit = raycaster.intersectObjects(meshes(), false)[0];
      return hit ? (hit.object.userData.id as string) : null;
    };

    const onMove = (ev: PointerEvent) => {
      const id = pick(ev);
      if (id) {
        const n = nodes.find((x) => x.id === id)!;
        const rect = renderer.domElement.getBoundingClientRect();
        setHover({ label: n.label.split("\n")[0], type: n.type, x: ev.clientX - rect.left, y: ev.clientY - rect.top });
        renderer.domElement.style.cursor = "pointer";
      } else {
        setHover(null);
        renderer.domElement.style.cursor = "grab";
      }
    };
    const onDown = (ev: PointerEvent) => {
      down = { x: ev.clientX, y: ev.clientY };
    };
    const onUp = (ev: PointerEvent) => {
      if (!down) return;
      const moved = Math.hypot(ev.clientX - down.x, ev.clientY - down.y);
      down = null;
      if (moved > 6) return; // a drag, not a click
      const id = pick(ev);
      const next = id && selectedRef.current === id ? null : id;
      if (onNodeSelect) onNodeSelect(next);
      else {
        selectedRef.current = next;
        refresh();
      }
    };
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);

    // ── Resize ──
    const onResize = () => {
      w = glHost.clientWidth || w;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(glHost);

    // ── Loop ──
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    tick();

    // Expose autoRotate handle via a mutable closure the effect below reads.
    autoRotateApplyRef.current = (v: boolean) => {
      controls.autoRotate = v;
    };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointermove", onMove);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      controls.dispose();
      nodeObjs.forEach((o) => {
        o.material.dispose();
        if (o.label.element.parentNode) o.label.element.parentNode.removeChild(o.label.element);
      });
      edgeObjs.forEach((e) => e.material.dispose());
      edgeGeos.forEach((g) => g.dispose());
      ringGeos.forEach((g) => g.dispose());
      sphereGeoCache.forEach((g) => g.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
      if (labelRenderer.domElement.parentNode) labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement);
      autoRotateApplyRef.current = () => {};
      refreshRef.current = () => {};
      fitRef.current = () => {};
      resetRef.current = () => {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, height]);

  // Bridge panel state into the live scene.
  useEffect(() => {
    autoRotateApplyRef.current(autoRotate);
  }, [autoRotate]);
  useEffect(() => {
    selectedRef.current = selectedId;
    refreshRef.current();
  }, [selectedId]);
  useEffect(() => {
    activeRef.current = activeTypes;
    refreshRef.current();
  }, [activeTypes]);
  useEffect(() => {
    labelsRef.current = showLabels;
    refreshRef.current();
  }, [showLabels]);

  const toggleType = (t: string) =>
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });

  return (
    <div className="relative bg-[var(--color-surface)] border border-[var(--color-border-subtle)]" style={{ height }}>
      {/* WebGL + label layers */}
      <div ref={glRef} className="absolute inset-0" />
      <div ref={labelHostRef} className="absolute inset-0" style={{ pointerEvents: "none" }} />

      {/* Controls (top-right) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 items-end">
        <div className="flex gap-1.5">
          <button className="gov-chip" aria-pressed={autoRotate} onClick={() => setAutoRotate((v) => !v)}>
            {autoRotate ? "Pause rotation" : "Auto-rotate"}
          </button>
          <button className="gov-chip" aria-pressed={showLabels} onClick={() => setShowLabels((v) => !v)}>
            {showLabels ? "Hide labels" : "Show labels"}
          </button>
        </div>
        <div className="flex gap-1.5">
          <button className="gov-chip" onClick={() => fitRef.current()}>Fit view</button>
          <button className="gov-chip" onClick={() => resetRef.current()}>Reset</button>
        </div>
      </div>

      {/* Legend / type filter (top-left) */}
      <div className="absolute top-3 left-3 z-20 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm p-2.5 max-w-[220px]">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">Entity types</div>
        <div className="flex flex-wrap gap-1">
          {presentTypes.map((t) => {
            const on = activeTypes.has(t);
            return (
              <button
                key={t}
                onClick={() => toggleType(t)}
                aria-pressed={on}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded-sm border transition-colors"
                style={{
                  borderColor: on ? entityColor(t) : "var(--color-border-subtle)",
                  background: on ? "var(--color-surface-2)" : "transparent",
                  opacity: on ? 1 : 0.5,
                }}
                title={on ? `Hide ${t}` : `Show ${t}`}
              >
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: entityColor(t) }} />
                <span className="text-[10px] font-mono font-semibold text-[var(--color-text-secondary)]">{entityBadge(t)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats (bottom-left) */}
      <div className="absolute bottom-3 left-3 z-20 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-sm px-3 py-2 text-[11px]">
        <div className="font-mono text-[var(--color-text-primary)] font-semibold">
          {visibleCounts.nodes} entities · {visibleCounts.edges} links
        </div>
        <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">Drag to rotate · Scroll to zoom · Click a node to focus</div>
      </div>

      {/* Hover tooltip */}
      {hover && (
        <div
          className="graph-tooltip"
          style={{ left: Math.min(hover.x + 12, 9999), top: hover.y - 8 }}
        >
          <span className="font-mono font-semibold" style={{ color: entityColor(hover.type) }}>{entityBadge(hover.type)}</span>
          <span className="mx-1.5 text-[var(--color-border-strong)]">|</span>
          {hover.label}
        </div>
      )}
    </div>
  );
}
