import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Info, HelpCircle, Network, BookOpen, User, Sparkles } from "lucide-react";
import { PageHeader, Panel, Chip, Disclaimer, type Tone } from "@/components/agri/primitives";
import { graphNodes, graphEdges, type GraphNode } from "@/lib/agri-data";
import { Button } from "@/components/ui/button";
import { tr } from "@/lib/i18n";

export const Route = createFileRoute("/knowledge-graph")({
  head: () => ({
    meta: [
      { title: "Knowledge Graph — Cropify" },
      {
        name: "description",
        content: "Interactive visualization of crop-pathogen agronomic relationship networks.",
      },
    ],
  }),
  component: KnowledgeGraphRoute,
});

function KnowledgeGraphRoute() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(graphNodes[0] ?? null);
  const [filterType, setFilterType] = useState<"all" | "scientific" | "farmer">("all");

  const nodeMap = new Map(graphNodes.map((n) => [n.id, n]));

  // Highlight connections for selected node
  const activeEdges = graphEdges.filter((edge) => {
    // Apply filters
    if (filterType === "scientific" && edge.farmer) return false;
    if (filterType === "farmer" && !edge.farmer) return false;
    return true;
  });

  const connectedNodeIds = new Set<string>();
  if (selectedNode) {
    connectedNodeIds.add(selectedNode.id);
    activeEdges.forEach((edge) => {
      if (edge.from === selectedNode.id) connectedNodeIds.add(edge.to);
      if (edge.to === selectedNode.id) connectedNodeIds.add(edge.from);
    });
  }

  const kindColors: Record<GraphNode["kind"], { fill: string; border: string; text: string }> = {
    crop: { fill: "bg-healthy/10", border: "border-healthy/40", text: "text-healthy" },
    disease: { fill: "bg-critical/10", border: "border-critical/40", text: "text-critical" },
    symptom: { fill: "bg-warning/10", border: "border-warning/40", text: "text-warning" },
    weather: { fill: "bg-water/10", border: "border-water/40", text: "text-water" },
    soil: { fill: "bg-orange-500/10", border: "border-orange-500/40", text: "text-orange-500" },
    treatment: { fill: "bg-primary/10", border: "border-primary/45", text: "text-primary" },
    stage: { fill: "bg-symbolic/10", border: "border-symbolic/40", text: "text-symbolic" },
    farmer: { fill: "bg-neural/10", border: "border-neural/40", text: "text-neural" },
    pest: { fill: "bg-red-500/10", border: "border-red-500/40", text: "text-red-500" },
  };

  const getRelationsText = (node: GraphNode) => {
    const outputs: string[] = [];
    activeEdges.forEach((edge) => {
      if (edge.from === node.id) {
        const dest = nodeMap.get(edge.to)?.label || edge.to;
        outputs.push(`— [${tr(edge.rel).replace(/_/g, " ")}] → ${tr(dest)}`);
      } else if (edge.to === node.id) {
        const src = nodeMap.get(edge.from)?.label || edge.from;
        outputs.push(`← [${tr(edge.rel).replace(/_/g, " ")}] — ${tr(src)}`);
      }
    });
    return outputs;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={tr("Semantic Relations")}
        title={tr("Knowledge Graph")}
        subtitle={tr(
          "Cropify utilizes a structured database linking crops to diseases, environmental thresholds, and active treatment options. Selecting nodes reveals local relationship vectors.",
        )}
        actions={
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              {tr("All Edges")}
            </Button>
            <Button
              variant={filterType === "scientific" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("scientific")}
              className="gap-1.5"
            >
              <BookOpen className="size-3.5" /> {tr("Scientific Only")}
            </Button>
            <Button
              variant={filterType === "farmer" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("farmer")}
              className="gap-1.5"
            >
              <User className="size-3.5" /> {tr("Farmer Claims")}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Panel
          eyebrow={tr("Visual Graph")}
          title={tr("Ontology Web Map")}
          aside={<Chip tone="symbolic">{tr("Interactive Canvas")}</Chip>}
        >
          <div
            className="relative w-full border border-border/80 rounded-xl overflow-hidden bg-black/40"
            style={{ aspectRatio: "16 / 10" }}
          >
            {/* SVG Link lines */}
            <svg className="absolute inset-0 size-full pointer-events-none">
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="15"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-border)" opacity={0.6} />
                </marker>
              </defs>
              {activeEdges.map((edge, idx) => {
                const src = nodeMap.get(edge.from);
                const dest = nodeMap.get(edge.to);
                if (!src || !dest) return null;

                const isHighlighted =
                  selectedNode && (selectedNode.id === edge.from || selectedNode.id === edge.to);

                return (
                  <line
                    key={idx}
                    x1={`${src.x}%`}
                    y1={`${src.y}%`}
                    x2={`${dest.x}%`}
                    y2={`${dest.y}%`}
                    stroke={
                      isHighlighted
                        ? edge.farmer
                          ? "var(--color-neural)"
                          : "var(--color-primary)"
                        : "var(--color-border)"
                    }
                    strokeWidth={isHighlighted ? 2 : 1}
                    strokeDasharray={edge.farmer ? "4 4" : undefined}
                    opacity={selectedNode && !isHighlighted ? 0.2 : 0.75}
                    markerEnd="url(#arrow)"
                    className={isHighlighted ? "animate-pulse-soft" : ""}
                  />
                );
              })}
            </svg>

            {/* Render Node Buttons */}
            {graphNodes.map((node) => {
              const colors = kindColors[node.kind];
              const isSelected = selectedNode?.id === node.id;
              const isConnected = connectedNodeIds.has(node.id);
              const isDimmed = selectedNode && !isConnected;

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border px-3 py-1.5 text-[0.65rem] font-mono tracking-wider transition-all duration-300 ${
                    colors.fill
                  } ${colors.border} ${colors.text} ${
                    isSelected ? "ring-2 ring-primary/80 scale-105" : ""
                  } ${isDimmed ? "opacity-30 scale-95" : "opacity-100"}`}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <span className="font-semibold block">{tr(node.label)}</span>
                  <span className="text-[0.55rem] text-muted-foreground uppercase">
                    {tr(node.kind)}
                  </span>
                </button>
              );
            })}
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[0.55rem] bg-surface/80 p-2 rounded-lg border border-border">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-healthy" /> {tr("Crop")}
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-critical" /> {tr("Disease")}
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-warning" /> {tr("Symptom")}
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-water" /> {tr("Weather")}
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-primary" /> {tr("Treatment")}
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-neural" /> {tr("Claim")}
              </span>
            </div>
          </div>
        </Panel>

        <div className="space-y-6">
          {selectedNode ? (
            <Panel eyebrow={tr("Node Inspector")} title={tr(selectedNode.label)}>
              <Chip tone={kindColors[selectedNode.kind].text.split("-")[1] as Tone}>
                {tr("Type:")} {tr(selectedNode.kind)}
              </Chip>

              <div className="space-y-4 mt-6">
                <div>
                  <p className="label-eyebrow">{tr("Active Relationships")}</p>
                  <ul className="space-y-2 mt-2 font-mono text-[0.7rem] text-muted-foreground">
                    {getRelationsText(selectedNode).length > 0 ? (
                      getRelationsText(selectedNode).map((rel, rIdx) => (
                        <li key={rIdx} className="hover:text-foreground transition-colors py-0.5">
                          {tr(rel)}
                        </li>
                      ))
                    ) : (
                      <li className="italic text-muted-foreground/60">
                        {tr("No active relationships found for selected filters.")}
                      </li>
                    )}
                  </ul>
                </div>

                <div className="border-t border-border/40 pt-4 space-y-2 text-xs">
                  <p className="label-eyebrow">{tr("Ontology Definition")}</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {tr(
                      "This semantic entity represents a physical field parameter or class node mapped inside the Cropify agricultural reasoning schema.",
                    )}
                  </p>
                </div>
              </div>
            </Panel>
          ) : (
            <Panel title={tr("Select a Node")} eyebrow={tr("Inspector")}>
              <p className="text-sm text-muted-foreground">
                {tr("Click a graph node to review active relationship bounds.")}
              </p>
            </Panel>
          )}

          <Panel eyebrow={tr("Scientific Integrity")} title={tr("Provenance Standards")}>
            <div className="text-xs text-muted-foreground space-y-2 leading-relaxed">
              <p className="flex items-start gap-2">
                <BookOpen className="size-4 text-primary shrink-0" />
                <span>
                  <strong>{tr("Scientific reference")}</strong>{" "}
                  {tr(
                    "edges indicate relationships verified through peer-reviewed research databases.",
                  )}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <User className="size-4 text-neural shrink-0" />
                <span>
                  <strong>{tr("Farmer-derived observations")}</strong>{" "}
                  {tr(
                    "(dotted lines) denote qualitative insights logged directly from our district interview surveys.",
                  )}
                </span>
              </p>
            </div>
          </Panel>
        </div>
      </div>
      <Disclaimer />
    </div>
  );
}
