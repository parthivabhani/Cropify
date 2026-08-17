import { useState } from "react";
import { zones, type Zone } from "@/lib/agri-data";
import { cn } from "@/lib/utils";
import { Chip, Meter } from "./primitives";

const stateStyle: Record<Zone["state"], { fill: string; ring: string; label: string; tone: "healthy" | "warning" | "critical" | "water" }> = {
  healthy: { fill: "bg-healthy/15", ring: "border-healthy/45", label: "Healthy", tone: "healthy" },
  stress: { fill: "bg-warning/15", ring: "border-warning/50", label: "Stress", tone: "warning" },
  disease: { fill: "bg-critical/15", ring: "border-critical/55", label: "Disease", tone: "critical" },
  irrigation: { fill: "bg-water/15", ring: "border-water/50", label: "Irrigation", tone: "water" },
};

function CropRows({ state }: { state: Zone["state"] }) {
  const color =
    state === "disease"
      ? "bg-critical/45"
      : state === "stress"
        ? "bg-warning/45"
        : state === "irrigation"
          ? "bg-water/45"
          : "bg-healthy/45";
  return (
    <div className="pointer-events-none absolute inset-2 flex flex-col justify-between opacity-70">
      {Array.from({ length: 6 }).map((_, r) => (
        <div key={r} className="flex justify-between">
          {Array.from({ length: 10 }).map((__, c) => (
            <span
              key={c}
              className={cn("size-1 rounded-full", color)}
              style={{ animation: `pulse-soft ${3 + ((r + c) % 4) * 0.6}s ease-in-out ${(r + c) * 0.08}s infinite` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function FieldMap({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<Zone | null>(zones[2] ?? null);

  return (
    <div className={cn("grid gap-5", compact ? "" : "lg:grid-cols-[1.6fr_1fr]")}>
      <div className="panel relative overflow-hidden p-4">
        <div
          className="relative w-full overflow-hidden rounded-lg border border-border/70"
          style={{
            aspectRatio: "16 / 10",
            backgroundImage:
              "linear-gradient(180deg, oklch(0.27 0.05 150 / 0.7), oklch(0.21 0.04 155 / 0.9)), repeating-linear-gradient(90deg, oklch(1 0 0 / 0.04) 0 1px, transparent 1px 28px), repeating-linear-gradient(0deg, oklch(1 0 0 / 0.04) 0 1px, transparent 1px 28px)",
          }}
        >
          {zones.map((z) => {
            const s = stateStyle[z.state];
            const active = selected?.id === z.id;
            return (
              <button
                key={z.id}
                onClick={() => setSelected(z)}
                className={cn(
                  "absolute rounded-md border text-left transition-all duration-300 hover:scale-[1.02]",
                  s.fill,
                  s.ring,
                  active && "ring-2 ring-primary/70",
                )}
                style={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}
              >
                <CropRows state={z.state} />
                <span className="absolute top-1.5 left-2 font-mono text-[0.6rem] tracking-wider text-foreground/80">
                  {z.label}
                </span>
                <span className="absolute right-2 bottom-1.5 metric text-sm">{z.health}</span>
              </button>
            );
          })}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/70 to-transparent" />
          <span className="glass absolute right-3 bottom-3 rounded-md px-2.5 py-1 font-mono text-[0.6rem] tracking-wider">
            WEATHER OVERLAY · 27°C · RH 91%
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.keys(stateStyle) as Zone["state"][]).map((k) => (
            <Chip key={k} tone={stateStyle[k].tone}>
              {stateStyle[k].label} zones
            </Chip>
          ))}
        </div>
      </div>

      <div className="panel p-5">
        {selected ? (
          <div className="animate-rise">
            <p className="label-eyebrow">Zone inspector</p>
            <h3 className="mt-1 text-xl font-semibold">{selected.label}</h3>
            <Chip tone={stateStyle[selected.state].tone} className="mt-2">
              {stateStyle[selected.state].label}
            </Chip>
            <div className="mt-5 space-y-3">
              <Meter label="Zone health" value={selected.health} tone="healthy" />
              <Meter label="Soil moisture" value={selected.moisture} tone="water" />
              <Meter
                label="Disease probability"
                value={selected.diseaseProb}
                tone={selected.diseaseProb > 50 ? "critical" : "warning"}
              />
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="label-eyebrow">Soil condition</dt>
                <dd className="mt-1">{selected.soil}</dd>
              </div>
              <div>
                <dt className="label-eyebrow">Crop condition</dt>
                <dd className="mt-1 text-muted-foreground">{selected.condition}</dd>
              </div>
              <div>
                <dt className="label-eyebrow">Recommended action</dt>
                <dd className="mt-1">{selected.action}</dd>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <dt className="label-eyebrow">Reasoning</dt>
                <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {selected.reasoning}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Select a field zone to inspect it.</p>
        )}
      </div>
    </div>
  );
}
