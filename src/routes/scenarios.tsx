import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sliders, Save, Trash2, ArrowRight, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";
import { PageHeader, Panel, Stat, Chip, Disclaimer } from "@/components/agri/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tr } from "@/lib/i18n";

export const Route = createFileRoute("/scenarios")({
  head: () => ({
    meta: [
      { title: "Scenario Simulator — Cropify" },
      {
        name: "description",
        content: "Test agricultural decisions using reactive crop simulation modeling.",
      },
    ],
  }),
  component: Scenarios,
});

interface SavedScenario {
  id: string;
  name: string;
  nitrogen: number;
  irrigation: number;
  pH: number;
  temp: number;
  rain: number;
  yieldVal: number;
  riskVal: number;
  waterVal: number;
  profitVal: number;
}

function Scenarios() {
  // Slider states
  const [nitrogen, setNitrogen] = useState(1.0); // Factor (0.5 to 2.0)
  const [irrigation, setIrrigation] = useState(0); // Minutes change (-30 to +60)
  const [pH, setPh] = useState(6.2); // pH (4.5 to 8.5)
  const [temp, setTemp] = useState(27); // °C (15 to 40)
  const [rain, setRain] = useState(20); // mm (0 to 100)

  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([
    {
      id: "baseline",
      name: "Baseline Farm Profile",
      nitrogen: 1.0,
      irrigation: 0,
      pH: 6.2,
      temp: 27,
      rain: 20,
      yieldVal: 2.8,
      riskVal: 38,
      waterVal: 100,
      profitVal: 485000,
    },
  ]);
  const [scenarioName, setScenarioName] = useState("");

  // Simulation Calculations
  // Moisture baseline is 50%. Adjust by irrigation and rain.
  const moisture = Math.min(100, Math.max(10, 50 + irrigation * 0.5 + rain * 0.8));

  // Yield factor equations
  let yieldFactor = 1.0;

  // Nitrogen curve
  if (nitrogen <= 1.3) {
    yieldFactor += (nitrogen - 1.0) * 0.22; // Moderate N improves yield
  } else {
    yieldFactor += (1.3 - 1.0) * 0.22 - (nitrogen - 1.3) * 0.75; // Excess N causes toxicity
  }

  // pH curve
  if (pH < 6.0) yieldFactor -= (6.0 - pH) * 0.25;
  if (pH > 6.8) yieldFactor -= (pH - 6.8) * 0.2;

  // Moisture curve
  if (moisture < 35) yieldFactor -= (35 - moisture) * 0.015;
  if (moisture > 80) yieldFactor -= (moisture - 80) * 0.018;

  const simYield = Math.max(0.4, Number((2.8 * yieldFactor).toFixed(2)));

  // Disease Risk equations
  const humidity = Math.min(100, Math.max(30, 75 + rain * 0.6 + irrigation * 0.2));
  const simRisk = Math.min(
    100,
    Math.max(
      5,
      Math.round(
        38 +
          (humidity > 80 ? (humidity - 80) * 1.5 : 0) +
          (temp > 25 && temp < 32 ? (temp - 25) * 2.5 : 0) +
          (nitrogen > 1.3 ? (nitrogen - 1.3) * 15 : 0),
      ),
    ),
  );

  // Water need index
  const simWater = Math.max(10, Math.round(100 + (temp - 27) * 4 - rain * 1.8 - irrigation * 0.4));

  // Financial calculations (2.5 acres block)
  const pricePerTonne = 38000; // INR
  const simRevenue = simYield * pricePerTonne * 2.5;
  const fertilizerCost = nitrogen * 8000 * 2.5;
  const irrigationCost = (40 + irrigation) * 120 * 2.5;
  const baselineCost = 15000 * 2.5;
  const simCost = fertilizerCost + irrigationCost + baselineCost;
  const simProfit = Math.round(simRevenue - simCost);

  // Alerts
  const hasNitrogenWarning = nitrogen > 1.3;
  const hasDiseaseWarning = simRisk > 65;
  const hasPhWarning = pH < 5.5 || pH > 7.5;

  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenarioName.trim()) {
      toast.error(tr("Please enter a name for the scenario."));
      return;
    }
    const newScenario: SavedScenario = {
      id: Date.now().toString(),
      name: scenarioName,
      nitrogen,
      irrigation,
      pH,
      temp,
      rain,
      yieldVal: simYield,
      riskVal: simRisk,
      waterVal: simWater,
      profitVal: simProfit,
    };
    setSavedScenarios([...savedScenarios, newScenario]);
    setScenarioName("");
    toast.success(tr(`Scenario "${scenarioName}" saved! Check the comparison matrix below.`));
  };

  const handleDeleteScenario = (id: string) => {
    if (id === "baseline") return;
    setSavedScenarios(savedScenarios.filter((s) => s.id !== id));
    toast.info(tr("Scenario deleted."));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={tr("Simulate & Compare")}
        title={tr("What If? Scenario Simulator")}
        subtitle={tr(
          "Simulate localized interventions (irrigation adjustments, chemical dosage) in a sandbox environment before applying them to the physical farm twin.",
        )}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Panel eyebrow={tr("Control Panel")} title={tr("Environmental & Input Variables")}>
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label className="text-muted-foreground">{tr("Nitrogen Fertilizer Ratio")}</label>
                <span className="font-mono text-primary">
                  {nitrogen.toFixed(1)}
                  {tr("x dosage")}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={nitrogen}
                onChange={(e) => setNitrogen(parseFloat(e.target.value))}
                className="w-full accent-primary bg-muted rounded-lg appearance-none cursor-pointer h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label className="text-muted-foreground">{tr("Irrigation Run-Time Change")}</label>
                <span className="font-mono text-primary">
                  {irrigation > 0 ? `+${irrigation}` : tr(irrigation)} {tr("min")}
                </span>
              </div>
              <input
                type="range"
                min="-30"
                max="60"
                step="5"
                value={irrigation}
                onChange={(e) => setIrrigation(parseInt(e.target.value))}
                className="w-full accent-primary bg-muted rounded-lg appearance-none cursor-pointer h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <label className="text-muted-foreground">{tr("Soil pH")}</label>
                <span className="font-mono text-primary">
                  {tr("pH")} {pH.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min="4.5"
                max="8.5"
                step="0.1"
                value={pH}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full accent-primary bg-muted rounded-lg appearance-none cursor-pointer h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <label className="text-muted-foreground">{tr("Temperature")}</label>
                  <span className="font-mono text-primary">
                    {tr(temp)}
                    {tr("°C")}
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="40"
                  step="1"
                  value={temp}
                  onChange={(e) => setTemp(parseInt(e.target.value))}
                  className="w-full accent-primary bg-muted rounded-lg appearance-none cursor-pointer h-2"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <label className="text-muted-foreground">{tr("Forecast Rain")}</label>
                  <span className="font-mono text-primary">
                    {tr(rain)} {tr("mm")}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={rain}
                  onChange={(e) => setRain(parseInt(e.target.value))}
                  className="w-full accent-primary bg-muted rounded-lg appearance-none cursor-pointer h-2"
                />
              </div>
            </div>

            <form
              onSubmit={handleSaveScenario}
              className="flex gap-2 pt-4 border-t border-border/40"
            >
              <Input
                placeholder={tr("Scenario label (e.g. Higher Drip runtime)")}
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="text-xs h-9 bg-background/50 focus:bg-background"
              />
              <Button type="submit" size="sm" className="gap-2 shrink-0">
                <Save className="size-4" /> {tr("Save Scenario")}
              </Button>
            </form>
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel eyebrow={tr("Simulated Outcomes")} title={tr("Simulated Yield & Economics")}>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="panel bg-background/30 p-3 border-border/40">
                <p className="label-eyebrow">{tr("Simulated Yield")}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-bold font-display text-primary">
                    {tr(simYield)}
                  </span>
                  <span className="text-xs text-muted-foreground">{tr("t/acre")}</span>
                </div>
                <p className="text-[0.65rem] text-muted-foreground mt-1">
                  {tr("Change:")} {Number((((simYield - 2.8) / 2.8) * 100).toFixed(1))}
                  {tr("% vs baseline")}
                </p>
              </div>

              <div className="panel bg-background/30 p-3 border-border/40">
                <p className="label-eyebrow">{tr("Net Profit (2.5 Ac)")}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-bold font-display text-healthy">
                    ₹{simProfit.toLocaleString()}
                  </span>
                </div>
                <p className="text-[0.65rem] text-muted-foreground mt-1">
                  {tr("Change:")}{" "}
                  {simProfit > 485000 ? tr("Increased margin") : tr("Reduced margin")}
                </p>
              </div>

              <div className="panel bg-background/30 p-3 border-border/40">
                <p className="label-eyebrow">{tr("Disease Risk Index")}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span
                    className={`text-xl font-bold font-display ${simRisk > 65 ? "text-critical" : "text-foreground"}`}
                  >
                    {tr(simRisk)}%
                  </span>
                </div>
                <p className="text-[0.65rem] text-muted-foreground mt-1">
                  {tr("Pathogen susceptibility")}
                </p>
              </div>

              <div className="panel bg-background/30 p-3 border-border/40">
                <p className="label-eyebrow">{tr("Water Demand Index")}</p>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-xl font-bold font-display text-water">{tr(simWater)}%</span>
                </div>
                <p className="text-[0.65rem] text-muted-foreground mt-1">
                  {tr("Baseline crop requirement")}
                </p>
              </div>
            </div>

            {/* Simulated Alerts based on logical rule satisfaction */}
            <div className="space-y-2 mt-5">
              {hasNitrogenWarning && (
                <div className="rounded-lg border border-critical bg-critical/10 p-3 text-xs text-critical flex items-start gap-2 animate-pulse-soft">
                  <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      {tr("Excessive Nitrogen Warning (Rule #063):")}
                    </span>
                    <p className="mt-0.5 text-[0.7rem] leading-normal text-muted-foreground">
                      {tr(
                        "Applied N exceeds vegetative threshold. Risk of leaf burn and suppressed yield regression.",
                      )}
                    </p>
                  </div>
                </div>
              )}

              {hasDiseaseWarning && (
                <div className="rounded-lg border border-warning bg-warning/10 p-3 text-xs text-warning flex items-start gap-2">
                  <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{tr("Fungal Disease Window (Rule #018):")}</span>
                    <p className="mt-0.5 text-[0.7rem] leading-normal text-muted-foreground">
                      {tr("Microclimate parameters (humidity")} {tr(humidity)}
                      {tr("%) favour fungal proliferation. Early blight risk is high.")}
                    </p>
                  </div>
                </div>
              )}

              {hasPhWarning && (
                <div className="rounded-lg border border-warning/50 bg-warning/5 p-3 text-xs text-muted-foreground flex items-start gap-2">
                  <ShieldAlert className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">{tr("Soil pH Boundary Out of Bounds:")}</span>
                    <p className="mt-0.5 text-[0.7rem] leading-normal">
                      {tr(
                        "Soil acidity levels inhibit root nutrient uptake for sensitive crop roots.",
                      )}
                    </p>
                  </div>
                </div>
              )}

              {!hasNitrogenWarning && !hasDiseaseWarning && !hasPhWarning && (
                <div className="rounded-lg border border-healthy/40 bg-healthy/10 p-3 text-xs text-healthy flex items-center gap-2">
                  <Sparkles className="size-4 shrink-0" />
                  <p className="text-[0.7rem] font-medium">
                    {tr("All constraints satisfied. Simulated metrics within stable bands.")}
                  </p>
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>

      <Panel eyebrow={tr("Comparison Matrix")} title={tr("Saved Scenarios Evaluator")}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-xs">{tr("Scenario Name")}</TableHead>
                <TableHead className="text-xs">{tr("N-Dosage")}</TableHead>
                <TableHead className="text-xs">{tr("Drip Adj")}</TableHead>
                <TableHead className="text-xs">{tr("Soil pH")}</TableHead>
                <TableHead className="text-xs">{tr("Yield")}</TableHead>
                <TableHead className="text-xs">{tr("Disease Risk")}</TableHead>
                <TableHead className="text-xs">{tr("Water Need")}</TableHead>
                <TableHead className="text-xs text-right">{tr("Net Profit")}</TableHead>
                <TableHead className="text-xs text-center">{tr("Action")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedScenarios.map((s) => (
                <TableRow key={s.id} className="border-border/60 hover:bg-muted/10">
                  <TableCell className="font-medium text-xs text-foreground">
                    {tr(s.name)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {s.nitrogen.toFixed(1)}
                    {tr("x")}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {s.irrigation > 0 ? `+${s.irrigation}` : tr(s.irrigation)}
                    {tr("m")}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{s.pH.toFixed(1)}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    {tr(s.yieldVal)} {tr("t/ac")}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className={s.riskVal > 65 ? "text-critical font-bold" : ""}>
                      {tr(s.riskVal)}%
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-water">{tr(s.waterVal)}%</TableCell>
                  <TableCell className="font-mono text-xs text-healthy font-semibold text-right">
                    ₹{s.profitVal.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-critical"
                      disabled={s.id === "baseline"}
                      onClick={() => handleDeleteScenario(s.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>

      <Disclaimer />
    </div>
  );
}
