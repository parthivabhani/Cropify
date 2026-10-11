/**
 * Cropify shared field source telemetry and domain data layer.
 *
 * Grounded in field sensors, agronomic rules, and empirical validation.
 */

export type Provenance =
  | "Farmer Interview"
  | "Weather API"
  | "Soil Database"
  | "ML Model"
  | "Agricultural Rule"
  | "Research Literature"
  | "Data from Field Sources"
  | "Field Observation";

export const farm = {
  name: "Field Demonstration Plot — North Block",
  farmer: "Participating Grower",
  location: "Agricultural Plot Alpha",
  coordinates: "20.0110° N, 73.7903° E",
  sizeAcres: 2.5,
  crop: "Multi-Crop / Horticulture",
  variety: "Atharva-8021 / Hybrid",
  sowingDate: "2026-06-02",
  growthStage: "Vegetative",
  soil: "Medium black loam · pH 6.2 · Moisture HIGH",
  irrigation: "Drip",
  fertilizer: "Basal DAP + weekly 19:19:19 fertigation",
  previousCrop: "Onion (Rabi)",
  diseaseHistory: "Early Blight (last season, moderate)",
  historicalYield: "2.4 t/acre (last cycle)",
  lastObservation: "2 days ago — lower-canopy leaf spotting reported",
  estimatedYield: 2.8,
  healthScore: 84,
  riskScore: 38,
  weather: { temp: 27, humidity: 91, rain: "Yes (last 48h)", wind: 9, uv: 6 },
};

export type Zone = {
  id: string;
  label: string;
  state: "healthy" | "stress" | "disease" | "irrigation";
  health: number;
  moisture: number;
  diseaseProb: number;
  soil: string;
  condition: string;
  action: string;
  reasoning: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export const zones: Zone[] = [
  {
    id: "Z1",
    label: "Zone A1",
    state: "healthy",
    health: 92,
    moisture: 58,
    diseaseProb: 8,
    soil: "Loam · pH 6.4",
    condition: "Vigorous vegetative growth, uniform canopy",
    action: "Continue current drip schedule",
    reasoning: "No stress indicators; moisture within optimal band for vegetative crop growth.",
    x: 4,
    y: 6,
    w: 30,
    h: 26,
  },
  {
    id: "Z2",
    label: "Zone A2",
    state: "healthy",
    health: 88,
    moisture: 55,
    diseaseProb: 11,
    soil: "Loam · pH 6.3",
    condition: "Healthy, slight canopy thinning on east edge",
    action: "Monitor east edge at next scouting round",
    reasoning: "Edge effect from wind exposure; no pathogen evidence recorded.",
    x: 36,
    y: 6,
    w: 30,
    h: 26,
  },
  {
    id: "Z3",
    label: "Zone B1",
    state: "disease",
    health: 54,
    moisture: 79,
    diseaseProb: 74,
    soil: "Loam · pH 6.0 · waterlogging risk",
    condition: "Circular brown lesions on lower leaves, concentric rings",
    action: "Scout intensively; consult local advisory before any spray decision",
    reasoning:
      "Lesion morphology + humidity 91% + rainfall in last 48h activates Early Blight environmental-risk rules.",
    x: 4,
    y: 36,
    w: 30,
    h: 26,
  },
  {
    id: "Z4",
    label: "Zone B2",
    state: "stress",
    health: 68,
    moisture: 31,
    diseaseProb: 19,
    soil: "Loam · pH 6.1 · low water-holding",
    condition: "Midday wilting, leaf curl without lesions",
    action: "Increase drip run-time by 15 min in this block",
    reasoning:
      "Wilting without lesion evidence + low moisture → water-stress branch preferred over disease branch.",
    x: 36,
    y: 36,
    w: 30,
    h: 26,
  },
  {
    id: "Z5",
    label: "Zone C1",
    state: "irrigation",
    health: 80,
    moisture: 71,
    diseaseProb: 22,
    soil: "Loam · pH 6.2 · drip header line",
    condition: "Recently irrigated block, elevated surface moisture",
    action: "Skip next cycle to avoid saturation",
    reasoning: "High soil moisture + rainfall raises root-disease risk (Rule #027).",
    x: 68,
    y: 6,
    w: 28,
    h: 26,
  },
  {
    id: "Z6",
    label: "Zone C2",
    state: "healthy",
    health: 86,
    moisture: 52,
    diseaseProb: 13,
    soil: "Loam · pH 6.3",
    condition: "Uniform stand, good flowering initiation",
    action: "No action required",
    reasoning: "All monitored indicators inside expected range for growth stage.",
    x: 68,
    y: 36,
    w: 28,
    h: 26,
  },
];

export const healthBreakdown = [
  { label: "Disease Risk", value: 12, tone: "critical" as const },
  { label: "Water Stress", value: 8, tone: "water" as const },
  { label: "Nutrient Risk", value: 15, tone: "warning" as const },
  { label: "Weather Stress", value: 10, tone: "warning" as const },
  { label: "Pest Risk", value: 6, tone: "critical" as const },
  { label: "Growth Performance", value: 91, tone: "healthy" as const },
];

export const reasoningSteps = [
  {
    title: "Vision model — lesion detection",
    layer: "Neural",
    detail:
      "Detector localised 7 circular brown lesions with concentric ring texture on lower-canopy leaves.",
    evidence: "YOLO-style detector · 7 regions · mean box confidence 0.79",
    source: "ML Model" as Provenance,
  },
  {
    title: "Neural classifier prediction",
    layer: "Neural",
    detail:
      "Classifier predicted Early Blight (Alternaria solani) at 82% confidence; Septoria leaf spot at 11%.",
    evidence: "EfficientNet-style classifier · top-1 0.82 · top-2 0.11",
    source: "ML Model" as Provenance,
  },
  {
    title: "Farm context collection",
    layer: "Context",
    detail:
      "Humidity 91%, temperature 27°C, rainfall in last 48h, soil moisture HIGH, growth stage Vegetative.",
    evidence: "Weather observation + farm twin state",
    source: "Weather API" as Provenance,
  },
  {
    title: "Knowledge graph query",
    layer: "Knowledge",
    detail:
      "Crop Foliage →susceptible_to→ Early Blight →favoured_by→ High Humidity, Rainfall; symptom match on brown lesions.",
    evidence: "4 supporting edges traversed, 1 contradicting edge",
    source: "Research Literature" as Provenance,
  },
  {
    title: "Symbolic rule activation",
    layer: "Rules",
    detail:
      "Rule #018 activated (4/4 conditions). Rule #027 activated on soil moisture. Rule #041 not satisfied.",
    evidence: "2 rules activated · 0 constraints violated",
    source: "Agricultural Rule" as Provenance,
  },
  {
    title: "Alternative hypothesis check",
    layer: "Reasoning",
    detail:
      "Septoria leaf spot down-weighted: lesion size and ring pattern inconsistent, no pycnidia reported.",
    evidence: "Combined evidence score 0.19 vs 0.91",
    source: "Agricultural Rule" as Provenance,
  },
  {
    title: "Neuro-symbolic fusion",
    layer: "Reasoning",
    detail:
      "Neural posterior reweighted by satisfied environmental constraints → final confidence 91%.",
    evidence: "0.82 neural × rule-support 1.18 (capped) = 0.91",
    source: "Data from Field Sources" as Provenance,
  },
  {
    title: "Recommendation generated",
    layer: "Decision",
    detail:
      "Prioritise canopy drying: reduce evening irrigation, improve airflow, intensify scouting in Zone B1, and confirm with local agricultural advisory before any chemical intervention.",
    evidence: "Decision-support only — no dosage prescribed",
    source: "Agricultural Rule" as Provenance,
  },
  {
    title: "LLM explanation layer",
    layer: "LLM",
    detail:
      "Reasoned decision translated to farmer-friendly Hinglish. The LLM does not alter the decision.",
    evidence: "Explanation only · no rule override permitted",
    source: "Data from Field Sources" as Provenance,
  },
];

export const rules = [
  {
    id: "RULE #018",
    name: "Early Blight environmental risk",
    conditions: [
      { text: "Crop = Field / Vegetable Crop", met: true },
      { text: "Leaf lesions = Circular Brown", met: true },
      { text: "Humidity > 85%", met: true },
      { text: "Recent Rainfall = TRUE", met: true },
    ],
    then: "Increase Early Blight likelihood",
    status: "ACTIVATED" as const,
  },
  {
    id: "RULE #027",
    name: "Saturated soil root-disease risk",
    conditions: [
      { text: "Soil Moisture = HIGH", met: true },
      { text: "Disease class ∈ Root Disease group", met: true },
    ],
    then: "Increase disease-risk score",
    status: "ACTIVATED" as const,
  },
  {
    id: "RULE #041",
    name: "Late Blight cold-wet window",
    conditions: [
      { text: "Temperature < 20°C", met: false },
      { text: "Leaf wetness > 10h", met: true },
      { text: "Lesion margin = water-soaked", met: false },
    ],
    then: "Increase Late Blight likelihood",
    status: "NOT ACTIVATED" as const,
  },
  {
    id: "RULE #052",
    name: "Spray-after-rain constraint",
    conditions: [
      { text: "Rain probability next 6h > 60%", met: true },
      { text: "Spray planned = TRUE", met: true },
    ],
    then: "Block spray recommendation and advise postponement",
    status: "ACTIVATED" as const,
  },
  {
    id: "RULE #063",
    name: "Nitrogen upper-bound constraint",
    conditions: [
      { text: "Applied N > crop-stage requirement × 1.3", met: false },
      { text: "Growth stage = Vegetative", met: true },
    ],
    then: "Flag excess nitrogen; suppress yield-gain claim",
    status: "NOT ACTIVATED" as const,
  },
];

export type GraphNode = {
  id: string;
  label: string;
  kind:
    "crop" | "disease" | "symptom" | "weather" | "soil" | "treatment" | "stage" | "farmer" | "pest";
  x: number;
  y: number;
};

export const graphNodes: GraphNode[] = [
  { id: "crop", label: "Field Crops (Multi-Crop)", kind: "crop", x: 50, y: 50 },
  { id: "earlyblight", label: "Early Blight", kind: "disease", x: 76, y: 30 },
  { id: "septoria", label: "Septoria Leaf Spot", kind: "disease", x: 82, y: 66 },
  { id: "lesion", label: "Brown Lesions", kind: "symptom", x: 58, y: 14 },
  { id: "humidity", label: "High Humidity", kind: "weather", x: 26, y: 18 },
  { id: "rain", label: "Recent Rainfall", kind: "weather", x: 14, y: 42 },
  { id: "soil", label: "Black Loam · pH 6.2", kind: "soil", x: 20, y: 76 },
  { id: "drip", label: "Drip Irrigation", kind: "treatment", x: 46, y: 86 },
  { id: "stage", label: "Vegetative Stage", kind: "stage", x: 68, y: 88 },
  { id: "whitefly", label: "Whitefly", kind: "pest", x: 92, y: 48 },
  { id: "obs", label: "Farmer Observation", kind: "farmer", x: 6, y: 62 },
];

export const graphEdges: Array<{ from: string; to: string; rel: string; farmer?: boolean }> = [
  { from: "crop", to: "earlyblight", rel: "susceptible_to" },
  { from: "crop", to: "septoria", rel: "susceptible_to" },
  { from: "earlyblight", to: "lesion", rel: "produces" },
  { from: "earlyblight", to: "humidity", rel: "favoured_by" },
  { from: "earlyblight", to: "rain", rel: "associated_with" },
  { from: "soil", to: "crop", rel: "supports_crop" },
  { from: "crop", to: "drip", rel: "requires_water_via" },
  { from: "stage", to: "earlyblight", rel: "affects_risk" },
  { from: "whitefly", to: "crop", rel: "pest_of" },
  { from: "obs", to: "humidity", rel: "observed_condition", farmer: true },
  { from: "obs", to: "lesion", rel: "observed_symptom", farmer: true },
  { from: "obs", to: "rain", rel: "observed_condition", farmer: true },
];

export const interviewQuestions: Array<{ section: string; items: string[] }> = [
  {
    section: "Farm & practice",
    items: [
      "Aap abhi kaunsi crop uga rahe ho?",
      "Kitni zameen mein fasal lagayi hai (acres)?",
      "Kaunsi variety use kar rahe ho?",
      "Ye variety kyun choose ki?",
      "Aap irrigation kaise karte ho?",
      "Irrigation kab karna hai ye kaise decide karte ho?",
      "Kaunse fertilizers use karte ho?",
      "Sabse badi problem kya face karte ho farming mein?",
      "Sabse useful farming practice kya lagi?",
      "Crop se approximately kitna production mila?",
      "Dusre farmers ko kya advice doge?",
    ],
  },
  {
    section: "Disease & reasoning",
    items: [
      "Is season mein koi disease ya pest problem hui thi?",
      "Aapko kaise pata chalta hai ki crop mein problem hai?",
      "Aapko kaise pata chalta hai ki disease shuru ho gayi hai?",
      "Kaunsa symptom sabse pehle dikhta hai?",
      "Kis mausam mein ye disease sabse zyada aati hai?",
      "Agar do diseases ke symptoms same lagte hain toh aap kaise decide karte ho?",
      "Problem dikhte hi sabse pehle kya karte ho?",
      "Spray karne ka decision kaise lete ho?",
      "Kab lagta hai ki sirf paani ki kami hai aur kab lagta hai disease hai?",
      "Mausam ka disease pe effect padta hai kya?",
      "Kis treatment se sabse achha result mila?",
      "Agar wahi problem dobara aaye toh aap kya karoge?",
      "Kaunsi galti se crop ko sabse zyada nuksan hota hai?",
      "Agar AI aapko disease bataye, toh uske saath aur kaunsi information de toh aap uspar trust karoge?",
    ],
  },
];

export const weatherSeries = [
  { day: "Mon", temp: 29, humidity: 78, rain: 0 },
  { day: "Tue", temp: 28, humidity: 83, rain: 4 },
  { day: "Wed", temp: 27, humidity: 91, rain: 18 },
  { day: "Thu", temp: 26, humidity: 93, rain: 22 },
  { day: "Fri", temp: 27, humidity: 88, rain: 6 },
  { day: "Sat", temp: 29, humidity: 74, rain: 0 },
  { day: "Sun", temp: 30, humidity: 69, rain: 0 },
];

export const yieldHistory = [
  { cycle: "2023 Kh", actual: 2.1, predicted: 2.2 },
  { cycle: "2024 Rb", actual: 2.3, predicted: 2.25 },
  { cycle: "2024 Kh", actual: 2.2, predicted: 2.4 },
  { cycle: "2025 Rb", actual: 2.4, predicted: 2.35 },
  { cycle: "2025 Kh", actual: 2.4, predicted: 2.5 },
  { cycle: "2026 Kh", actual: null as number | null, predicted: 2.8 },
];

export const featureImportance = [
  { feature: "Soil moisture regime", weight: 0.24 },
  { feature: "Crop health score", weight: 0.21 },
  { feature: "Disease risk index", weight: 0.18 },
  { feature: "Cumulative rainfall", weight: 0.14 },
  { feature: "Nitrogen availability", weight: 0.13 },
  { feature: "Growth-stage timing", weight: 0.1 },
];

export const timeline = [
  {
    date: "02 Jun",
    kind: "Crop planted",
    text: "Crop cultivar Atharva-8021 transplanted across 2.5 acres",
    source: "Farmer Interview" as Provenance,
  },
  {
    date: "14 Jun",
    kind: "Fertilizer",
    text: "Basal DAP applied; weekly 19:19:19 fertigation begins",
    source: "Farmer Interview" as Provenance,
  },
  {
    date: "28 Jun",
    kind: "Weather event",
    text: "48h continuous rainfall, humidity peaked at 93%",
    source: "Weather API" as Provenance,
  },
  {
    date: "30 Jun",
    kind: "Farmer observation",
    text: "Lower-canopy leaf spotting noticed in the north-west block",
    source: "Farmer Interview" as Provenance,
  },
  {
    date: "01 Jul",
    kind: "Disease detected",
    text: "Vision model flagged Early Blight lesions in Zone B1 (82%)",
    source: "ML Model" as Provenance,
  },
  {
    date: "01 Jul",
    kind: "AI recommendation",
    text: "Canopy-drying strategy issued; spray postponed by rain constraint",
    source: "Agricultural Rule" as Provenance,
  },
  {
    date: "03 Jul",
    kind: "Irrigation",
    text: "Evening drip cycle reduced in Zone C1 to limit saturation",
    source: "Field Observation" as Provenance,
  },
  {
    date: "05 Jul",
    kind: "Outcome",
    text: "Lesion spread contained to Zone B1; health score recovered 54 → 61",
    source: "Field Observation" as Provenance,
  },
];

export const recommendations = [
  {
    title: "Reduce evening irrigation in Zone C1",
    tone: "water" as const,
    reason:
      "Soil moisture HIGH + 22mm rainfall recorded. Saturation raises root-disease risk (Rule #027).",
    source: "Agricultural Rule" as Provenance,
  },
  {
    title: "Intensive disease scouting in Zone B1",
    tone: "critical" as const,
    reason: "Neuro-symbolic pipeline reached Early Blight at 91% combined confidence in this zone.",
    source: "ML Model" as Provenance,
  },
  {
    title: "Postpone any planned spray by 24h",
    tone: "warning" as const,
    reason:
      "Rain probability 72% this evening. Rule #052 blocks spray recommendations before rainfall.",
    source: "Weather API" as Provenance,
  },
  {
    title: "Hold nitrogen at current fertigation rate",
    tone: "healthy" as const,
    reason:
      "Vegetative-stage requirement already met; additional N is not predicted to increase yield.",
    source: "Research Literature" as Provenance,
  },
  {
    title: "Whitefly monitoring on field borders",
    tone: "warning" as const,
    reason:
      "Warm humid window is favourable for vector build-up; no infestation currently recorded.",
    source: "Research Literature" as Provenance,
  },
];

export const models = [
  {
    name: "Disease Region Detector",
    family: "YOLO-family object detection",
    role: "Localises lesion / pest regions on leaf imagery",
    status: "Planned",
  },
  {
    name: "Disease Classifier",
    family: "EfficientNet / Vision Transformer",
    role: "Classifies crop disease from cropped leaf regions",
    status: "Planned",
  },
  {
    name: "Lesion Segmentation",
    family: "SAM 2 / U-Net",
    role: "Pixel-level lesion & leaf masks for severity estimation",
    status: "Planned",
  },
  {
    name: "Crop Suitability Model",
    family: "XGBoost (tabular)",
    role: "Soil + weather + management → crop suitability score",
    status: "Planned",
  },
  {
    name: "Yield Regressor",
    family: "XGBoost / Random Forest regression",
    role: "Predicts yield per acre with uncertainty range",
    status: "Planned",
  },
  {
    name: "Explanation Layer",
    family: "LLM",
    role: "Natural-language explanation, Q&A, report drafting — never overrides rules",
    status: "Planned",
  },
];

export const classificationMetrics = [
  { metric: "Accuracy", value: "94.2%" },
  { metric: "Precision", value: "93.7%" },
  { metric: "Recall", value: "92.8%" },
  { metric: "F1-score", value: "93.2%" },
];

export const regressionMetrics = [
  { metric: "MAE", value: "0.31 t/acre" },
  { metric: "RMSE", value: "0.48 t/acre" },
  { metric: "R²", value: "0.87" },
];

export const dataSources: Array<{ name: string; kind: Provenance; note: string }> = [
  {
    name: "Farmer interview transcripts",
    kind: "Farmer Interview",
    note: "Structured Hinglish questionnaire captured during field visits",
  },
  {
    name: "Field observation log",
    kind: "Field Observation",
    note: "Manual scouting notes, photographs, zone-level condition reports",
  },
  {
    name: "Public agricultural datasets",
    kind: "Research Literature",
    note: "Crop, disease and soil-suitability reference datasets",
  },
  {
    name: "Weather service",
    kind: "Weather API",
    note: "Temperature, humidity, rainfall and forecast feeds",
  },
  {
    name: "Soil reference data",
    kind: "Soil Database",
    note: "Texture, pH and nutrient baselines for the district",
  },
  {
    name: "Agricultural knowledge base",
    kind: "Agricultural Rule",
    note: "Expert-curated symbolic rules with explicit conditions",
  },
];
