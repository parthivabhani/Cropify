// Flat, grainy illustrations for the landing page (Carbonex / Enjoy Nature style).
// Drawn in SVG so the landing page never depends on field photographs.

/** Tomato valley at dawn, drawn into a 640×640 box. Render inside an <svg>. */
export function HeroLandscape() {
  // crop rows converge on a vanishing point on the far edge of the field
  const vx = 330;
  const vy = 430;
  const rows = Array.from({ length: 15 }, (_, i) => -420 + i * 105);
  const plants: [number, number, number][] = [];
  rows.forEach((bx, ri) => {
    for (let k = 1; k <= 5; k++) {
      const t = k / 5.4;
      const x = vx + (bx - vx) * t;
      const y = vy + (680 - vy) * t;
      if (x > -20 && x < 660 && ri % 2 === 0) plants.push([x, y, 4 + t * 16]);
    }
  });

  return (
    <g>
      <defs>
        <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0c9b5" />
          <stop offset="0.6" stopColor="#f7e3d2" />
          <stop offset="1" stopColor="#f6efe2" />
        </linearGradient>
        <filter id="ls-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>

      <rect width="640" height="640" fill="url(#ls-sky)" />
      <circle cx="455" cy="175" r="48" fill="#fbe9cf" />
      <path
        d="M40 150h120M70 168h90M420 110h150M450 126h90"
        stroke="#fbf1e6"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* far mountains — lavender, with lit facets */}
      <path d="M0 300 90 205l60 45 95-100 85 95 65-60 85 75 75-80 100 75v345H0Z" fill="#8c84b3" />
      <path
        d="M90 205l25 70-65 25ZM245 150l-25 95 70-10ZM395 190l-15 70 55-10ZM555 180l-10 80 55-20Z"
        fill="#a8a0cc"
      />
      <path
        d="M0 300 90 205l60 45 95-100 85 95 65-60 85 75 75-80 100 75v30H0Z"
        fill="#7a72a3"
        opacity="0.35"
      />

      {/* rolling hills */}
      <path d="M0 330c120-55 230-30 330-10s200-35 310-20v340H0Z" fill="#6c9a3a" />
      <path d="M0 370c150-40 300-25 420 0s170-30 220-25v315H0Z" fill="#89b23f" />
      {[
        [60, 336, 18],
        [92, 330, 24],
        [128, 338, 16],
        [520, 322, 20],
        [552, 316, 26],
        [585, 326, 18],
      ].map(([x, y, r]) => (
        <g key={`${x}-${y}`}>
          <rect x={x! - 2} y={y} width="4" height={r! * 0.8} fill="#2d4a22" />
          <circle cx={x} cy={y} r={r} fill="#3d6b2c" />
          <circle cx={x! - r! * 0.3} cy={y! - r! * 0.3} r={r! * 0.45} fill="#4f8236" />
        </g>
      ))}

      {/* tomato field */}
      <path d="M0 420c200-22 430-18 640 0v220H0Z" fill="#3c7a33" />
      {rows.map((bx, i) => (
        <path
          key={bx}
          d={`M${vx} ${vy}L${bx - 26} 680L${bx + 26} 680Z`}
          fill={i % 2 ? "#336c2c" : "#4a8a3a"}
        />
      ))}
      {plants.map(([x, y, s]) => (
        <g key={`${x.toFixed(1)}-${y.toFixed(1)}`}>
          <circle cx={x} cy={y - s * 0.4} r={s * 0.75} fill="#2a5a25" />
          <circle cx={x - s * 0.25} cy={y - s * 0.6} r={s * 0.4} fill="#4f8f3a" />
          {s > 9 && (
            <>
              <circle cx={x + s * 0.35} cy={y - s * 0.15} r={s * 0.2} fill="#de5a35" />
              <circle cx={x - s * 0.3} cy={y} r={s * 0.17} fill="#e8743f" />
            </>
          )}
        </g>
      ))}

      {/* soil probe with signal arcs */}
      <g transform="translate(470 470)">
        <rect x="-3" y="20" width="6" height="90" rx="2" fill="#3b3550" />
        <rect x="-16" y="-6" width="32" height="30" rx="7" fill="#f4f1e8" />
        <rect x="-10" y="2" width="20" height="8" rx="2" fill="#b4d23f" />
        <circle cx="0" cy="16" r="2.5" fill="#12352a" />
        <g fill="none" stroke="#f4f1e8" strokeWidth="4" strokeLinecap="round">
          <path d="M22-14a28 28 0 0 1 0 40" opacity="0.9" />
          <path d="M32-26a44 44 0 0 1 0 64" opacity="0.6" />
          <path d="M-22-14a28 28 0 0 0 0 40" opacity="0.9" />
          <path d="M-32-26a44 44 0 0 0 0 64" opacity="0.6" />
        </g>
      </g>

      <rect width="640" height="640" filter="url(#ls-grain)" opacity="0.55" />
    </g>
  );
}

/** Tall pill illustration: the 7-in-1 probe in a soil cross-section with readings. */
export function ProbeCrossSection({ className }: { className?: string }) {
  const readings = ["Moisture", "Temp", "pH", "EC", "N", "P", "K"];
  return (
    <svg
      viewBox="0 0 220 340"
      className={className}
      role="img"
      aria-label="Soil probe in a soil cross-section"
    >
      <rect width="220" height="340" fill="#f0c9b5" />
      <circle cx="160" cy="50" r="22" fill="#fbe9cf" />
      <path d="M0 110c40-14 70-6 110 0s80-12 110-4v234H0Z" fill="#89b23f" />
      <path d="M0 128c60-8 140-8 220 0v212H0Z" fill="#6b4a2f" />
      <path d="M0 200c60-6 140-4 220 2v138H0Z" fill="#5a3d26" />
      <path d="M0 270c70-4 150-2 220 4v66H0Z" fill="#48301e" />
      {[
        [30, 160],
        [180, 230],
        [60, 300],
        [150, 170],
        [40, 240],
      ].map(([x, y]) => (
        <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="7" ry="4" fill="#7f5c3d" />
      ))}
      {/* plant */}
      <path d="M70 118V70" stroke="#2f5a25" strokeWidth="4" />
      <path d="M70 92c-18-2-28-14-28-28 16 0 26 10 28 28Z" fill="#4f8f3a" />
      <path d="M70 80c16-4 26-16 26-30-16 2-24 14-26 30Z" fill="#3c7a33" />
      <circle cx="78" cy="98" r="7" fill="#de5a35" />
      <path
        d="M70 128c-6 20-20 30-26 52M70 128c4 22 14 30 12 56"
        stroke="#c9a77a"
        strokeWidth="2"
        fill="none"
      />
      {/* probe */}
      <rect x="128" y="64" width="34" height="34" rx="8" fill="#f4f1e8" />
      <rect x="135" y="72" width="20" height="8" rx="2" fill="#b4d23f" />
      <path
        d="M137 98v150M145 98v160M153 98v150"
        stroke="#cfd3d6"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {readings.map((r, i) => (
        <g key={r} transform={`translate(${i % 2 ? 168 : 12} ${148 + i * 22})`}>
          <rect width="40" height="16" rx="8" fill="#f4f1e8" opacity="0.92" />
          <text
            x="20"
            y="11.5"
            textAnchor="middle"
            fontSize="8.5"
            fontWeight="600"
            fill="#12352a"
            fontFamily="DM Sans, sans-serif"
          >
            {r}
          </text>
        </g>
      ))}
    </svg>
  );
}
