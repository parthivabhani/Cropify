import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera, Play } from "lucide-react";
import { Chip, Disclaimer, PageHeader, Panel, Stat } from "@/components/agri/primitives";
import { FieldMap } from "@/components/agri/field-map";
import { farm, healthBreakdown, recommendations } from "@/lib/agri-data";
import { Meter, SourceBadge } from "@/components/agri/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriTwin — Digital Twin & Neuro-Symbolic Crop Intelligence" },
      {
        name: "description",
        content:
          "Your farm, digitized, predicted, reasoned and simulated. AgriTwin combines ML, agricultural knowledge and digital-twin simulation for explainable crop decisions.",
      },
      { property: "og:title", content: "AgriTwin — Neuro-Symbolic Agricultural Intelligence" },
      {
        property: "og:description",
        content:
          "Digital twin + machine learning + symbolic reasoning + scenario simulation for intelligent crop production.",
      },
    ],
  }),
  component: Overview,
});

const pipeline = ["Farm", "ML", "Knowledge", "Reasoning", "Decision"];

function PipelineFlow() {
  return (
    <div className="panel overflow-hidden p-5">
      <p className="label-eyebrow mb-4">Decision pipeline</p>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {pipeline.map((p, i) => (
          <div key={p} className="flex shrink-0 items-center gap-2">
            <div className="glass rounded-lg px-3 py-2 font-mono text-[0.7rem] tracking-wider uppercase">
              {p}
            </div>
            {i < pipeline.length - 1 && (
              <div className="relative h-px w-10 bg-border md:w-16">
                <span
                  className="absolute -top-[3px] size-1.5 rounded-full bg-primary"
                  style={{
                    animation: `pulse-soft 1.6s ease-in-out ${i * 0.3}s infinite`,
                    left: "50%",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div className="space-y-8">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div className="animate-rise">
          <Chip tone="healthy">Neuro-Symbolic Agricultural Decision Intelligence</Chip>
          <h1 className="mt-5 text-4xl leading-[1.05] font-semibold md:text-5xl">
            Your Farm.
            <span className="text-healthy"> Digitized.</span> Predicted.
            <br className="hidden md:block" /> Reasoned. Simulated.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            AgriTwin combines machine learning, agricultural knowledge, and digital-twin simulation
            to help understand crop health, predict outcomes, and evaluate farming decisions before
            they are implemented in the real world.
          </p>
          <p className="mt-4 font-display text-sm text-foreground/80 italic">
            Think Beyond Prediction. Reason About the Farm.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/farm-twin"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Open Farm Twin <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/disease-analysis"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Camera className="size-4" /> Analyze Crop
            </Link>
            <Link
              to="/reasoning"
              className="inline-flex items-center gap-2 rounded-lg border border-dashed border-primary/40 px-5 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <Play className="size-4" /> Run Full Analysis
            </Link>
          </div>
        </div>
        <FieldMap compact />
      </section>

      <PipelineFlow />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Crop health score" value={farm.healthScore} unit="/100" hint="Composite of 6 sub-indices" />
        <Stat label="Predicted yield" value={farm.estimatedYield} unit="t/acre" tone="water" hint="Range 2.5 – 3.1 t/acre" />
        <Stat label="Risk score" value={farm.riskScore} unit="/100" tone="warning" hint="Disease + weather + water" />
        <Stat label="Active rules" value={3} unit="of 5" tone="symbolic" hint="0 constraints violated" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <Panel eyebrow="Composite index" title="Crop health breakdown">
          <div className="space-y-4">
            {healthBreakdown.map((b) => (
              <Meter key={b.label} label={b.label} value={b.value} tone={b.tone} />
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Today" title="Recommendations" aside={<Chip tone="neural">Decision support</Chip>}>
          <ul className="space-y-3">
            {recommendations.map((r) => (
              <li
                key={r.title}
                className="group rounded-lg border border-border bg-muted/20 p-4 transition-colors hover:border-primary/40"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{r.title}</p>
                  <SourceBadge source={r.source} />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{r.reason}</p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel eyebrow="The story" title="Observe → Understand → Reason → Simulate → Recommend → Learn">
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {[
            ["Observe", "Collect information from the real farm."],
            ["Understand", "Use AI to identify crop conditions."],
            ["Reason", "Combine ML with agricultural knowledge and rules."],
            ["Simulate", "Test possible decisions digitally."],
            ["Recommend", "Provide an explainable recommendation."],
            ["Learn", "Store outcomes and farmer knowledge."],
          ].map(([t, d], i) => (
            <div key={t} className="rounded-lg border border-border bg-muted/20 p-4">
              <span className="metric text-2xl text-primary">0{i + 1}</span>
              <p className="mt-1 font-medium">{t}</p>
              <p className="mt-1 text-xs text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <Disclaimer className="mt-5" />
      </Panel>

      <PageHeaderSpacer />
    </div>
  );
}

function PageHeaderSpacer() {
  return <PageHeader title="" subtitle="" eyebrow="" actions={null} />;
}
