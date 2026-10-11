import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Workflow,
  Cpu,
  BrainCircuit,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Play,
  RefreshCw,
} from "lucide-react";
import { PageHeader, Panel, Chip, SourceBadge, Disclaimer } from "@/components/agri/primitives";
import { reasoningSteps, rules } from "@/lib/agri-data";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/reasoning")({
  head: () => ({
    meta: [
      { title: "Neuro-Symbolic Reasoning Engine — AgriTwin" },
      {
        name: "description",
        content: "Trace details of the neural-symbolic decision execution flow.",
      },
    ],
  }),
  component: Reasoning,
});

function Reasoning() {
  const [pipelineStep, setPipelineStep] = useState<number | null>(null);

  const pipelineSteps = [
    "Loading field source digital twin profile...",
    "Processing in-situ leaf photograph...",
    "Running neural vision model (YOLO lesion detection)...",
    "Collecting weather microclimate context (humidity & rain)...",
    "Querying agricultural knowledge graph...",
    "Activating symbolic rule constraints (IF-THEN)...",
    "Running neuro-symbolic reweighting posterior...",
    "Running yield regression scenario analysis...",
    "Generating final explainable recommendation...",
  ];

  const triggerLivePipelineWalkthrough = () => {
    setPipelineStep(0);
  };

  useEffect(() => {
    if (pipelineStep === null) return;
    if (pipelineStep >= pipelineSteps.length) {
      toast.success("End-to-End Analysis Complete!", {
        description: "Decision reasoning trace and yield scenarios generated.",
      });
      return;
    }
    const timer = setTimeout(() => {
      setPipelineStep((prev) => (prev !== null ? prev + 1 : null));
    }, 600);
    return () => clearTimeout(timer);
  }, [pipelineStep]);

  const pipeline = [
    {
      name: "Neural Vision",
      desc: "Lesion Detection",
      value: "82% Blight",
      icon: Cpu,
      tone: "neural" as const,
    },
    {
      name: "Context Feed",
      desc: "Climate sensors",
      value: "91% Humidity",
      icon: Workflow,
      tone: "water" as const,
    },
    {
      name: "KG Relations",
      desc: "Agronomic database",
      value: "Tomato → Blight",
      icon: BrainCircuit,
      tone: "symbolic" as const,
    },
    {
      name: "Rule Guard",
      desc: "Symbolic checks",
      value: "Rule #018 Met",
      icon: ShieldAlert,
      tone: "healthy" as const,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Neuro-Symbolic Reasoning"
        title="Reasoning Engine"
        subtitle="AgriTwin isolates neural pattern classification from logical rule validation. The symbolic layer ensures AI outputs remain compliant with agricultural guidelines."
        actions={
          <Button
            onClick={triggerLivePipelineWalkthrough}
            className="gap-2"
            disabled={pipelineStep !== null && pipelineStep < pipelineSteps.length}
          >
            <Play className="size-4" /> Run reasoning pipeline
          </Button>
        }
      />

      {/* Live Pipeline Walkthrough overlay */}
      {pipelineStep !== null && pipelineStep < pipelineSteps.length && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md px-4">
          <div className="panel max-w-md w-full p-8 text-center space-y-6 border border-primary/30">
            <RefreshCw className="size-10 text-primary animate-spin mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">End-to-End Simulation</h3>
              <p className="text-xs text-muted-foreground font-mono">
                Step {pipelineStep + 1} of {pipelineSteps.length}
              </p>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${((pipelineStep + 1) / pipelineSteps.length) * 100}%` }}
              />
            </div>
            <p className="text-sm font-medium text-foreground min-h-[40px]">
              {pipelineSteps[pipelineStep]}
            </p>
          </div>
        </div>
      )}

      {/* Pipeline Walkthrough completion overlay */}
      {pipelineStep !== null && pipelineStep >= pipelineSteps.length && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md px-4">
          <div className="panel max-w-md w-full p-8 text-center space-y-6 border border-healthy/35">
            <CheckCircle2 className="size-12 text-healthy mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Decision Generated</h3>
              <p className="text-xs text-muted-foreground font-mono">
                Simulation metrics fully resolved
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3 text-left text-xs text-muted-foreground">
              <p>✓ Neural model: identified early blight at 82% confidence.</p>
              <p>✓ Context: humidity (91%) and soil moisture (HIGH) collected.</p>
              <p>✓ Symbolic engine: Rule #018 and Rule #027 satisfied.</p>
              <p>✓ Reweighted posterior: 91% final decision confidence.</p>
            </div>
            <Button onClick={() => setPipelineStep(null)} className="w-full">
              Review Pipeline Details
            </Button>
          </div>
        </div>
      )}

      <Panel eyebrow="Execution Pipeline" title="Neuro-Symbolic Decision Flow">
        <div className="grid gap-4 md:grid-cols-4 relative mt-4">
          {pipeline.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.name}
                className="relative flex flex-col items-center p-4 rounded-xl border border-border/80 bg-background/40 text-center"
              >
                <div className={`p-3 rounded-full mb-3 bg-${p.tone}/10 text-${p.tone}`}>
                  <Icon className="size-6" />
                </div>
                <h4 className="text-sm font-semibold">{p.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                <Chip tone={p.tone} className="mt-3 normal-case font-semibold">
                  {p.value}
                </Chip>
                {i < pipeline.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-10 text-muted-foreground">
                    <ArrowRight className="size-4 animate-pulse-soft" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="panel bg-primary/5 border-primary/20 p-4 mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-primary">Reweighting Logic Activated</h4>
            <p className="text-xs text-muted-foreground max-w-xl">
              Neural classifier predicted Early Blight at 82% confidence. Symbolic rule constraints
              (humidity & rain conditions met) reweighted final diagnostic belief to 91% explainable
              confidence.
            </p>
          </div>
          <Chip tone="healthy" className="font-mono text-xs py-1.5 px-3">
            Final posterior: 91%
          </Chip>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Panel eyebrow="Explainable Trace" title="Execution Reasoning Trace">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {reasoningSteps.map((step, idx) => (
              <AccordionItem
                key={step.title}
                value={`step-${idx}`}
                className="panel border border-border/60 bg-background/25 px-4 py-1"
              >
                <AccordionTrigger className="hover:no-underline py-3 text-sm text-left">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-primary bg-primary/10 size-6 flex items-center justify-center rounded-full shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-foreground">{step.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-3 border-t border-border/20 mt-1 space-y-3">
                  <p className="text-xs leading-relaxed text-muted-foreground">{step.detail}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/10">
                    <span className="text-[0.65rem] text-muted-foreground">
                      Evidence: <strong className="text-foreground">{step.evidence}</strong>
                    </span>
                    <SourceBadge source={step.source} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Panel>

        <Panel eyebrow="Agricultural Rules" title="Symbolic Rule Engine">
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="panel bg-background/20 p-4 border-border/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">{rule.id}</span>
                  <Chip tone={rule.status === "ACTIVATED" ? "healthy" : "muted"}>
                    {rule.status}
                  </Chip>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {rule.name}
                  </h4>
                </div>
                <div className="space-y-1.5 pt-2">
                  <p className="font-mono text-[0.65rem] text-muted-foreground uppercase">
                    IF CONDITIONS:
                  </p>
                  <ul className="space-y-1 text-xs">
                    {rule.conditions.map((cond, cIdx) => (
                      <li key={cIdx} className="flex items-center gap-2 text-muted-foreground">
                        {cond.met ? (
                          <CheckCircle2 className="size-3.5 text-healthy shrink-0" />
                        ) : (
                          <XCircle className="size-3.5 text-muted-foreground shrink-0" />
                        )}
                        <span className={cond.met ? "text-foreground font-medium" : ""}>
                          {cond.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border-t border-border/30 pt-2 text-xs">
                  <span className="font-mono text-[0.65rem] text-muted-foreground uppercase block">
                    THEN CONSEQUENT:
                  </span>
                  <p className="mt-1 text-foreground font-medium">{rule.then}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Disclaimer />
    </div>
  );
}
