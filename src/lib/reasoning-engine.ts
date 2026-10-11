// Deterministic neuro-symbolic decision engine used by the Reasoning page.
// The "neural" side is the classifier's probability vector; the symbolic side is a set of
// agronomy rules that re-weight those probabilities and veto unsafe actions.

export type LesionPattern = "concentric-brown" | "water-soaked" | "small-grey-spots" | "none";
export type SoilMoisture = "LOW" | "OPTIMAL" | "HIGH";
export type DiseaseClass = "earlyBlight" | "lateBlight" | "septoria" | "healthy";

export interface FieldInputs {
  lesionPattern: LesionPattern;
  lesionCount: number;
  neural: Record<DiseaseClass, number>; // classifier output, 0–1, sums to ~1
  humidity: number; // %
  temperature: number; // °C
  rainLast48h: boolean;
  rainNext6h: number; // % probability
  leafWetnessHours: number;
  soilMoisture: SoilMoisture;
  sprayPlanned: boolean;
  daysSinceLastSpray: number;
  appliedNitrogen: number; // kg/acre this stage
  stageNitrogenNeed: number; // kg/acre
}

export const diseaseLabel: Record<DiseaseClass, string> = {
  earlyBlight: "Early blight (Alternaria solani)",
  lateBlight: "Late blight (Phytophthora infestans)",
  septoria: "Septoria leaf spot",
  healthy: "Healthy tissue",
};

export interface RuleResult {
  id: string;
  name: string;
  conditions: { text: string; met: boolean }[];
  then: string;
  fired: boolean;
  effect: string;
}

export interface TraceStep {
  layer: "Neural" | "Context" | "Knowledge" | "Rules" | "Reasoning" | "Decision";
  title: string;
  result: string;
  detail: string;
}

export interface Decision {
  diagnosis: DiseaseClass;
  confidence: number; // 0–1
  neuralConfidence: number;
  severity: "None" | "Low" | "Moderate" | "High";
  actions: string[];
  blocked: { action: string; reason: string }[];
  farmerMessage: string;
}

export interface ReasoningResult {
  posterior: Record<DiseaseClass, number>;
  rules: RuleResult[];
  trace: TraceStep[];
  decision: Decision;
}

const pct = (v: number) => `${Math.round(v * 100)}%`;
const classes: DiseaseClass[] = ["earlyBlight", "lateBlight", "septoria", "healthy"];

function top(probs: Record<DiseaseClass, number>): [DiseaseClass, number] {
  return classes.reduce<[DiseaseClass, number]>(
    (best, c) => (probs[c] > best[1] ? [c, probs[c]] : best),
    ["healthy", -1],
  );
}

export function runReasoning(f: FieldInputs): ReasoningResult {
  const weights: Record<DiseaseClass, number> = {
    earlyBlight: 1,
    lateBlight: 1,
    septoria: 1,
    healthy: 1,
  };

  const rule = (
    id: string,
    name: string,
    conditions: { text: string; met: boolean }[],
    then: string,
    effect: string,
    apply: () => void,
  ): RuleResult => {
    const fired = conditions.every((c) => c.met);
    if (fired) apply();
    return { id, name, conditions, then, fired, effect: fired ? effect : "No effect" };
  };

  const sprayIntervalDays = 7;
  const nLimit = f.stageNitrogenNeed * 1.3;

  const rules: RuleResult[] = [
    rule(
      "R-018",
      "Early blight weather window",
      [
        {
          text: "Lesions are circular brown with rings",
          met: f.lesionPattern === "concentric-brown",
        },
        { text: `Humidity > 85% (now ${f.humidity}%)`, met: f.humidity > 85 },
        { text: "Rain in the last 48 h", met: f.rainLast48h },
        {
          text: `Temperature 20–30 °C (now ${f.temperature} °C)`,
          met: f.temperature >= 20 && f.temperature <= 30,
        },
      ],
      "Raise early blight likelihood",
      "Early blight × 1.35",
      () => (weights.earlyBlight *= 1.35),
    ),
    rule(
      "R-041",
      "Late blight cold–wet window",
      [
        { text: `Temperature < 20 °C (now ${f.temperature} °C)`, met: f.temperature < 20 },
        { text: `Leaf wetness > 10 h (now ${f.leafWetnessHours} h)`, met: f.leafWetnessHours > 10 },
        { text: "Lesion margins are water-soaked", met: f.lesionPattern === "water-soaked" },
      ],
      "Raise late blight likelihood",
      "Late blight × 1.6",
      () => (weights.lateBlight *= 1.6),
    ),
    rule(
      "R-033",
      "Septoria pattern check",
      [
        { text: "Lesions lack concentric rings", met: f.lesionPattern !== "concentric-brown" },
        { text: "Spots are small and grey-centred", met: f.lesionPattern === "small-grey-spots" },
      ],
      "Keep septoria as a live hypothesis",
      "Septoria × 1.4",
      () => (weights.septoria *= 1.4),
    ),
    rule(
      "R-027",
      "Saturated canopy fungal risk",
      [
        { text: "Soil moisture is HIGH", met: f.soilMoisture === "HIGH" },
        { text: `Humidity > 80% (now ${f.humidity}%)`, met: f.humidity > 80 },
      ],
      "Raise all fungal disease risk; cut irrigation",
      "Fungal classes × 1.1, healthy × 0.85",
      () => {
        weights.earlyBlight *= 1.1;
        weights.lateBlight *= 1.1;
        weights.septoria *= 1.1;
        weights.healthy *= 0.85;
      },
    ),
    rule(
      "R-052",
      "No spraying before rain",
      [
        { text: "A spray is planned", met: f.sprayPlanned },
        { text: `Rain chance next 6 h > 60% (now ${f.rainNext6h}%)`, met: f.rainNext6h > 60 },
      ],
      "Block spraying; it would wash off",
      "Veto: spray",
      () => {},
    ),
    rule(
      "R-058",
      "Minimum spray interval",
      [
        { text: "A spray is planned", met: f.sprayPlanned },
        {
          text: `Last spray < ${sprayIntervalDays} days ago (was ${f.daysSinceLastSpray} d)`,
          met: f.daysSinceLastSpray < sprayIntervalDays,
        },
      ],
      "Block repeat spraying inside the interval",
      "Veto: spray",
      () => {},
    ),
    rule(
      "R-063",
      "Nitrogen upper bound",
      [
        {
          text: `Applied N > 1.3 × stage need (${f.appliedNitrogen} vs ${nLimit.toFixed(0)} kg/acre)`,
          met: f.appliedNitrogen > nLimit,
        },
      ],
      "Hold further nitrogen; soft growth favours leaf disease",
      "Veto: nitrogen top-dress",
      () => {},
    ),
  ];

  // Fuse: re-weight the classifier's probabilities, then renormalise.
  const raw = classes.map((c) => f.neural[c] * weights[c]);
  const total = raw.reduce((a, b) => a + b, 0) || 1;
  const posterior = Object.fromEntries(classes.map((c, i) => [c, raw[i]! / total])) as Record<
    DiseaseClass,
    number
  >;

  const [neuralTop, neuralConf] = top(f.neural);
  const [diagnosis, confidence] = top(posterior);
  const fired = rules.filter((r) => r.fired);
  const fired052 = fired.some((r) => r.id === "R-052");
  const fired058 = fired.some((r) => r.id === "R-058");
  const fired063 = fired.some((r) => r.id === "R-063");
  const fired027 = fired.some((r) => r.id === "R-027");

  const severity: Decision["severity"] =
    diagnosis === "healthy"
      ? "None"
      : f.lesionCount >= 10 || (diagnosis === "lateBlight" && confidence > 0.6)
        ? "High"
        : f.lesionCount >= 4
          ? "Moderate"
          : "Low";

  const actions: string[] = [];
  const blocked: Decision["blocked"] = [];
  const sprayAllowed = !fired052 && !fired058;

  if (diagnosis === "healthy") {
    actions.push("No disease treatment needed — continue the current drip schedule.");
    actions.push("Scout the lower canopy again in 3–4 days.");
  } else {
    const spray =
      diagnosis === "lateBlight"
        ? "Spray metalaxyl + mancozeb (2.5 g/L), covering both leaf surfaces"
        : diagnosis === "earlyBlight"
          ? "Spray mancozeb 2.5 g/L or chlorothalonil 2 g/L on affected rows"
          : "Spray copper oxychloride 3 g/L on affected rows";
    actions.push("Remove and destroy infected lower leaves; don't compost them.");
    if (diagnosis === "lateBlight")
      actions.push("Check neighbouring rows today — late blight spreads within days.");
    if (fired027)
      actions.push("Skip tonight's irrigation and water only in the morning until humidity drops.");
    actions.push("Open up the canopy (prune suckers) to improve airflow.");
    if (sprayAllowed) actions.push(`${spray}.`);
    if (fired052)
      blocked.push({
        action: spray,
        reason: `R-052: ${f.rainNext6h}% chance of rain in the next 6 h — wait for a dry window.`,
      });
    if (fired058)
      blocked.push({
        action: spray,
        reason: `R-058: last spray was ${f.daysSinceLastSpray} d ago — wait ${sprayIntervalDays - f.daysSinceLastSpray} more day(s).`,
      });
  }
  if (fired063)
    blocked.push({
      action: "Nitrogen top-dress",
      reason: `R-063: ${f.appliedNitrogen} kg/acre already applied, above the ${nLimit.toFixed(0)} kg/acre ceiling.`,
    });

  const shortName =
    diagnosis === "healthy"
      ? "koi bimari nahi"
      : diagnosis === "earlyBlight"
        ? "early blight"
        : diagnosis === "lateBlight"
          ? "late blight"
          : "septoria leaf spot";
  const farmerMessage =
    diagnosis === "healthy"
      ? "Patte swasth hain. Abhi koi dawai ki zarurat nahi — pani ka schedule waise hi rakhein."
      : `Patton par ${shortName} ke lakshan hain (${pct(confidence)} bharosa). Neeche ke bimar patte tod kar nasht karein.` +
        (sprayAllowed
          ? " Aaj spray kar sakte hain."
          : fired052
            ? " Abhi spray na karein — baarish aane wali hai."
            : " Abhi spray na karein — pichhla spray bahut haal hi mein hua hai.");

  const kgEdges =
    (f.lesionPattern !== "none" ? 1 : 0) +
    (f.humidity > 85 ? 1 : 0) +
    (f.rainLast48h ? 1 : 0) +
    (f.temperature < 20 ? 1 : 0) +
    1;

  const sortedNeural = [...classes].sort((a, b) => f.neural[b] - f.neural[a]);
  const second = sortedNeural[1]!;

  const trace: TraceStep[] = [
    {
      layer: "Neural",
      title: "Lesion detector",
      result: f.lesionCount ? `${f.lesionCount} lesions` : "No lesions",
      detail:
        f.lesionPattern === "none"
          ? "No lesion regions found on the scanned leaves."
          : `Found ${f.lesionCount} regions; pattern: ${f.lesionPattern.replace(/-/g, " ")}.`,
    },
    {
      layer: "Neural",
      title: "Leaf classifier",
      result: `${diseaseLabel[neuralTop].split(" (")[0]} ${pct(neuralConf)}`,
      detail: `Top guess ${diseaseLabel[neuralTop]} at ${pct(neuralConf)}; runner-up ${diseaseLabel[second]} at ${pct(f.neural[second])}.`,
    },
    {
      layer: "Context",
      title: "Field conditions",
      result: `${f.humidity}% RH · ${f.temperature} °C`,
      detail: `Rain last 48 h: ${f.rainLast48h ? "yes" : "no"} · rain chance next 6 h: ${f.rainNext6h}% · leaf wetness ${f.leafWetnessHours} h · soil ${f.soilMoisture.toLowerCase()}.`,
    },
    {
      layer: "Knowledge",
      title: "Knowledge graph lookup",
      result: `${kgEdges} supporting links`,
      detail: "Matched symptoms and weather against crop → disease → favoured_by relations.",
    },
    {
      layer: "Rules",
      title: "Rule evaluation",
      result: `${fired.length} of ${rules.length} fired`,
      detail: fired.length
        ? fired.map((r) => `${r.id} (${r.effect})`).join(" · ")
        : "No rule conditions were fully met.",
    },
    {
      layer: "Reasoning",
      title: "Fusion",
      result: `${pct(neuralConf)} → ${pct(confidence)}`,
      detail:
        neuralTop === diagnosis
          ? `Rules ${confidence >= neuralConf ? "strengthened" : "weakened"} the classifier's top guess after re-weighting and normalising.`
          : `Rules overturned the classifier: ${diseaseLabel[neuralTop]} → ${diseaseLabel[diagnosis]}.`,
    },
    {
      layer: "Decision",
      title: "Safety vetoes",
      result: blocked.length ? `${blocked.length} blocked` : "None",
      detail: blocked.length
        ? blocked.map((b) => b.reason).join(" ")
        : "No proposed action conflicts with a constraint.",
    },
  ];

  return {
    posterior,
    rules,
    trace,
    decision: {
      diagnosis,
      confidence,
      neuralConfidence: neuralConf,
      severity,
      actions,
      blocked,
      farmerMessage,
    },
  };
}

export const scenarioPresets: { id: string; label: string; note: string; inputs: FieldInputs }[] = [
  {
    id: "humid-week",
    label: "Humid monsoon week",
    note: "Ringed brown spots after two days of rain; spray planned but more rain coming.",
    inputs: {
      lesionPattern: "concentric-brown",
      lesionCount: 7,
      neural: { earlyBlight: 0.62, lateBlight: 0.08, septoria: 0.18, healthy: 0.12 },
      humidity: 91,
      temperature: 27,
      rainLast48h: true,
      rainNext6h: 70,
      leafWetnessHours: 9,
      soilMoisture: "HIGH",
      sprayPlanned: true,
      daysSinceLastSpray: 9,
      appliedNitrogen: 48,
      stageNitrogenNeed: 40,
    },
  },
  {
    id: "cold-night",
    label: "Cold, wet nights",
    note: "Water-soaked patches; the classifier leans early blight but conditions say otherwise.",
    inputs: {
      lesionPattern: "water-soaked",
      lesionCount: 5,
      neural: { earlyBlight: 0.44, lateBlight: 0.38, septoria: 0.08, healthy: 0.1 },
      humidity: 94,
      temperature: 16,
      rainLast48h: true,
      rainNext6h: 20,
      leafWetnessHours: 13,
      soilMoisture: "OPTIMAL",
      sprayPlanned: true,
      daysSinceLastSpray: 4,
      appliedNitrogen: 35,
      stageNitrogenNeed: 40,
    },
  },
  {
    id: "dry-healthy",
    label: "Dry, healthy canopy",
    note: "Clear weather and clean leaves.",
    inputs: {
      lesionPattern: "none",
      lesionCount: 0,
      neural: { earlyBlight: 0.05, lateBlight: 0.02, septoria: 0.03, healthy: 0.9 },
      humidity: 58,
      temperature: 29,
      rainLast48h: false,
      rainNext6h: 5,
      leafWetnessHours: 2,
      soilMoisture: "OPTIMAL",
      sprayPlanned: false,
      daysSinceLastSpray: 14,
      appliedNitrogen: 38,
      stageNitrogenNeed: 40,
    },
  },
];
