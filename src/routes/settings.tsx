import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Settings,
  Sliders,
  ToggleLeft,
  ToggleRight,
  PlusCircle,
  HelpCircle,
  Save,
} from "lucide-react";
import { PageHeader, Panel, Chip, Disclaimer } from "@/components/agri/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { tr } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "System Settings — Cropify" },
      {
        name: "description",
        content:
          "Configure prototype thresholds, field telemetry stream flags, and admin settings.",
      },
    ],
  }),
  component: SettingsRoute,
});

interface CustomRule {
  id: string;
  name: string;
  condition: string;
  consequent: string;
}

function SettingsRoute() {
  const [fieldDataSourceActive, setFieldDataSourceActive] = useState(true);
  const [researchMode, setResearchMode] = useState(false);
  const [customRules, setCustomRules] = useState<CustomRule[]>([
    {
      id: "USER-RULE-001",
      name: "Late evening irrigation warning",
      condition: "Time > 18:00 AND Temp < 22°C",
      consequent: "Advise delay to prevent leaf wetness and fungal infection",
    },
  ]);

  // Form states for rule creator
  const [ruleName, setRuleName] = useState("");
  const [ruleCondition, setRuleCondition] = useState("Humidity > 85%");
  const [ruleConsequent, setRuleConsequent] = useState("");

  const handleFieldDataToggle = (checked: boolean) => {
    setFieldDataSourceActive(checked);
    if (checked) {
      toast.success(tr("Field Source Stream Connected"), {
        description: tr("Loaded calibrated Atharva Plot (Early Blight) telemetry sources."),
      });
    } else {
      toast.info(tr("Field Stream Paused"), {
        description: tr("Active digital twin context reset to manual entry."),
      });
    }
  };

  const handleResearchToggle = (checked: boolean) => {
    setResearchMode(checked);
    toast.info(checked ? tr("Research Mode Activated") : tr("Research Mode Deactivated"), {
      description: checked
        ? tr("Raw JSON payload inspect cards will now display on diagnostic interfaces.")
        : tr("Raw payloads hidden."),
    });
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim() || !ruleConsequent.trim()) {
      toast.error(tr("Please fill in rule name and consequent outcome."));
      return;
    }

    const newRule: CustomRule = {
      id: `USER-RULE-${(customRules.length + 1).toString().padStart(3, "0")}`,
      name: ruleName,
      condition: ruleCondition,
      consequent: ruleConsequent,
    };

    setCustomRules([...customRules, newRule]);
    setRuleName("");
    setRuleConsequent("");
    toast.success(tr(`Custom rule "${ruleName}" compiled successfully!`));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={tr("Configuration")}
        title={tr("Settings & Administration")}
        subtitle={tr(
          "Manage active prototype parameters, enable developer payloads, and configure manual expert rules for the symbolic guard layer.",
        )}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-6">
          <Panel eyebrow={tr("Prototype Toggles")} title={tr("Field Telemetry Sources")}>
            <div className="space-y-6 mt-4">
              <div className="flex items-center justify-between border-b border-border/20 pb-4">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-foreground">
                    {tr("Load Calibrated Field Source Stream")}
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-xs leading-normal">
                    {tr(
                      "Streams verified Atharva Plot (Multi-crop block with live telemetry & risk logs) data directly from field stations.",
                    )}
                  </p>
                </div>
                <Switch checked={fieldDataSourceActive} onCheckedChange={handleFieldDataToggle} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold text-foreground">
                    {tr("Enable Research Mode")}
                  </h4>
                  <p className="text-xs text-muted-foreground max-w-xs leading-normal">
                    {tr(
                      "Exposes raw tabular payloads, Cypher query logs, and execution latency benchmarks across dashboard modules.",
                    )}
                  </p>
                </div>
                <Switch checked={researchMode} onCheckedChange={handleResearchToggle} />
              </div>
            </div>
          </Panel>

          <Panel eyebrow={tr("Symbolic Heuristics")} title={tr("Add Custom Expert Rule")}>
            <form onSubmit={handleAddRule} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="ruleName">{tr("Rule Identifier Name")}</Label>
                <Input
                  id="ruleName"
                  placeholder={tr("e.g. Saturated soil root risk")}
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="text-xs bg-background/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ruleCond">{tr("IF Condition")}</Label>
                  <select
                    id="ruleCond"
                    value={ruleCondition}
                    onChange={(e) => setRuleCondition(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus:bg-background"
                  >
                    <option value="Humidity > 85%">{tr("Humidity > 85%")}</option>
                    <option value="pH < 5.5">{tr("pH < 5.5")}</option>
                    <option value="Temp > 35°C">{tr("Temp > 35°C")}</option>
                    <option value="Rainfall > 25mm">{tr("Rainfall > 25mm")}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ruleConsequent">{tr("THEN Outcome")}</Label>
                  <Input
                    id="ruleConsequent"
                    placeholder={tr("e.g. Raise disease risk score")}
                    value={ruleConsequent}
                    onChange={(e) => setRuleConsequent(e.target.value)}
                    className="text-xs bg-background/50"
                    required
                  />
                </div>
              </div>

              <Button type="submit" size="sm" className="w-full gap-2 mt-2">
                <PlusCircle className="size-4" /> {tr("Save Rule")}
              </Button>
            </form>
          </Panel>
        </div>

        <Panel eyebrow={tr("Expert Logic")} title={tr("Active Custom Rules Library")}>
          <div className="space-y-4 mt-2">
            {customRules.map((rule) => (
              <div
                key={rule.id}
                className="panel bg-background/30 p-4 border-border/40 space-y-2.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-mono font-bold text-primary">{tr(rule.id)}</span>
                  <Chip tone="healthy">{tr("Custom Rule")}</Chip>
                </div>
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                  {tr(rule.name)}
                </h4>
                <div className="space-y-1.5 pt-1 text-xs text-muted-foreground">
                  <p>
                    <span className="font-mono text-[0.6rem] text-primary uppercase mr-1.5">
                      {tr("IF:")}
                    </span>
                    {tr(rule.condition)}
                  </p>
                  <p>
                    <span className="font-mono text-[0.6rem] text-primary uppercase mr-1.5">
                      {tr("THEN:")}
                    </span>
                    <strong className="text-foreground">{tr(rule.consequent)}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
            <Settings className="size-4 text-primary shrink-0 mt-0.5" />
            <span>
              {tr(
                "Custom rules are parsed in real time by the mock compiler and injected into the constraint checking engine.",
              )}
            </span>
          </p>
        </Panel>
      </div>
      <Disclaimer />
    </div>
  );
}
