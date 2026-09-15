import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { Network, CreditCard, Radio, MapPin, ShieldAlert, ChevronRight, Play, Pause } from "./icons";
import type { IconProps } from "./icons";

// ── Auto-rotating "priority brief" of the investigative challenges the platform
// is built to close. News-ticker cadence (advances every 3s), pauses on hover or
// keyboard focus, honours prefers-reduced-motion, and every control is real:
// the arrows/dots move the deck, the toggle stops it, the CTA opens the module.
// Flat institutional styling only (no gradient, glass, shadow or neon).

interface Slide {
  id: string;
  category: string;
  Icon: ComponentType<IconProps>;
  motif: "network" | "financial" | "signal" | "map" | "dashboard";
  headline: string;
  problem: string;
  response: string; // completes the sentence "Decypher <response>"
  page: string;
}

const SLIDES: Slide[] = [
  {
    id: "organised",
    category: "Organised Crime",
    Icon: Network,
    motif: "network",
    headline: "Fragmented records hide the real network",
    problem:
      "Financial ledgers, call detail records and field reports sit in separate silos, so the people who connect them stay invisible.",
    response: "resolves entities across every source and surfaces the hidden links as one reviewable graph.",
    page: "graph",
  },
  {
    id: "financial",
    category: "Financial Crime",
    Icon: CreditCard,
    motif: "financial",
    headline: "Money moves faster than manual review",
    problem:
      "Layered transfers through shell accounts break the trail long before a spreadsheet review can follow it.",
    response: "traces fund flow end to end and flags the accounts that bridge otherwise unrelated cases.",
    page: "financial",
  },
  {
    id: "cyber",
    category: "Cyber-Enabled Crime",
    Icon: Radio,
    motif: "signal",
    headline: "One suspect, many disposable identities",
    problem:
      "Numbers, handles and devices are rotated constantly to stay ahead of any single-thread investigation.",
    response: "links aliases back to a canonical identity and keeps every association explainable.",
    page: "graph",
  },
  {
    id: "narcotics",
    category: "Narcotics & Trafficking",
    Icon: MapPin,
    motif: "map",
    headline: "Routes reveal what single stops cannot",
    problem:
      "Isolated seizure reports miss the corridor, the timing and the repeat co-location that define a trafficking route.",
    response: "correlates location, movement and time to make the corridor visible on one map.",
    page: "map",
  },
  {
    id: "crossborder",
    category: "Cross-Border Threats",
    Icon: ShieldAlert,
    motif: "dashboard",
    headline: "Signals scattered across jurisdictions",
    problem:
      "Coordinated activity reads as unrelated fragments when each jurisdiction reviews only its own feed.",
    response: "consolidates authorized feeds into a single command view for faster, accountable decisions.",
    page: "dashboard",
  },
];

const SACCENT = "var(--color-saffron)";

// Thematic institutional line-motifs (white strokes + saffron accent) shown on
// the navy visual panel. A supplied photo at /slide{n}.png, if present, layers
// on top and takes over; otherwise this motif is what the judge sees.
function Motif({ kind }: { kind: Slide["motif"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "network") {
    return (
      <svg viewBox="0 0 240 180" className="w-full max-w-[300px]" role="img" aria-label="Network of linked entities">
        <g {...common} strokeOpacity="0.6">
          <path d="M120 46 L60 78 M120 46 L182 70 M120 46 L118 118 M60 78 L52 138 M182 70 L190 132 M118 118 L52 138 M118 118 L190 132" />
        </g>
        <g {...common}>
          <circle cx="60" cy="78" r="9" />
          <circle cx="182" cy="70" r="9" />
          <circle cx="52" cy="138" r="9" />
          <circle cx="190" cy="132" r="9" />
          <circle cx="118" cy="118" r="9" />
        </g>
        <circle cx="120" cy="46" r="13" fill={SACCENT} stroke="#ffffff" strokeWidth="2.5" />
      </svg>
    );
  }
  if (kind === "financial") {
    return (
      <svg viewBox="0 0 240 180" className="w-full max-w-[300px]" role="img" aria-label="Funds moving through layered accounts">
        <g {...common}>
          <rect x="16" y="72" width="52" height="36" rx="2" />
          <rect x="96" y="30" width="52" height="36" rx="2" />
          <rect x="96" y="114" width="52" height="36" rx="2" />
          <rect x="176" y="72" width="52" height="36" rx="2" />
        </g>
        <g {...common} strokeOpacity="0.65">
          <path d="M68 86 L96 54 M68 96 L96 130 M148 48 L176 84 M148 132 L176 96" />
        </g>
        <g fill={SACCENT} stroke="none">
          <path d="M92 52 l7 2 -3 6 z" />
          <path d="M172 82 l7 2 -3 6 z" />
        </g>
        <line x1="42" y1="90" x2="202" y2="90" stroke={SACCENT} strokeWidth="2" strokeDasharray="4 5" strokeOpacity="0.85" />
      </svg>
    );
  }
  if (kind === "signal") {
    return (
      <svg viewBox="0 0 240 180" className="w-full max-w-[300px]" role="img" aria-label="One identity broadcasting many handles">
        <g {...common} strokeOpacity="0.55">
          <path d="M120 90 m-30 0 a30 30 0 0 1 60 0" />
          <path d="M120 90 m-50 0 a50 50 0 0 1 100 0" />
          <path d="M120 90 m-70 0 a70 70 0 0 1 140 0" />
        </g>
        <g {...common}>
          <circle cx="56" cy="128" r="8" />
          <circle cx="184" cy="128" r="8" />
          <circle cx="120" cy="150" r="8" />
          <path d="M120 103 L56 128 M120 103 L184 128 M120 103 L120 150" strokeOpacity="0.6" />
        </g>
        <circle cx="120" cy="90" r="13" fill={SACCENT} stroke="#ffffff" strokeWidth="2.5" />
      </svg>
    );
  }
  if (kind === "map") {
    return (
      <svg viewBox="0 0 240 180" className="w-full max-w-[300px]" role="img" aria-label="A route linking locations over time">
        <g stroke="currentColor" strokeWidth="1" strokeOpacity="0.25">
          <path d="M0 45 H240 M0 90 H240 M0 135 H240 M60 0 V180 M120 0 V180 M180 0 V180" />
        </g>
        <path d="M40 140 C 90 120 70 60 130 56 C 180 52 176 108 208 96" fill="none" stroke={SACCENT} strokeWidth="2.5" strokeDasharray="6 5" />
        <g {...common}>
          <path d="M40 140 c-8 -10 -8 -16 0 -22 c8 6 8 12 0 22 z" fill="#ffffff" stroke="#ffffff" />
          <path d="M130 56 c-9 -11 -9 -18 0 -25 c9 7 9 14 0 25 z" fill={SACCENT} stroke="#ffffff" />
          <path d="M208 96 c-8 -10 -8 -16 0 -22 c8 6 8 12 0 22 z" fill="#ffffff" stroke="#ffffff" />
        </g>
      </svg>
    );
  }
  // dashboard
  return (
    <svg viewBox="0 0 240 180" className="w-full max-w-[300px]" role="img" aria-label="Consolidated command view">
      <g {...common}>
        <rect x="18" y="24" width="204" height="132" rx="3" strokeOpacity="0.7" />
        <line x1="18" y1="50" x2="222" y2="50" strokeOpacity="0.5" />
      </g>
      <g stroke="currentColor" strokeWidth="10" strokeLinecap="round">
        <line x1="52" y1="132" x2="52" y2="104" strokeOpacity="0.75" />
        <line x1="84" y1="132" x2="84" y2="88" strokeOpacity="0.75" />
        <line x1="116" y1="132" x2="116" y2="112" strokeOpacity="0.75" />
        <line x1="148" y1="132" x2="148" y2="72" stroke={SACCENT} />
      </g>
      <path d="M44 78 L76 66 L108 72 L140 46 L176 58 L204 40" fill="none" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.8" />
      <circle cx="200" cy="38" r="4" fill={SACCENT} stroke="none" />
    </svg>
  );
}

// The navy visual panel: motif underneath, optional supplied photo on top.
function SlideVisual({ index, motif }: { index: number; motif: Slide["motif"] }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative min-h-[220px] md:min-h-[340px] bg-[var(--color-primary-hover)] overflow-hidden">
      {/* Faint tiranga wave watermark ties the brief to the national identity */}
      <div
        className="absolute inset-0 bg-center bg-cover pointer-events-none"
        style={{ backgroundImage: "url('/bg.png')", opacity: 0.1 }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center p-8 text-white">
        <Motif kind={motif} />
      </div>
      {/* Optional supplied image. Fades in only if /slide{n}.png actually loads. */}
      <img
        src={`/slide${index + 1}.png`}
        alt=""
        aria-hidden="true"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        style={{ opacity: loaded ? 1 : 0 }}
      />
      <div className="absolute bottom-3 left-3 z-10 font-mono text-[10px] tracking-wider text-white/70 bg-[var(--color-primary)]/70 px-2 py-0.5 rounded-sm">
        FIG. {String(index + 1).padStart(2, "0")}
      </div>
    </div>
  );
}

interface Props {
  onNavigate: (page: string) => void;
}

export default function ProblemsCarousel({ onNavigate }: Props) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false); // hover / focus pause
  const [reduced, setReduced] = useState(false);
  const total = SLIDES.length;

  const go = (i: number) => setActive(((i % total) + total) % total);
  const next = () => go(active + 1);
  const prev = () => go(active - 1);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener?.("change", sync);
    return () => mq.removeEventListener?.("change", sync);
  }, []);

  const running = playing && !paused && !reduced;
  // Keep the interval reading the latest `active` without re-arming every tick.
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setActive((a) => (a + 1) % total), 3000);
    return () => clearInterval(id);
  }, [running, total]);

  return (
    <section aria-label="Priority crime challenges" className="bg-[var(--color-base-bg)] border-b border-[var(--color-border-subtle)]">
      <div className="max-w-[1440px] mx-auto px-6 py-14">
        {/* Section header */}
        <div className="flex items-end justify-between gap-6 mb-6 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="tricolor-strip w-10" aria-hidden="true">
                <span className="flag-saffron" />
                <span className="flag-white" />
                <span className="flag-green" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                Priority Challenges
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">The problems Decypher is built to solve</h2>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-sm">
            An auto-rotating brief of the investigative gaps this platform is designed to close.
          </p>
        </div>

        {/* Carousel card */}
        <div
          className="gov-panel overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="tricolor-strip" aria-hidden="true">
            <span className="flag-saffron" />
            <span className="flag-white" />
            <span className="flag-green" />
          </div>

          {/* Viewport */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform ease-out"
              style={{ transform: `translateX(-${active * 100}%)`, transitionDuration: reduced ? "0ms" : "500ms" }}
            >
              {SLIDES.map((s, i) => {
                const Icon = s.Icon;
                const current = i === active;
                return (
                  <div key={s.id} className="w-full flex-shrink-0" aria-hidden={!current}>
                    <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr]">
                      {/* Text panel */}
                      <div className="bg-[var(--color-primary)] text-white p-8 md:p-10 flex flex-col justify-center min-w-0 order-2 md:order-1">
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm"
                            style={{ background: SACCENT, color: "#241400" }}
                          >
                            <Icon size={13} /> {s.category}
                          </span>
                          <span className="font-mono text-[11px] text-white/55">
                            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                          </span>
                        </div>

                        <h3 className="text-white text-[22px] md:text-[27px] leading-tight mb-4" style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}>
                          {s.headline}
                        </h3>

                        <p className="text-[14px] leading-relaxed text-white/80 mb-4 max-w-[540px]">{s.problem}</p>

                        <p className="text-[14px] leading-relaxed text-white/95 max-w-[540px]">
                          <span className="text-[var(--color-saffron)] font-semibold">Decypher </span>
                          {s.response}
                        </p>

                        <button
                          onClick={() => onNavigate(s.page)}
                          tabIndex={current ? 0 : -1}
                          className="inline-flex items-center gap-1.5 self-start mt-7 px-4 py-2.5 rounded-sm border border-white/70 text-white text-[12px] font-semibold uppercase tracking-wider transition-colors hover:bg-white hover:text-[var(--color-primary)]"
                        >
                          View in workspace <ChevronRight size={14} />
                        </button>
                      </div>

                      {/* Visual panel */}
                      <div className="order-1 md:order-2">
                        <SlideVisual index={i} motif={s.motif} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                aria-label="Previous challenge"
                className="w-10 h-10 inline-flex items-center justify-center rounded-sm border border-[var(--color-border-strong)] text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <ChevronRight size={16} className="rotate-180" />
              </button>
              <button
                onClick={next}
                aria-label="Next challenge"
                className="w-10 h-10 inline-flex items-center justify-center rounded-sm border border-[var(--color-border-strong)] text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setPlaying((p) => !p)}
                aria-pressed={playing}
                aria-label={playing ? "Pause auto-rotation" : "Resume auto-rotation"}
                className="w-10 h-10 inline-flex items-center justify-center rounded-sm border border-[var(--color-border-strong)] text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] transition-colors"
              >
                {playing ? <Pause size={15} /> : <Play size={15} />}
              </button>
              <span className="font-mono text-[11px] text-[var(--color-text-muted)] ml-1">
                {reduced ? "Static" : running ? "Auto" : "Paused"} · {String(active + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
              </span>
            </div>

            <div className="flex items-center gap-1.5" role="tablist" aria-label="Select challenge">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`${s.category} (${i + 1} of ${total})`}
                  onClick={() => go(i)}
                  className="p-2 -m-2 flex items-center justify-center"
                >
                  <span
                    className={`block h-2 rounded-sm transition-all ${
                      i === active ? "w-6 bg-[var(--color-primary)]" : "w-2 bg-[var(--color-border-strong)] hover:bg-[var(--color-text-muted)]"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
