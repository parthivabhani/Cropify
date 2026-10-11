import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Provenance } from "@/lib/agri-data";
import { tr } from "@/lib/i18n";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-10 flex flex-col gap-5 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
      <div className="animate-rise">
        {eyebrow ? (
          <p className="label-eyebrow mb-3 flex items-center gap-2">
            <span className="h-px w-6 bg-lime" />
            {tr(eyebrow)}
          </p>
        ) : null}
        <h1 className="font-display text-4xl font-medium tracking-tight md:text-5xl">
          {tr(title)}
        </h1>
        {subtitle ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {tr(subtitle)}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{tr(actions)}</div> : null}
    </header>
  );
}

export function Panel({
  children,
  className,
  title,
  eyebrow,
  aside,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  eyebrow?: string;
  aside?: ReactNode;
}) {
  return (
    <section className={cn("panel p-5 md:p-6", className)}>
      {(title || aside) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {eyebrow ? <p className="label-eyebrow mb-1">{tr(eyebrow)}</p> : null}
            {title ? <h2 className="text-lg font-medium">{tr(title)}</h2> : null}
          </div>
          {tr(aside)}
        </div>
      )}
      {children}
    </section>
  );
}

const toneMap = {
  healthy: "text-healthy border-healthy/35 bg-healthy/10",
  warning: "text-warning border-warning/35 bg-warning/10",
  critical: "text-critical border-critical/35 bg-critical/10",
  water: "text-water border-water/35 bg-water/10",
  neural: "text-neural border-neural/35 bg-neural/10",
  symbolic: "text-symbolic border-symbolic/35 bg-symbolic/10",
  muted: "text-muted-foreground border-border bg-muted/40",
} as const;

export type Tone = keyof typeof toneMap;

export function Chip({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.72rem] font-medium",
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const sourceTone: Record<Provenance, Tone> = {
  "Farmer Interview": "symbolic",
  "Weather API": "water",
  "Soil Database": "muted",
  "ML Model": "neural",
  "Agricultural Rule": "healthy",
  "Research Literature": "muted",
  "Data from Field Sources": "healthy",
  "Field Observation": "muted",
};

export function SourceBadge({ source }: { source: Provenance }) {
  return (
    <Chip tone={sourceTone[source]} className="normal-case">
      {tr("Source:")} {tr(source)}
    </Chip>
  );
}

export function Stat({
  label,
  value,
  unit,
  hint,
  tone = "healthy",
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  tone?: Tone;
}) {
  return (
    <div className="panel group p-5 transition-colors hover:border-lime">
      <p className="label-eyebrow">{tr(label)}</p>
      <p className="metric mt-3 text-3xl font-light md:text-4xl">
        <span className={cn(tone === "muted" ? "" : toneMap[tone].split(" ")[0])}>{tr(value)}</span>
        {unit ? <span className="ml-1 text-base text-muted-foreground">{tr(unit)}</span> : null}
      </p>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{tr(hint)}</p> : null}
    </div>
  );
}

export function Meter({
  label,
  value,
  tone = "healthy",
  suffix = "%",
}: {
  label: string;
  value: number;
  tone?: Tone;
  suffix?: string;
}) {
  const bar = {
    healthy: "bg-healthy",
    warning: "bg-warning",
    critical: "bg-critical",
    water: "bg-water",
    neural: "bg-neural",
    symbolic: "bg-symbolic",
    muted: "bg-muted-foreground",
  }[tone];
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{tr(label)}</span>
        <span className="metric text-foreground">
          {tr(value)}
          {tr(suffix)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700", bar)}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

export function Disclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      {tr(
        "AI recommendations are decision-support insights and should be confirmed against local agricultural agronomist guidance before real-world application. Telemetry and metrics are derived from field sensors and calibrated data sources.",
      )}
    </p>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="panel flex flex-col items-center justify-center gap-3 border-dashed p-10 text-center">
      <h3 className="text-base font-semibold">{tr(title)}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{tr(body)}</p>
      {tr(action)}
    </div>
  );
}
