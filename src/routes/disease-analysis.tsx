import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Upload,
  Camera,
  Mic,
  Play,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  Droplets,
  Layers,
  Thermometer,
} from "lucide-react";
import { LeafScan } from "@/components/agri/leaf-scan";
import { PageHeader, Panel, Chip, SourceBadge, Disclaimer } from "@/components/agri/primitives";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/disease-analysis")({
  head: () => ({
    meta: [
      { title: "Disease Doctor — Cropify Computer Vision Lab" },
      {
        name: "description",
        content:
          "In-situ leaf pathology detection combining YOLO lesion locator and EfficientNet-B4 with symbolic rule validation.",
      },
    ],
  }),
  component: DiseaseAnalysis,
});

const sampleImages = [
  {
    id: "sample-blight",
    title: "Field Sample #1 • Early Blight Cluster",
    crop: "Tomato Atharva-8021",
    pathogen: "Alternaria solani",
    severity: "Moderate (15.4% canopy area)",
    rawConfidence: 82,
    bayesianConfidence: 91,

    location: "Nashik Plot B-03",
    humidity: "91% RH (High Spore Window)",
    ruleAction:
      "Rule #027 Triggered: Fungal sporulation alert. Halt excessive nitrogen, apply Mancozeb 2.5g/L.",
    lesions: [
      { x: 402, y: 227, r: 16, label: "Concentric lesion 84%" },
      { x: 309, y: 420, r: 13, label: "Target spot 79%" },
      { x: 676, y: 126, r: 14, label: "Ringed lesion 88%" },
    ],
  },
  {
    id: "sample-healthy",
    title: "Field Sample #2 • Healthy Vegetative Canopy",
    crop: "Tomato Atharva-8021",
    pathogen: "None (Healthy Tissue)",
    severity: "0% Lesion Density",
    rawConfidence: 96,
    bayesianConfidence: 98,

    location: "Nashik Plot A-14",
    humidity: "62% RH (Normal)",
    ruleAction: "All Symbolic Constraints Passed: Continue vegetative drip irrigation schedule.",
    lesions: [],
  },
];

function DiseaseAnalysis() {
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [voiceDesc, setVoiceDesc] = useState(
    "Lower canopy tomato foliage exhibits circular brown concentric lesions with chlorotic yellow halo margins.",
  );

  const activeSample = sampleImages[activeSampleIndex] ?? sampleImages[0]!;

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setShowResults(false);
    toast.info("Running YOLO v8 lesion locator & EfficientNet-B4 pipeline...");

    setTimeout(() => {
      setAnalyzing(false);
      setShowResults(true);
      toast.success("Pathology diagnosis synchronized with microclimate telemetry!");
    }, 1800);
  };

  return (
    <div className="animate-rise pb-8 space-y-10">
      <PageHeader
        eyebrow="Leaf pathology · Nashik tomato trial"
        title="Disease Doctor"
        subtitle="Scan a leaf photo for early blight, late blight and leaf miner. The vision model's guess is re-weighted with field humidity and checked against spray rules before any advice goes out."
      />

      {/* 2. MAIN WORKBENCH: PHOTO VIEWER & REAL-TIME DIAGNOSIS */}
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {/* Diagnostic Viewport Panel */}
          <div className="glass-card rounded-3xl p-6 border border-border/80 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="label-eyebrow text-primary">In-Situ Scouting Imagery</p>
                <h3 className="font-display font-bold text-lg text-foreground mt-0.5">
                  {activeSample.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">
                  Select Field Sample:
                </span>
                <div className="flex gap-1.5">
                  {sampleImages.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveSampleIndex(idx);
                        setShowResults(true);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                        activeSampleIndex === idx
                          ? "bg-primary text-primary-foreground font-semibold shadow-md"
                          : "bg-surface-2 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Sample #{idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Leaf specimen with detector boxes drawn in the same coordinate space */}
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-[#0f2219]">
              <LeafScan
                lesions={activeSample.lesions}
                showBoxes={showResults}
                scanning={analyzing}
                className="block h-auto w-full"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-black/45 px-3 py-1 text-[0.7rem] font-medium text-white backdrop-blur-md">
                  {activeSample.location}
                </span>
                <span className="rounded-full bg-black/45 px-3 py-1 text-[0.7rem] font-medium text-[#e9b14d] backdrop-blur-md">
                  {activeSample.humidity}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-display font-medium">{activeSample.crop}</span>
              <span className="text-muted-foreground">
                Target:{" "}
                <span className="font-medium text-foreground italic">{activeSample.pathogen}</span>
              </span>
            </div>

            {/* Diagnostic Control Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleRunAnalysis}
                  disabled={analyzing}
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 text-xs gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="size-3.5 animate-spin" />
                      <span>Classifying Lesions...</span>
                    </>
                  ) : (
                    <>
                      <Play className="size-3.5" />
                      <span>Re-Run Vision Classifier</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info("Opening local camera feed or file upload dialog...")}
                  className="rounded-full border-border/80 hover:bg-surface-2 text-xs gap-1.5 cursor-pointer"
                >
                  <Camera className="size-3.5 text-primary" />
                  <span>Upload Custom Photo</span>
                </Button>
              </div>

              <span className="font-mono text-[0.7rem] text-muted-foreground uppercase">
                Model: YOLOv8 + EfficientNet-B4
              </span>
            </div>
          </div>

          {/* Multimodal Natural Description & Voice Input */}
          <div className="glass-card rounded-2xl p-6 border border-border/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="label-eyebrow text-primary">Multimodal Agronomist Input</p>
                <h4 className="font-display font-bold text-sm text-foreground mt-0.5">
                  Voice Dictation & Symptom Description
                </h4>
              </div>
              <span className="text-[0.65rem] font-mono text-muted-foreground px-2 py-0.5 rounded bg-surface-2">
                Whisper Audio Engine
              </span>
            </div>

            <Textarea
              value={voiceDesc}
              onChange={(e) => setVoiceDesc(e.target.value)}
              placeholder="Describe leaf symptoms verbally or via text..."
              className="h-24 bg-background/60 border-border/70 rounded-xl focus:bg-background transition-colors resize-none text-xs leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setVoiceDesc(
                    "Nashik farmer observation: Heavy 91% morning dew observed. Brown target lesions coalescing on third vegetative tier.",
                  );
                  toast.success("Field survey audio transcription loaded.");
                }}
                className="rounded-full text-xs gap-2 border-border/80 hover:bg-surface-2 cursor-pointer"
              >
                <Mic className="size-3.5 text-warning" />
                <span>Simulate Farmer Voice Dictation</span>
              </Button>
              <span className="text-[0.7rem] text-muted-foreground">
                Synthesized into ontology triples
              </span>
            </div>
          </div>
        </div>

        {/* 3. RIGHT OUTCOMES & REASONING SYNC */}
        <div className="space-y-6">
          {showResults && (
            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-border/80 space-y-6 animate-rise">
              <div className="flex items-center justify-between">
                <div>
                  <p className="label-eyebrow text-primary">Diagnostic Outcomes</p>
                  <h3 className="text-xl font-bold font-display text-foreground mt-1">
                    Pathogen Inference & Trace
                  </h3>
                </div>
                <Chip tone={activeSample.id === "sample-blight" ? "critical" : "healthy"}>
                  {activeSample.id === "sample-blight" ? "Action Required" : "Optimal Health"}
                </Chip>
              </div>

              {/* Confidence Comparison Matrix (Neural vs Bayesian Recalibration) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-surface/60 border border-border/60">
                  <span className="text-[0.65rem] font-mono uppercase text-muted-foreground block">
                    Raw Neural Vision
                  </span>
                  <span className="text-2xl font-bold font-display text-foreground mt-1 block">
                    {activeSample.rawConfidence}%
                  </span>
                  <span className="text-[0.68rem] text-muted-foreground">EfficientNet-B4</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/25">
                  <span className="text-[0.65rem] font-mono uppercase text-primary font-semibold block">
                    Bayesian Recalibrated
                  </span>
                  <span className="text-2xl font-bold font-display text-primary mt-1 block">
                    {activeSample.bayesianConfidence}%
                  </span>
                  <span className="text-[0.68rem] text-primary/80">+9% via 91% RH Telemetry</span>
                </div>
              </div>

              {/* Detailed Pathogen Attributes */}
              <div className="space-y-3 text-xs divide-y divide-border/40">
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Identified Pathogen</span>
                  <span className="font-semibold text-foreground italic">
                    {activeSample.pathogen}
                  </span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Lesion Severity Index</span>
                  <span className="font-semibold text-warning">{activeSample.severity}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Affected Farm Zone</span>
                  <span className="font-semibold text-foreground">{activeSample.location}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-muted-foreground">Crop Variety</span>
                  <span className="font-semibold text-foreground">{activeSample.crop}</span>
                </div>
              </div>

              {/* Agronomic Rule Safety Guard */}
              <div className="p-4 rounded-2xl bg-surface-2/60 border border-border/80 space-y-2">
                <div className="flex items-center gap-1.5 text-warning font-semibold text-xs">
                  <AlertTriangle className="size-4" />
                  <span>Symbolic Safety Override</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeSample.ruleAction}
                </p>
              </div>

              {/* Link to Reasoning Trace */}
              <Link
                to="/reasoning"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary/15 border border-primary/30 hover:bg-primary/25 text-primary px-5 py-3 text-xs font-semibold transition-all hover:scale-[1.01]"
              >
                <span>View Full Neuro-Symbolic Graph Trace</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          )}

          {/* Quick Guidance Box */}
          <div className="glass rounded-2xl p-5 border border-border/60 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-1.5 text-foreground font-semibold">
              <Info className="size-4 text-primary" />
              <span>Agronomic Validation Protocol</span>
            </div>
            <p className="leading-relaxed">
              In accordance with university field evaluations, visual symptoms are never evaluated
              in isolation. Every neural detection is conditioned on in-situ RS485 soil moisture and
              air relative humidity before issuing spray advisories.
            </p>
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}

export default DiseaseAnalysis;
