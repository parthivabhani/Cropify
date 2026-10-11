import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Network, Server, Database, ShieldAlert, Cpu, ArrowDown } from "lucide-react";
import { PageHeader, Panel, Chip, Disclaimer } from "@/components/agri/primitives";
import { tr } from "@/lib/i18n";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Technical Architecture — Cropify" },
      {
        name: "description",
        content: "Details of the Neuro-Symbolic agricultural AI decision architecture.",
      },
    ],
  }),
  component: ArchitectureRoute,
});

interface ArchComponent {
  id: string;
  name: string;
  category: "Client" | "Service" | "Model" | "Knowledge" | "Decision";
  role: string;
  stack: string;
  constraint: string;
}

function ArchitectureRoute() {
  const [selectedComp, setSelectedComp] = useState<ArchComponent | null>({
    id: "rules",
    name: "Symbolic Rule Engine",
    category: "Knowledge",
    role: "Evaluates hard environmental constraints (humidity, temperature boundaries) and legal spraying constraints against farm status inputs.",
    stack: "Python Pattern Matcher / JSON Rule Declarations",
    constraint:
      "Operates as a strict filter. Has absolute priority; neural predictions cannot bypass rule limits.",
  });

  const components: ArchComponent[] = [
    {
      id: "client",
      name: "React Web Application",
      category: "Client",
      role: "Provides precision interface dashboards, digital twin map widgets, voice assistants, and scenario simulator sandboxes.",
      stack: "React, TypeScript, Tailwind CSS, TanStack Start, Recharts",
      constraint: "Strictly handles presentation logic and interactive telemetry display.",
    },
    {
      id: "backend",
      name: "FastAPI Backend API",
      category: "Service",
      role: "Orchestrates API calls, routes data to appropriate ML endpoints, executes rule sets, and returns reasoning traces.",
      stack: "Python, FastAPI, Uvicorn",
      constraint: "Acts as a stateless middleware coordinator for reasoning tasks.",
    },
    {
      id: "vision",
      name: "Computer Vision Models",
      category: "Model",
      role: "Localizes leaf disease hotspots and classifies pathogen types from uploaded photographs.",
      stack: "YOLO v8 (object detection), EfficientNet (classification), PyTorch",
      constraint:
        "Outputs class probabilities only. Predictions are treated as soft hypothesis beliefs, not verified truths.",
    },
    {
      id: "yield",
      name: "XGBoost Regressor",
      category: "Model",
      role: "Predicts expected yield and crop suitability values from soil features, climate metrics, and historical logs.",
      stack: "XGBoost, scikit-learn",
      constraint: "Produces point regression results paired with calculated confidence bounds.",
    },
    {
      id: "graph",
      name: "Neo4j Knowledge Graph",
      category: "Knowledge",
      role: "Stores semantic taxonomies, crop-disease susceptibilities, and farmer-reported heuristic claims.",
      stack: "Neo4j (Cypher), GraphQL",
      constraint:
        "Maintains clear tags separating scientifically verified links from farmer claims.",
    },
    {
      id: "rules",
      name: "Symbolic Rule Engine",
      category: "Knowledge",
      role: "Evaluates hard environmental constraints (humidity, temperature boundaries) and legal spraying constraints against farm status inputs.",
      stack: "Python Pattern Matcher / JSON Rule Declarations",
      constraint:
        "Operates as a strict filter. Has absolute priority; neural predictions cannot bypass rule limits.",
    },
    {
      id: "llm",
      name: "LLM Explanation Layer",
      category: "Decision",
      role: "Translates logical rules and classification data into Hinglish/Marathi natural language sentences for farmer support.",
      stack: "OpenAI API / Local Llama-3",
      constraint:
        "Acts exclusively as a translation/dialogue layer. The LLM cannot alter or override symbolic constraints.",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={tr("System Design")}
        title={tr("Technical Architecture")}
        subtitle={tr(
          "Overview of Cropify's system boundaries and data exchange. Click architectural nodes to review individual constraints and technology stacks.",
        )}
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Panel eyebrow={tr("System Flow")} title={tr("Data Flowchart Grid")}>
          <div className="flex flex-col items-center gap-4 mt-4">
            {/* Row 1: Client */}
            <div className="w-full max-w-sm">
              <button
                onClick={() => setSelectedComp(components.find((c) => c.id === "client") || null)}
                className={`w-full p-4 rounded-xl border text-center transition-all ${
                  selectedComp?.id === "client"
                    ? "ring-2 ring-primary bg-primary/10 border-primary"
                    : "border-border bg-background/40 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  <Server className="size-4" />{" "}
                  <span className="text-xs font-mono font-bold uppercase">
                    {tr("User UI Layer")}
                  </span>
                </div>
                <h4 className="text-sm font-semibold">{tr("React Web App (SPA Client)")}</h4>
              </button>
            </div>

            <ArrowDown className="size-5 text-muted-foreground animate-pulse-soft" />

            {/* Row 2: Backend */}
            <div className="w-full max-w-sm">
              <button
                onClick={() => setSelectedComp(components.find((c) => c.id === "backend") || null)}
                className={`w-full p-4 rounded-xl border text-center transition-all ${
                  selectedComp?.id === "backend"
                    ? "ring-2 ring-primary bg-primary/10 border-primary"
                    : "border-border bg-background/40 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  <Server className="size-4" />{" "}
                  <span className="text-xs font-mono font-bold uppercase">
                    {tr("Orchestrator middleware")}
                  </span>
                </div>
                <h4 className="text-sm font-semibold">{tr("FastAPI Gateway API")}</h4>
              </button>
            </div>

            <ArrowDown className="size-5 text-muted-foreground animate-pulse-soft" />

            {/* Row 3: Models, Graph, Rules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
              <button
                onClick={() => setSelectedComp(components.find((c) => c.id === "vision") || null)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  selectedComp?.id === "vision" || selectedComp?.id === "yield"
                    ? "ring-2 ring-primary bg-primary/10 border-primary"
                    : "border-border bg-background/40 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-neural mb-1">
                  <Cpu className="size-4" />{" "}
                  <span className="text-xs font-mono font-bold uppercase">
                    {tr("Neural Layer")}
                  </span>
                </div>
                <h4 className="text-xs font-semibold">{tr("CV YOLO / XGBoost ML")}</h4>
              </button>

              <button
                onClick={() => setSelectedComp(components.find((c) => c.id === "graph") || null)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  selectedComp?.id === "graph"
                    ? "ring-2 ring-primary bg-primary/10 border-primary"
                    : "border-border bg-background/40 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-symbolic mb-1">
                  <Database className="size-4" />{" "}
                  <span className="text-xs font-mono font-bold uppercase">
                    {tr("Knowledge base")}
                  </span>
                </div>
                <h4 className="text-xs font-semibold">{tr("Neo4j Ontology Graph")}</h4>
              </button>

              <button
                onClick={() => setSelectedComp(components.find((c) => c.id === "rules") || null)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  selectedComp?.id === "rules"
                    ? "ring-2 ring-primary bg-primary/10 border-primary"
                    : "border-border bg-background/40 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-healthy mb-1">
                  <Network className="size-4" />{" "}
                  <span className="text-xs font-mono font-bold uppercase">
                    {tr("Symbolic Guard")}
                  </span>
                </div>
                <h4 className="text-xs font-semibold">{tr("Constraint Rule Engine")}</h4>
              </button>
            </div>

            <ArrowDown className="size-5 text-muted-foreground animate-pulse-soft" />

            {/* Row 4: LLM */}
            <div className="w-full max-w-sm">
              <button
                onClick={() => setSelectedComp(components.find((c) => c.id === "llm") || null)}
                className={`w-full p-4 rounded-xl border text-center transition-all ${
                  selectedComp?.id === "llm"
                    ? "ring-2 ring-primary bg-primary/10 border-primary"
                    : "border-border bg-background/40 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-primary mb-1">
                  <Server className="size-4" />{" "}
                  <span className="text-xs font-mono font-bold uppercase">
                    {tr("Human Translation")}
                  </span>
                </div>
                <h4 className="text-sm font-semibold">{tr("LLM Explanation Layer")}</h4>
              </button>
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          {selectedComp ? (
            <div className="animate-rise space-y-6">
              <Panel eyebrow={tr("Component Spec")} title={tr(selectedComp.name)}>
                <Chip tone="symbolic" className="mb-4">
                  {tr("Domain:")} {tr(selectedComp.category)}
                </Chip>

                <div className="space-y-4 text-sm mt-2">
                  <div>
                    <p className="label-eyebrow">{tr("Functional Role")}</p>
                    <p className="text-muted-foreground mt-1 leading-relaxed">
                      {tr(selectedComp.role)}
                    </p>
                  </div>

                  <div>
                    <p className="label-eyebrow">{tr("Technology Stack")}</p>
                    <p className="font-mono text-xs mt-1 text-primary">{tr(selectedComp.stack)}</p>
                  </div>

                  <div className="rounded-lg border border-warning bg-warning/5 p-3.5 space-y-1.5">
                    <p className="label-eyebrow flex items-center gap-1 text-warning">
                      <ShieldAlert className="size-4" /> {tr("Core Design Constraint")}
                    </p>
                    <p className="text-xs leading-normal text-muted-foreground">
                      {tr(selectedComp.constraint)}
                    </p>
                  </div>
                </div>
              </Panel>
            </div>
          ) : (
            <Panel title={tr("Select a Component")} eyebrow={tr("Inspector")}>
              <p className="text-sm text-muted-foreground">
                {tr("Click a layout box to audit its technology credentials.")}
              </p>
            </Panel>
          )}
        </div>
      </div>
      <Disclaimer />
    </div>
  );
}
