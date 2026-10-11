// Ontology graph drawn as one scalable SVG: solid node cards, curved edges that stop at
// the card border, and relation labels on the edges of the selected node.
import type { KeyboardEvent } from "react";
import type { GraphNode } from "@/lib/agri-data";
import { tr } from "@/lib/i18n";

type Edge = { from: string; to: string; rel: string; farmer?: boolean };

const W = 1000;
const H = 600;
const NODE_H = 52;

const kindColor: Record<GraphNode["kind"], string> = {
  crop: "var(--healthy)",
  disease: "var(--critical)",
  symptom: "var(--warning)",
  weather: "var(--water)",
  soil: "var(--soil)",
  treatment: "var(--primary)",
  stage: "var(--symbolic)",
  farmer: "var(--neural)",
  pest: "var(--destructive)",
};

const nodeWidth = (label: string) => Math.max(110, label.length * 8.2 + 36);

// Point where the segment from the box centre towards (tx, ty) leaves the box.
function exitPoint(cx: number, cy: number, w: number, h: number, tx: number, ty: number) {
  const dx = tx - cx;
  const dy = ty - cy;
  const scale = 1 / Math.max(Math.abs(dx) / (w / 2 + 6), Math.abs(dy) / (h / 2 + 6), 1e-6);
  return { x: cx + dx * scale, y: cy + dy * scale };
}

export function KnowledgeGraphCanvas({
  nodes,
  edges,
  selectedId,
  connectedIds,
  onSelect,
}: {
  nodes: GraphNode[];
  edges: Edge[];
  selectedId: string | null;
  connectedIds: Set<string>;
  onSelect: (node: GraphNode) => void;
}) {
  const pos = new Map(
    nodes.map((n) => {
      const label = tr(n.label);
      return [n.id, { x: (n.x / 100) * W, y: (n.y / 100) * H, w: nodeWidth(label), label }];
    }),
  );

  const onKey = (e: KeyboardEvent, node: GraphNode) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(node);
    }
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="block h-auto w-full select-none"
      role="group"
      aria-label={tr("Ontology Web Map")}
    >
      <defs>
        <pattern id="kg-dots" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="var(--border)" />
        </pattern>
        {(["idle", "hot", "farmer"] as const).map((k) => (
          <marker
            key={k}
            id={`kg-arrow-${k}`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path
              d="M0 0L10 5L0 10z"
              fill={
                k === "hot"
                  ? "var(--primary)"
                  : k === "farmer"
                    ? "var(--neural)"
                    : "var(--muted-foreground)"
              }
            />
          </marker>
        ))}
      </defs>

      <rect width={W} height={H} fill="url(#kg-dots)" />

      {/* edges */}
      {edges.map((edge) => {
        const a = pos.get(edge.from);
        const b = pos.get(edge.to);
        if (!a || !b) return null;
        const hot = selectedId !== null && (edge.from === selectedId || edge.to === selectedId);
        const dim = selectedId !== null && !hot;

        const start = exitPoint(a.x, a.y, a.w, NODE_H, b.x, b.y);
        const end = exitPoint(b.x, b.y, b.w, NODE_H, a.x, a.y);
        // gentle curve: control point pushed sideways from the midpoint
        const mx = (start.x + end.x) / 2;
        const my = (start.y + end.y) / 2;
        const len = Math.hypot(end.x - start.x, end.y - start.y) || 1;
        const bend = Math.min(40, len * 0.12);
        const cx = mx - ((end.y - start.y) / len) * bend;
        const cy = my + ((end.x - start.x) / len) * bend;
        const color = hot
          ? edge.farmer
            ? "var(--neural)"
            : "var(--primary)"
          : "var(--muted-foreground)";
        const rel = tr(edge.rel).replace(/_/g, " ");
        // label sits on the curve's midpoint (t = 0.5 of the quadratic)
        const lx = 0.25 * start.x + 0.5 * cx + 0.25 * end.x;
        const ly = 0.25 * start.y + 0.5 * cy + 0.25 * end.y;

        return (
          <g key={`${edge.from}-${edge.to}-${edge.rel}`} opacity={dim ? 0.18 : hot ? 1 : 0.55}>
            <path
              d={`M${start.x} ${start.y}Q${cx} ${cy} ${end.x} ${end.y}`}
              fill="none"
              stroke={color}
              strokeWidth={hot ? 2.2 : 1.4}
              strokeDasharray={edge.farmer ? "6 5" : undefined}
              markerEnd={`url(#kg-arrow-${hot ? (edge.farmer ? "farmer" : "hot") : "idle"})`}
            />
            {hot && (
              <g transform={`translate(${lx} ${ly})`}>
                <rect
                  x={-(rel.length * 6.4 + 16) / 2}
                  y={-11}
                  width={rel.length * 6.4 + 16}
                  height={22}
                  rx={11}
                  fill="var(--card)"
                  stroke={color}
                  strokeOpacity={0.5}
                />
                <text
                  textAnchor="middle"
                  dy="4"
                  fontSize="11.5"
                  fill="var(--foreground)"
                  fontFamily="var(--font-sans)"
                >
                  {rel}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* nodes */}
      {nodes.map((node) => {
        const p = pos.get(node.id)!;
        const color = kindColor[node.kind];
        const selected = node.id === selectedId;
        const dim = selectedId !== null && !connectedIds.has(node.id);
        return (
          <g
            key={node.id}
            transform={`translate(${p.x - p.w / 2} ${p.y - NODE_H / 2})`}
            opacity={dim ? 0.35 : 1}
            role="button"
            tabIndex={0}
            aria-pressed={selected}
            aria-label={`${p.label} (${tr(node.kind)})`}
            onClick={() => onSelect(node)}
            onKeyDown={(e) => onKey(e, node)}
            className="cursor-pointer outline-none [&:focus-visible>rect:first-child]:stroke-[3]"
            style={{ transition: "opacity 200ms" }}
          >
            {selected && (
              <rect
                x={-5}
                y={-5}
                width={p.w + 10}
                height={NODE_H + 10}
                rx={18}
                fill="none"
                stroke={color}
                strokeOpacity={0.35}
                strokeWidth={4}
              />
            )}
            <rect
              width={p.w}
              height={NODE_H}
              rx={14}
              fill="var(--card)"
              stroke={color}
              strokeWidth={selected ? 2 : 1.2}
            />
            <rect
              width={p.w}
              height={NODE_H}
              rx={14}
              fill={color}
              opacity={selected ? 0.16 : 0.08}
            />
            <circle cx={16} cy={NODE_H / 2} r={4.5} fill={color} />
            <text
              x={30}
              y={22}
              fontSize="14"
              fontWeight={600}
              fill="var(--foreground)"
              fontFamily="var(--font-display)"
            >
              {p.label}
            </text>
            <text
              x={30}
              y={39}
              fontSize="11"
              fill="var(--muted-foreground)"
              fontFamily="var(--font-sans)"
              style={{ textTransform: "capitalize" }}
            >
              {tr(node.kind)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function KnowledgeGraphLegend() {
  return (
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
      {(Object.keys(kindColor) as GraphNode["kind"][]).map((kind) => (
        <span key={kind} className="flex items-center gap-1.5 capitalize">
          <span className="size-2 rounded-full" style={{ background: kindColor[kind] }} />
          {tr(kind)}
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <svg width="22" height="6" aria-hidden="true">
          <line
            x1="0"
            y1="3"
            x2="22"
            y2="3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        </svg>
        {tr("Farmer-derived observations")}
      </span>
    </div>
  );
}
