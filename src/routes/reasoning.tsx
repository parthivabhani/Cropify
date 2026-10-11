import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, Play, Ban, RotateCcw, Loader2 } from "lucide-react";
import { PageHeader, Panel, Chip, Disclaimer, type Tone } from "@/components/agri/primitives";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  runReasoning,
  scenarioPresets,
  diseaseLabel,
  type FieldInputs,
  type DiseaseClass,
  type LesionPattern,
  type SoilMoisture,
  type ReasoningResult,
  type TraceStep,
} from "@/lib/reasoning-engine";
import { tr } from "@/lib/i18n";

export const Route = createFileRoute("/reasoning")({
  head: () => ({
    meta: [
      { title: "Reasoning Engine — Cropify" },
      {
        name: "description",
        content:
          "Run the neuro-symbolic decision pipeline on field conditions and inspect every step.",
      },
    ],
  }),
  component: Reasoning,
});

const layerTone: Record<TraceStep["layer"], Tone> = {
  Neural: "neural",
  Context: "water",
  Knowledge: "symbolic",
  Rules: "healthy",
  Reasoning: "warning",
  Decision: "critical",
};

const classOrder: DiseaseClass[] = ["earlyBlight", "lateBlight", "septoria", "healthy"];
const STEP_MS = 450;

function Field({
  label,
  value,
  children,
}: {
  label: string;
  value?: ReactNode;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{tr(label)}</span>
        {value !== undefined && <span className="metric text-foreground">{tr(value)}</span>}
      </span>
      {children}
    </label>
  );
}

function Range(props: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <input
      type="range"
      min={props.min}
      max={props.max}
      value={props.value}
      onChange={(e) => props.onChange(Number(e.target.value))}
      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--primary)]"
    />
  );
}

function Reasoning() {
  const [presetId, setPresetId] = useState(scenarioPresets[0]!.id);
  const [inputs, setInputs] = useState<FieldInputs>(scenarioPresets[0]!.inputs);
  const [result, setResult] = useState<ReasoningResult | null>(null);
  const [ranWith, setRanWith] = useState<FieldInputs | null>(null);
  const [revealed, setRevealed] = useState(0);

  const set = <K extends keyof FieldInputs>(key: K, value: FieldInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const running = result !== null && revealed < result.trace.length;
  const done = result !== null && revealed >= result.trace.length;
  const stale = done && ranWith !== inputs;

  const run = () => {
    setResult(runReasoning(inputs));
    setRanWith(inputs);
    setRevealed(0);
  };

  useEffect(() => {
    if (!result || revealed >= result.trace.length) return;
    const t = setTimeout(() => setRevealed((r) => r + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [result, revealed]);

  const loadPreset = (id: string) => {
    const p = scenarioPresets.find((s) => s.id === id);
    if (!p) return;
    setPresetId(id);
    setInputs(p.inputs);
  };

  const preset = useMemo(() => scenarioPresets.find((p) => p.id === presetId), [presetId]);
  const decision = result?.decision;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={tr("Neuro-symbolic reasoning")}
        title={tr("Reasoning Engine")}
        subtitle={tr(
          "The vision model makes a guess; agronomy rules re-weight it with field conditions and veto unsafe actions. Set the conditions, run it, and see exactly why it decided what it did.",
        )}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* ── Inputs ─────────────────────────────── */}
        <Panel
          eyebrow={tr("Step 1")}
          title={tr("Field conditions")}
          className="h-fit lg:sticky lg:top-6"
        >
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">{tr("Start from a scenario")}</p>
              <div className="flex flex-wrap gap-2">
                {scenarioPresets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => loadPreset(p.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                      presetId === p.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-accent",
                    )}
                  >
                    {tr(p.label)}
                  </button>
                ))}
              </div>
              {preset && <p className="mt-2 text-xs text-muted-foreground">{tr(preset.note)}</p>}
            </div>

            <div className="space-y-2 rounded-2xl bg-muted/60 p-4">
              <p className="label-eyebrow">{tr("Classifier output (from leaf scan)")}</p>
              {classOrder.map((c) => (
                <div key={c} className="flex items-center gap-3 text-xs">
                  <span className="w-24 shrink-0 text-muted-foreground">
                    {tr(diseaseLabel[c].split(" (")[0])}
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-background">
                    <span
                      className="block h-full rounded-full bg-neural"
                      style={{ width: `${inputs.neural[c] * 100}%` }}
                    />
                  </span>
                  <span className="metric w-9 text-right">
                    {Math.round(inputs.neural[c] * 100)}%
                  </span>
                </div>
              ))}
            </div>

            <Field label={tr("Lesion pattern")}>
              <select
                value={inputs.lesionPattern}
                onChange={(e) => set("lesionPattern", e.target.value as LesionPattern)}
                className="h-10 w-full rounded-full border border-input bg-background px-4 text-sm"
              >
                <option value="concentric-brown">{tr("Brown with concentric rings")}</option>
                <option value="water-soaked">{tr("Water-soaked margins")}</option>
                <option value="small-grey-spots">{tr("Small grey-centred spots")}</option>
                <option value="none">{tr("No lesions")}</option>
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label={tr("Lesions found")}>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={inputs.lesionCount}
                  onChange={(e) => set("lesionCount", Math.max(0, Number(e.target.value)))}
                  className="h-10 w-full rounded-full border border-input bg-background px-4 text-sm"
                />
              </Field>
              <Field label={tr("Soil moisture")}>
                <select
                  value={inputs.soilMoisture}
                  onChange={(e) => set("soilMoisture", e.target.value as SoilMoisture)}
                  className="h-10 w-full rounded-full border border-input bg-background px-4 text-sm"
                >
                  <option value="LOW">{tr("Low")}</option>
                  <option value="OPTIMAL">{tr("Optimal")}</option>
                  <option value="HIGH">{tr("High")}</option>
                </select>
              </Field>
            </div>

            <Field label={tr("Humidity")} value={`${inputs.humidity}%`}>
              <Range
                value={inputs.humidity}
                min={30}
                max={100}
                onChange={(v) => set("humidity", v)}
              />
            </Field>
            <Field label={tr("Temperature")} value={`${inputs.temperature} °C`}>
              <Range
                value={inputs.temperature}
                min={8}
                max={40}
                onChange={(v) => set("temperature", v)}
              />
            </Field>
            <Field label={tr("Leaf wetness")} value={`${inputs.leafWetnessHours} h`}>
              <Range
                value={inputs.leafWetnessHours}
                min={0}
                max={24}
                onChange={(v) => set("leafWetnessHours", v)}
              />
            </Field>
            <Field label={tr("Rain chance, next 6 h")} value={`${inputs.rainNext6h}%`}>
              <Range
                value={inputs.rainNext6h}
                min={0}
                max={100}
                onChange={(v) => set("rainNext6h", v)}
              />
            </Field>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{tr("Rain in the last 48 h")}</span>
                <Switch
                  checked={inputs.rainLast48h}
                  onCheckedChange={(v) => set("rainLast48h", v)}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{tr("Farmer plans to spray")}</span>
                <Switch
                  checked={inputs.sprayPlanned}
                  onCheckedChange={(v) => set("sprayPlanned", v)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label={tr("Days since spray")}>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={inputs.daysSinceLastSpray}
                  onChange={(e) => set("daysSinceLastSpray", Math.max(0, Number(e.target.value)))}
                  className="h-10 w-full rounded-full border border-input bg-background px-4 text-sm"
                />
              </Field>
              <Field label={tr("N applied (kg/ac)")}>
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={inputs.appliedNitrogen}
                  onChange={(e) => set("appliedNitrogen", Math.max(0, Number(e.target.value)))}
                  className="h-10 w-full rounded-full border border-input bg-background px-4 text-sm"
                />
              </Field>
            </div>

            <Button onClick={run} disabled={running} size="lg" className="w-full">
              {running ? <Loader2 className="animate-spin" /> : done ? <RotateCcw /> : <Play />}
              {running ? tr("Reasoning…") : done ? tr("Run again") : tr("Run reasoning")}
            </Button>
          </div>
        </Panel>

        {/* ── Output ─────────────────────────────── */}
        <div className="space-y-6">
          {!result && (
            <div className="panel flex min-h-[420px] flex-col items-center justify-center gap-3 border-dashed p-10 text-center">
              <p className="font-display text-2xl font-medium">{tr("No run yet")}</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                {tr("Pick a scenario or adjust the conditions, then press")}{" "}
                <strong className="text-foreground">{tr("Run reasoning")}</strong>
                {tr(
                  ". You'll get a step-by-step trace, the rules that fired, and a decision with anything the rules blocked.",
                )}
              </p>
            </div>
          )}

          {stale && (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
              <span>{tr("Conditions changed since this run.")}</span>
              <Button size="sm" onClick={run}>
                <RotateCcw /> {tr("Re-run")}
              </Button>
            </div>
          )}

          {result && (
            <Panel eyebrow={tr("Step 2")} title={tr("Reasoning trace")}>
              <ol className="relative space-y-1 border-l border-border pl-6">
                {result.trace.map((step, i) => {
                  const shown = i < revealed;
                  const active = i === revealed && running;
                  return (
                    <li
                      key={step.title}
                      className={cn(
                        "relative rounded-2xl px-3 py-3 transition-all duration-300",
                        shown ? "opacity-100" : active ? "opacity-70" : "opacity-25",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-4 -left-[31px] flex size-4 items-center justify-center rounded-full border-2 bg-background",
                          shown ? "border-primary bg-primary" : "border-border",
                        )}
                      >
                        {active && (
                          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                        )}
                      </span>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Chip tone={layerTone[step.layer]}>{tr(step.layer)}</Chip>
                          <span className="font-medium">{tr(step.title)}</span>
                        </div>
                        <span className="metric text-sm">
                          {shown ? tr(step.result) : active ? "…" : ""}
                        </span>
                      </div>
                      {shown && (
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground animate-in fade-in-0">
                          {tr(step.detail)}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </Panel>
          )}

          {done && decision && (
            <div className="animate-rise space-y-6">
              <section className="overflow-hidden rounded-[1.75rem] bg-sidebar text-sidebar-foreground">
                <div className="grid gap-4 p-6 sm:p-8 xl:grid-cols-[1fr_auto]">
                  <div>
                    <p className="label-eyebrow !text-sidebar-foreground/60">
                      {tr("Step 3 · Decision")}
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-medium sm:text-3xl">
                      {tr(diseaseLabel[decision.diagnosis])}
                    </h2>
                    <p className="mt-1 text-sm text-sidebar-foreground/70">
                      {tr("Severity:")} {tr(decision.severity)} {tr("· classifier alone said")}{" "}
                      {Math.round(decision.neuralConfidence * 100)}%
                    </p>
                  </div>
                  <div className="xl:text-right">
                    <p className="font-display text-6xl font-light text-sidebar-primary">
                      {Math.round(decision.confidence * 100)}%
                    </p>
                    <p className="text-xs text-sidebar-foreground/60">{tr("final confidence")}</p>
                  </div>
                </div>
                <div className="space-y-2 border-t border-sidebar-border px-6 py-5 sm:px-8">
                  {classOrder.map((c) => (
                    <div key={c} className="flex items-center gap-3 text-xs">
                      <span className="w-28 shrink-0 text-sidebar-foreground/70">
                        {tr(diseaseLabel[c].split(" (")[0])}
                      </span>
                      <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-sidebar-accent">
                        <span
                          className="absolute inset-y-0 left-0 rounded-full bg-sidebar-foreground/25"
                          style={{ width: `${ranWith ? ranWith.neural[c] * 100 : 0}%` }}
                        />
                        <span
                          className="absolute inset-y-0 left-0 rounded-full bg-sidebar-primary transition-[width] duration-700"
                          style={{ width: `${result.posterior[c] * 100}%` }}
                        />
                      </span>
                      <span className="metric w-10 text-right">
                        {Math.round(result.posterior[c] * 100)}%
                      </span>
                    </div>
                  ))}
                  <p className="pt-1 text-[0.7rem] text-sidebar-foreground/50">
                    {tr("Lime = after rules · faint = classifier alone")}
                  </p>
                </div>
              </section>

              <div className="grid gap-6 md:grid-cols-2">
                <Panel title={tr("Do this")}>
                  <ol className="space-y-3 text-sm">
                    {decision.actions.map((a, i) => (
                      <li key={a} className="flex gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                          {i + 1}
                        </span>
                        <span className="pt-0.5">{tr(a)}</span>
                      </li>
                    ))}
                  </ol>
                </Panel>
                <Panel title={tr("Blocked by rules")}>
                  {decision.blocked.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      {tr("Nothing blocked — every proposed action passed the safety rules.")}
                    </p>
                  ) : (
                    <ul className="space-y-3 text-sm">
                      {decision.blocked.map((b) => (
                        <li
                          key={b.reason}
                          className="rounded-2xl border border-critical/30 bg-critical/5 p-3"
                        >
                          <p className="flex items-start gap-2 font-medium">
                            <Ban className="mt-0.5 size-4 shrink-0 text-critical" />
                            {tr(b.action)}
                          </p>
                          <p className="mt-1 pl-6 text-muted-foreground">{tr(b.reason)}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>
              </div>

              <Panel title={tr("Message to the farmer")} eyebrow={tr("Plain-language explanation")}>
                <p className="rounded-2xl bg-secondary px-5 py-4 text-secondary-foreground">
                  {tr(decision.farmerMessage)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {tr("The language layer only rephrases the decision above — it can't change it.")}
                </p>
              </Panel>

              <Panel eyebrow={tr("Symbolic layer")} title={tr("Rules evaluated this run")}>
                <div className="grid gap-3 md:grid-cols-2">
                  {result.rules.map((rule) => (
                    <div
                      key={rule.id}
                      className={cn(
                        "space-y-3 rounded-2xl border p-4",
                        rule.fired ? "border-primary/40 bg-secondary/40" : "border-border",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground">{tr(rule.id)}</p>
                          <p className="font-medium">{tr(rule.name)}</p>
                        </div>
                        <Chip tone={rule.fired ? "healthy" : "muted"}>
                          {rule.fired ? tr("Fired") : tr("Not met")}
                        </Chip>
                      </div>
                      <ul className="space-y-1 text-xs">
                        {rule.conditions.map((c) => (
                          <li key={c.text} className="flex items-start gap-2">
                            {c.met ? (
                              <CheckCircle2 className="mt-px size-3.5 shrink-0 text-healthy" />
                            ) : (
                              <XCircle className="mt-px size-3.5 shrink-0 text-muted-foreground" />
                            )}
                            <span className={c.met ? "text-foreground" : "text-muted-foreground"}>
                              {tr(c.text)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="border-t border-border pt-2 text-xs">
                        <span className="text-muted-foreground">{tr("Then:")} </span>
                        {tr(rule.then)}
                        {rule.fired && <span className="text-primary"> — {tr(rule.effect)}</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          )}
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
