import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Provenance } from "@/lib/agri-data";

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
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="animate-rise">
        {eyebrow ? <p className="label-eyebrow mb-2">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
        {subtitle ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
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
            {eyebrow ? <p className="label-eyebrow mb-1">{eyebrow}</p> : null}
            {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
          </div>
          {aside}
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.68rem] tracking-wide uppercase",
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
      Source: {source}
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
    <div className="panel group p-5 transition-colors hover:border-primary/40">
      <p className="label-eyebrow">{label}</p>
      <p className="metric mt-2 text-3xl md:text-4xl">
        <span className={cn(tone === "muted" ? "" : toneMap[tone].split(" ")[0])}>{value}</span>
        {unit ? <span className="ml-1 text-base text-muted-foreground">{unit}</span> : null}
      </p>
      {hint ? <p className="mt-2 text-xs text-muted-foreground">{hint}</p> : null}
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
        <span className="text-muted-foreground">{label}</span>
        <span className="metric text-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
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
      AI recommendations are decision-support insights and should be confirmed against local
      agricultural agronomist guidance before real-world application. Telemetry and metrics are derived
      from field sensors and calibrated data sources.
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
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{body}</p>
      {action}
    </div>
  );
}
