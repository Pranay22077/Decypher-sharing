// State Emblem of India for the masthead.
//
// Primary: renders the official colour emblem raster at /emblem.png (place the
// file in the project's public/ folder — see note below).
// Fallback: if that file is absent, an inline, simplified line rendering of the
// Lion Capital of Ashoka is drawn in currentColor so the masthead never breaks.
//
// To use your own emblem image: save it as
//   AI-Powered Crime Network Analysis/public/emblem.png
// and it is served at /emblem.png automatically (no rebuild needed in dev).

import { useState } from "react";

interface Props {
  size?: number;      // rendered height in px
  motto?: boolean;    // show "सत्यमेव जयते" beneath the inline fallback capital
  className?: string;
  title?: string;
  src?: string;       // override the raster source if stored under another name
}

export default function StateEmblem({
  size = 44,
  motto = false,
  className,
  title = "State Emblem of India",
  src = "/emblem.png",
}: Props) {
  const [rasterOk, setRasterOk] = useState(true);
  const spokes = Array.from({ length: 24 });

  // Preferred path: the real colour emblem image.
  if (rasterOk) {
    return (
      <img
        src={src}
        alt={title}
        title={title}
        onError={() => setRasterOk(false)}
        // The official emblem PNG carries a near-white (#f6f6f6) baked background.
        // "darken" blends that square into the lighter institutional bar behind it
        // (min() keeps every darker mark — the three lions, chakra and outlines —
        // intact) so the emblem reads as placed directly on the masthead, no box.
        style={{ height: size, width: "auto", display: "block", mixBlendMode: "darken" }}
        className={className}
      />
    );
  }

  // Fallback: inline silhouette (renders only if the raster is missing).
  const vbH = motto ? 132 : 110;
  return (
    <svg
      height={size}
      viewBox={`0 0 120 ${vbH}`}
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g fill="currentColor">
        {/* Three lions (crown) — symmetric silhouette suggesting manes and heads */}
        <path d="M60 12c-4 0-7 2-9 5-3-1-7 0-9 3-2-3-6-4-9-3-4 1-6 5-5 9-3 1-5 4-5 7 0 4 3 7 7 7h60c4 0 7-3 7-7 0-3-2-6-5-7 1-4-1-8-5-9-3-1-7 0-9 3-2-3-6-4-9-3-2-3-5-5-9-5z" />
        {/* Necks tapering to the abacus */}
        <path d="M46 52h28l-3 10H49z" />
        {/* Abacus platform */}
        <rect x="28" y="62" width="64" height="15" rx="1" />
        {/* Lower molding */}
        <rect x="33" y="79" width="54" height="3" rx="1" />
        {/* Bell-shaped lotus base */}
        <path d="M45 83c-4 8 0 15 15 19 15-4 19-11 15-19z" />
      </g>

      {/* Ashoka Chakra on the abacus face — 24 spokes */}
      <g stroke="var(--color-surface, #ffffff)" strokeWidth="0.9">
        <circle cx="60" cy="69.5" r="6.4" fill="none" />
        {spokes.map((_, i) => {
          const a = (i * 15 * Math.PI) / 180;
          return (
            <line key={i} x1="60" y1="69.5" x2={60 + 6.4 * Math.cos(a)} y2={69.5 + 6.4 * Math.sin(a)} />
          );
        })}
        <circle cx="60" cy="69.5" r="1.1" fill="var(--color-surface, #ffffff)" stroke="none" />
      </g>

      {motto && (
        <text
          x="60"
          y="122"
          textAnchor="middle"
          fill="currentColor"
          style={{ fontFamily: "var(--font-serif, Georgia, serif)", fontSize: "15px", letterSpacing: "0.02em" }}
        >
          सत्यमेव जयते
        </text>
      )}
    </svg>
  );
}
