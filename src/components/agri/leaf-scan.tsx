// Illustrated crop compound leaf used as the Disease Doctor specimen.
// Lesion coordinates live in the same 800×500 space as the drawing, so detection
// boxes always sit exactly on the spots they describe.

export interface Lesion {
  x: number;
  y: number;
  r: number;
  label: string;
  // where the label sits relative to its box
  labelSide?: "top" | "bottom";
}

const LEAFLET = "M0 0C28-46 118-60 190 0 118 60 28 46 0 0Z";

// [x, y, rotation°, scale, yellowing 0–1]
const leaflets: [number, number, number, number, number][] = [
  [254, 374, -80, 0.8, 0.15],
  [380, 309, -75, 0.9, 0],
  [503, 235, -65, 0.95, 0],
  [254, 374, 40, 0.8, 0.55],
  [380, 309, 35, 0.9, 0.1],
  [503, 235, 25, 0.9, 0],
  [600, 170, -30, 1.1, 0],
];

function mix(a: number[], b: number[], t: number) {
  return `rgb(${a.map((v, i) => Math.round(v + (b[i]! - v) * t)).join(",")})`;
}

export function LeafScan({
  lesions,
  showBoxes,
  scanning,
  className,
}: {
  lesions: Lesion[];
  showBoxes: boolean;
  scanning: boolean;
  className?: string;
}) {
  const diseased = lesions.length > 0;
  return (
    <svg viewBox="0 0 800 500" className={className} role="img" aria-label="Crop leaf specimen">
      <defs>
        <radialGradient id="leafscan-bg" cx="0.5" cy="0.45" r="0.75">
          <stop offset="0" stopColor="#24432f" />
          <stop offset="1" stopColor="#0f2219" />
        </radialGradient>
        <radialGradient id="leafscan-lesion">
          <stop offset="0" stopColor="#3a2414" />
          <stop offset="0.55" stopColor="#5c3a1e" />
          <stop offset="0.8" stopColor="#7a5226" />
          <stop offset="1" stopColor="#c9b04a" stopOpacity="0.9" />
        </radialGradient>
      </defs>

      <rect width="800" height="500" fill="url(#leafscan-bg)" />
      {[
        [90, 80, 60],
        [720, 420, 80],
        [140, 470, 50],
        [700, 60, 40],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#ffffff" opacity="0.03" />
      ))}

      {/* stem */}
      <path
        d="M100 440Q360 340 600 170"
        stroke="#3f6b2e"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />

      {leaflets.map(([x, y, rot, s, yellow], i) => {
        const fill = mix([79, 138, 58], [196, 176, 74], diseased ? yellow : 0);
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
            <path d={LEAFLET} fill={fill} stroke="#2f5a25" strokeWidth="2" />
            <path d="M4 0H182" stroke="#a9cf78" strokeOpacity="0.55" strokeWidth="2.5" />
            {[40, 75, 110, 145].map((d) => (
              <g key={d} stroke="#a9cf78" strokeOpacity="0.35" strokeWidth="1.5" fill="none">
                <path d={`M${d} 0Q${d + 14} -14 ${d + 26} -30`} />
                <path d={`M${d} 0Q${d + 14} 14 ${d + 26} 30`} />
              </g>
            ))}
          </g>
        );
      })}

      {/* lesions: dark core, concentric rings, yellow halo */}
      {lesions.map((l) => (
        <g key={l.label}>
          <circle cx={l.x} cy={l.y} r={l.r * 1.45} fill="#d8c55a" opacity="0.45" />
          <circle cx={l.x} cy={l.y} r={l.r} fill="url(#leafscan-lesion)" />
          <circle
            cx={l.x}
            cy={l.y}
            r={l.r * 0.66}
            fill="none"
            stroke="#2b190c"
            strokeWidth="1.4"
            opacity="0.7"
          />
          <circle
            cx={l.x}
            cy={l.y}
            r={l.r * 0.36}
            fill="none"
            stroke="#2b190c"
            strokeWidth="1.2"
            opacity="0.7"
          />
        </g>
      ))}

      {showBoxes &&
        lesions.map((l) => {
          const half = l.r * 1.8;
          const w = l.label.length * 9.2 + 20;
          const below = l.labelSide === "bottom";
          const lx = Math.min(l.x - half, 800 - w - 6);
          const ly = below ? l.y + half + 4 : l.y - half - 32;
          return (
            <g key={`box-${l.label}`}>
              <rect
                x={l.x - half}
                y={l.y - half}
                width={half * 2}
                height={half * 2}
                rx="8"
                fill="rgba(239,107,77,0.12)"
                stroke="#ef6b4d"
                strokeWidth="2.5"
              />
              <rect x={lx} y={ly} width={w} height="28" rx="7" fill="#ef6b4d" />
              <text
                x={lx + 10}
                y={ly + 19.5}
                fill="#fff"
                fontSize="16"
                fontWeight="600"
                fontFamily="DM Sans, sans-serif"
              >
                {l.label}
              </text>
            </g>
          );
        })}

      {scanning && (
        <rect x="0" width="800" height="4" fill="#cde27f" opacity="0.85">
          <animate attributeName="y" values="0;496;0" dur="1.8s" repeatCount="indefinite" />
        </rect>
      )}
    </svg>
  );
}
