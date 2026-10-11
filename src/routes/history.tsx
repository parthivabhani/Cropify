import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { History, Sprout, CloudSun, UserCheck, ShieldAlert, Cpu } from "lucide-react";
import { PageHeader, Panel, SourceBadge, Disclaimer } from "@/components/agri/primitives";
import { timeline } from "@/lib/agri-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Farm History & Logs — AgriTwin" },
      {
        name: "description",
        content: "Chronological ledger of farm actions, observations, and outcomes.",
      },
    ],
  }),
  component: FarmHistory,
});

function FarmHistory() {
  const [filterType, setFilterType] = useState<"all" | "activity" | "detection" | "recommendation">(
    "all",
  );

  const filteredTimeline = timeline.filter((item) => {
    if (filterType === "all") return true;
    if (filterType === "activity") {
      return (
        item.kind.toLowerCase().includes("plant") ||
        item.kind.toLowerCase().includes("fertilizer") ||
        item.kind.toLowerCase().includes("irrigation") ||
        item.kind.toLowerCase().includes("treatment")
      );
    }
    if (filterType === "detection") {
      return (
        item.kind.toLowerCase().includes("detect") ||
        item.kind.toLowerCase().includes("weather") ||
        item.kind.toLowerCase().includes("observation")
      );
    }
    if (filterType === "recommendation") {
      return (
        item.kind.toLowerCase().includes("recommendation") ||
        item.kind.toLowerCase().includes("outcome")
      );
    }
    return true;
  });

  const getIcon = (kind: string) => {
    const k = kind.toLowerCase();
    if (k.includes("plant") || k.includes("crop")) return Sprout;
    if (k.includes("weather") || k.includes("rain")) return CloudSun;
    if (k.includes("detect") || k.includes("vision")) return Cpu;
    if (k.includes("recommendation")) return ShieldAlert;
    return UserCheck;
  };

  const getTone = (kind: string) => {
    const k = kind.toLowerCase();
    if (k.includes("detect")) return "text-critical bg-critical/10 border-critical/30";
    if (k.includes("weather")) return "text-water bg-water/10 border-water/30";
    if (k.includes("recommendation")) return "text-warning bg-warning/10 border-warning/30";
    if (k.includes("plant")) return "text-healthy bg-healthy/10 border-healthy/30";
    return "text-primary bg-primary/10 border-primary/30";
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Audit Trail"
        title="Farm History & Logs"
        subtitle="Review a longitudinal ledger of activities, observations, model inferences, and recommendation outcomes. Every log entry is stamped with its provenance origin."
      />

      <div className="flex gap-2 border-b border-border/40 pb-4 overflow-x-auto">
        <button
          onClick={() => setFilterType("all")}
          className={`px-4 py-1.5 text-xs rounded-lg transition-colors font-medium border ${
            filterType === "all"
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground border-border/80 hover:bg-muted/10"
          }`}
        >
          All Logs
        </button>
        <button
          onClick={() => setFilterType("activity")}
          className={`px-4 py-1.5 text-xs rounded-lg transition-colors font-medium border ${
            filterType === "activity"
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground border-border/80 hover:bg-muted/10"
          }`}
        >
          Farm Activities
        </button>
        <button
          onClick={() => setFilterType("detection")}
          className={`px-4 py-1.5 text-xs rounded-lg transition-colors font-medium border ${
            filterType === "detection"
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground border-border/80 hover:bg-muted/10"
          }`}
        >
          AI & Observations
        </button>
        <button
          onClick={() => setFilterType("recommendation")}
          className={`px-4 py-1.5 text-xs rounded-lg transition-colors font-medium border ${
            filterType === "recommendation"
              ? "bg-primary text-primary-foreground border-primary"
              : "text-muted-foreground border-border/80 hover:bg-muted/10"
          }`}
        >
          Recommendations
        </button>
      </div>

      <div className="relative pl-6 md:pl-10 before:absolute before:inset-y-0 before:left-[17px] md:before:left-[25px] before:w-[1px] before:bg-border/60">
        <div className="space-y-6">
          {filteredTimeline.length > 0 ? (
            filteredTimeline.map((item, idx) => {
              const Icon = getIcon(item.kind);
              const toneClass = getTone(item.kind);

              return (
                <div key={idx} className="relative group animate-rise">
                  {/* Timeline bullet icon */}
                  <span
                    className={`absolute -left-[30px] md:-left-[42px] top-2.5 z-10 size-7 md:size-9 rounded-full border flex items-center justify-center transition-all ${toneClass}`}
                  >
                    <Icon className="size-3.5 md:size-4" />
                  </span>

                  <div className="panel bg-background/25 hover:bg-background/40 transition-colors border-border/60 p-4 md:p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-primary">
                          {item.date}
                        </span>
                        <span className="font-display text-sm font-semibold">{item.kind}</span>
                      </div>
                      <SourceBadge source={item.source} />
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10">
              <History className="size-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No events found matching selected filter.
              </p>
            </div>
          )}
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
