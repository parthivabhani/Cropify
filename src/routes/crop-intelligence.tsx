import { createFileRoute } from "@tanstack/react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Info, HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { PageHeader, Panel, Stat, Meter, Chip, Disclaimer } from "@/components/agri/primitives";
import { healthBreakdown, yieldHistory, featureImportance } from "@/lib/agri-data";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Route = createFileRoute("/crop-intelligence")({
  head: () => ({
    meta: [
      { title: "Crop & Yield Intelligence — AgriTwin" },
      {
        name: "description",
        content: "Yield regression, composite health analysis, and feature importance.",
      },
    ],
  }),
  component: CropIntelligence,
});

function CropIntelligence() {
  // Format history for charts (replace null with undefined so Recharts doesn't break)
  const chartData = yieldHistory.map((item) => ({
    ...item,
    actual: item.actual ?? undefined,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Analyze & Predict"
        title="Crop & Yield Intelligence"
        subtitle="Detailed analysis of crop health parameters, yield predictions, and the contributing model parameters. Predictions are paired with evidence and explicit model confidence."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Estimated yield"
          value="2.8"
          unit="t/acre"
          tone="water"
          hint="Model prediction band: 2.5 - 3.1 t/acre"
        />
        <Stat
          label="Data completeness"
          value="74"
          unit="%"
          tone="warning"
          hint="Uncertainty: No recent soil chemistry test"
        />
        <Stat
          label="F1 prediction quality"
          value="93.2"
          unit="%"
          tone="healthy"
          hint="Model accuracy under test validation"
        />
        <Stat
          label="Current health index"
          value="84"
          unit="/100"
          tone="healthy"
          hint="Weighted blend of 6 health categories"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Panel
          eyebrow="Growth Performance"
          title="Crop Health Breakdown"
          aside={
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <HelpCircle className="size-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="glass max-w-xs p-2 text-xs">
                  Composite health is computed using neural crop stress metrics combined with
                  localized environmental factors.
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          }
        >
          <div className="space-y-5">
            {healthBreakdown.map((b) => (
              <Meter key={b.label} label={b.label} value={b.value} tone={b.tone} />
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Regression Model" title="Yield Prediction & History">
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-healthy)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--color-healthy)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-water)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-water)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis dataKey="cycle" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" unit=" t" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground)",
                    borderRadius: "var(--radius-md)",
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Area
                  name="Actual Yield"
                  type="monotone"
                  dataKey="actual"
                  stroke="var(--color-healthy)"
                  fillOpacity={1}
                  fill="url(#colorActual)"
                  strokeWidth={2}
                />
                <Area
                  name="Predicted Yield"
                  type="monotone"
                  dataKey="predicted"
                  stroke="var(--color-water)"
                  fillOpacity={1}
                  fill="url(#colorPredicted)"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed text-center">
            Comparing actual field yields with historical model regressions. Dotted line indicates
            predicted yield.
          </p>
        </Panel>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Panel eyebrow="Explainable AI" title="Evidence-based Decision Rationale">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3 flex items-center gap-1.5 text-healthy">
                <CheckCircle2 className="size-4" /> Positive Evidence Indicators
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-healthy">✓</span> Suitable temperature range (25°C - 30°C)
                  supports vegetative progression.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-healthy">✓</span> Tomato cultivar (Atharva-8021) shows good
                  compatibility with soil pH (6.2).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-healthy">✓</span> Balanced Nitrogen management matches
                  vegetative target requirements.
                </li>
              </ul>
            </div>

            <div className="border-t border-border/40 pt-4">
              <p className="text-sm font-medium mb-3 flex items-center gap-1.5 text-critical">
                <AlertCircle className="size-4" /> Risk & Negative Constraints
              </p>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-critical">✗</span> High relative humidity (91%) activates
                  early-blight fungal risk constraints.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-critical">✗</span> Elevated moisture logs in Zone C1
                  increase root disease and water-stress probability.
                </li>
              </ul>
            </div>
          </div>
        </Panel>

        <Panel eyebrow="Interpretability" title="XGBoost Feature Importance">
          <div className="space-y-4">
            {featureImportance.map((f) => (
              <div key={f.feature}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">{f.feature}</span>
                  <span className="font-mono text-primary">{(f.weight * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: `${f.weight * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed flex items-center gap-2">
            <Info className="size-4 text-primary shrink-0" /> SHAP-derived feature attributions for
            tabular regression modeling.
          </p>
        </Panel>
      </div>

      <Disclaimer />
    </div>
  );
}
