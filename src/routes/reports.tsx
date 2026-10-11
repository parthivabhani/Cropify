import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Download, RefreshCw, CheckSquare, AlertTriangle } from "lucide-react";
import { PageHeader, Panel, Disclaimer } from "@/components/agri/primitives";
import { farm } from "@/lib/agri-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Farm Intelligence Reports — AgriTwin" },
      { name: "description", content: "Generate research-grade agricultural diagnostic reports." },
    ],
  }),
  component: ReportsRoute,
});

const translations = {
  English: {
    ledger: "Research-Grade Diagnostic Ledger",
    profile: "1. Farm Twin Profile",
    crop: "Current Crop",
    growthStage: "Growth Stage",
    soil: "Soil loam",
    soilVal: "pH 6.2 · HIGH moisture",
    irrigation: "Irrigation method",
    scoresTitle: "2. Mapped Health & Risk Scores",
    compHealth: "Composite Health",
    predYield: "Predicted Yield",
    pathogenRisk: "Pathogen Risk",
    dataQuality: "Data Quality index",
    checklistTitle: "3. Diagnostic Recommendations Checklist",
    disclaimerTitle: "Scientific Responsibility Disclaimer:",
    disclaimerText:
      "The predictions and rule validations contained in this document are decision support heuristics generated dynamically via the AgriTwin diagnostic system. Validate chemical dosage recommendations against local extension guidelines prior to execution.",
    radarTitle: "Farm Diagnostic Telemetry Analysis (Zone comparison)",
  },
  Hindi: {
    ledger: "अनुसंधान-ग्रेड नैदानिक बहीखाता",
    profile: "1. फार्म ट्विन प्रोफाइल",
    crop: "वर्तमान फसल",
    growthStage: "विकास चरण",
    soil: "मिट्टी की स्थिति",
    soilVal: "pH 6.2 · उच्च (HIGH) नमी",
    irrigation: "सिंचाई प्रणाली",
    scoresTitle: "2. स्वास्थ्य और जोखिम स्कोर",
    compHealth: "समग्र स्वास्थ्य",
    predYield: "अनुमानित उपज",
    pathogenRisk: "रोगजनक जोखिम",
    dataQuality: "डेटा गुणवत्ता सूचकांक",
    checklistTitle: "3. नैदानिक सिफारिशें चेकलिस्ट",
    disclaimerTitle: "वैज्ञानिक जिम्मेदारी अस्वीकरण:",
    disclaimerText:
      "इस दस्तावेज़ में निहित भविष्यवाणियां और नियम सत्यापन एग्रीट्विन नैदानिक प्रणाली के माध्यम से गतिशील रूप से उत्पन्न निर्णय समर्थन हेयुरिस्टिक्स हैं। निष्पादन से पहले स्थानीय विस्तार दिशानिर्देशों के खिलाफ रासायनिक खुराक सिफारिशों को सत्यापित करें।",
    radarTitle: "कृषि निदान टेलीमेट्री विश्लेषण (ज़ोन तुलना)",
  },
  Marathi: {
    ledger: "संशोधन-दर्जाचे निदान बहीखाता",
    profile: "१. फार्म ट्विन प्रोफाइल",
    crop: "सध्याचे पीक",
    growthStage: "वाढीचा टप्पा",
    soil: "जमिनीची स्थिती",
    soilVal: "pH ६.२ · जास्त ओलावा",
    irrigation: "सिंचन पद्धत",
    scoresTitle: "२. आरोग्य आणि धोका गुण",
    compHealth: "एकूण आरोग्य",
    predYield: "अंदाजे उत्पन्न",
    pathogenRisk: "रोगकारक धोका",
    dataQuality: "माहिती गुणवत्ता निर्देशांक",
    checklistTitle: "३. निदान शिफारसी चेकलिस्ट",
    disclaimerTitle: "वैज्ञानिक जबाबदारी नाकारणे:",
    disclaimerText:
      "या दस्तऐव्हजामध्ये असलेले अंदाज आणि नियम प्रमाणीकरण हे अ‍ॅग्रीट्विन निदान प्रणालीद्वारे डायनॅमिकपणे व्युत्पन्न केलेले निर्णय समर्थन हेउरिस्टिक्स आहेत. अंमलबजावणीपूर्वी स्थानिक विस्तार मार्गदर्शक तत्त्वांविरूद्ध रासायनिक डोस शिफारसी सत्यापित करा.",
    radarTitle: "कृषी निदान टेलीमेट्री विश्लेषण (झोन तुलना)",
  },
  Hinglish: {
    ledger: "Research-Grade Diagnostic Ledger",
    profile: "1. Farm Twin Profile",
    crop: "Current Crop",
    growthStage: "Growth Stage",
    soil: "Soil loam",
    soilVal: "pH 6.2 · HIGH moisture",
    irrigation: "Irrigation method",
    scoresTitle: "2. Mapped Health & Risk Scores",
    compHealth: "Composite Health",
    predYield: "Predicted Yield",
    pathogenRisk: "Pathogen Risk",
    dataQuality: "Data Quality index",
    checklistTitle: "3. Diagnostic Recommendations Checklist",
    disclaimerTitle: "Scientific Responsibility Disclaimer:",
    disclaimerText:
      "The predictions and rule validations contained in this document are decision support heuristics generated dynamically via the AgriTwin diagnostic system. Validate chemical dosage recommendations against local extension guidelines prior to execution.",
    radarTitle: "Farm Diagnostic Telemetry Analysis (Zone comparison)",
  },
};

const recommendationsLang = {
  English: [
    {
      title: "Skip evening drip irrigation",
      reason: "Skip evening drip irrigation cycles to prevent waterlogging and root rot.",
      source: "RULE #027 (Saturated soil risk)",
    },
    {
      title: "Intensify scouting in Zone B1",
      reason: "Increase scouting frequency in Zone B1 due to high humidity and vegetative stage.",
      source: "RULE #018 (Early Blight risk)",
    },
    {
      title: "Calibrate nutrient formulation",
      reason: "Calibrate nutrient mix to raise nitrogen content by 8% in Zone B2.",
      source: "Telemetry feedback loop",
    },
  ],
  Hindi: [
    {
      title: "शाम की ड्रिप सिंचाई रोकें",
      reason: "जलभराव और जड़ सड़न से बचने के लिए शाम के ड्रिप सिंचाई चक्र को रोकें।",
      source: "नियम #027 (संतृप्त मिट्टी जोखिम)",
    },
    {
      title: "ज़ोन B1 में गहन निगरानी करें",
      reason:
        "उच्च आर्द्रता और वनस्पति चरण के कारण ज़ोन B1 में पत्तियों पर धब्बों की निगरानी बढ़ाएं।",
      source: "नियम #018 (अगेती झुलसा जोखिम)",
    },
    {
      title: "पोषक तत्वों के फार्मूलेशन को संतुलित करें",
      reason: "ज़ोन B2 में नाइट्रोजन की मात्रा को 8% तक बढ़ाने के लिए पोषक तत्वों को संतुलित करें।",
      source: "टेलीमेट्री फीडबैक लूप",
    },
  ],
  Marathi: [
    {
      title: "संध्याकाळचे ड्रिप सिंचन थांबवा",
      reason: "पाणी साठणे आणि मुळकुज होण्यापासून रोखण्यासाठी संध्याकाळचे ड्रिप सिंचन थांबवावे.",
      source: "नियम #०२७ (संतृप्त मातीचा धोका)",
    },
    {
      title: "झोन B१ मध्ये देखरेख वाढवा",
      reason: "जास्त दमटपणा आणि वाढीच्या टप्प्यामुळे झोन B१ मध्ये पानांवरील डाग तपासणे वाढवावे.",
      source: "नियम #०१८ (अर्ली ब्लाईटचा धोका)",
    },
    {
      title: "खत मिश्रण संतुलित करा",
      reason: "झोन B२ मध्ये नायट्रोजनचे प्रमाण ८% ने वाढवण्यासाठी खत मिश्रण संतुलित करावे.",
      source: "टेलीमेट्री फीडबॅक लूप",
    },
  ],
  Hinglish: [
    {
      title: "Skip evening drip irrigation",
      reason: "Satsurated soil aur root rot se bachne ke liye evening drip irrigation skip karein.",
      source: "RULE #027 (Saturated soil risk)",
    },
    {
      title: "Intensify scouting in Zone B1",
      reason:
        "High humidity aur vegetative growth stage ke chalte Zone B1 mein scouting badhayein.",
      source: "RULE #018 (Early Blight risk)",
    },
    {
      title: "Calibrate nutrient formulation",
      reason: "Zone B2 mein nitrogen intake badhane ke liye nutrient formulation calibrate karein.",
      source: "Telemetry feedback loop",
    },
  ],
};

const radarChartData = [
  { subject: "Soil Moisture", A: 85, B: 45, fullMark: 100 },
  { subject: "Nitrogen (N)", A: 78, B: 62, fullMark: 100 },
  { subject: "Phosphorus (P)", A: 90, B: 85, fullMark: 100 },
  { subject: "Potassium (K)", A: 65, B: 75, fullMark: 100 },
  { subject: "Fungal Risk", A: 38, B: 74, fullMark: 100 },
  { subject: "Chlorophyll", A: 82, B: 70, fullMark: 100 },
];

function ReportsRoute() {
  const [compiling, setCompiling] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportLang, setReportLang] = useState<"English" | "Hindi" | "Marathi" | "Hinglish">(
    "English",
  );

  const activeTrans = translations[reportLang];
  const activeRecs = recommendationsLang[reportLang];

  const handleGenerateReport = () => {
    setCompiling(true);
    setReportGenerated(false);

    setTimeout(() => {
      setCompiling(false);
      setReportGenerated(true);
      toast.success("Intelligence Report compiled successfully!", {
        description: "Aggregated farm twin data, weather feeds, and reasoning traces.",
      });
    }, 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-foreground">
      <div className="print:hidden">
        <PageHeader
          eyebrow="Reports Manager"
          title="Farm Intelligence Reports"
          subtitle="Compile localized farm twin profiles, climate telemetry, and neural diagnostic outcomes into research-grade reports."
          actions={
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">Report Language:</span>
                <select
                  value={reportLang}
                  onChange={(e) =>
                    setReportLang(e.target.value as "English" | "Hindi" | "Marathi" | "Hinglish")
                  }
                  className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus:bg-background text-foreground font-sans"
                >
                  <option value="English">English</option>
                  <option value="Hinglish">Hinglish</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Marathi">Marathi (मराठी)</option>
                </select>
              </div>

              <div className="flex gap-2">
                {!reportGenerated ? (
                  <Button
                    onClick={handleGenerateReport}
                    disabled={compiling}
                    className="gap-2 cursor-pointer"
                  >
                    {compiling ? (
                      <>
                        <RefreshCw className="size-4 animate-spin" /> Compiling Report...
                      </>
                    ) : (
                      <>
                        <FileText className="size-4" /> Generate Farm Report
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button onClick={handlePrint} className="gap-2 cursor-pointer">
                      <Download className="size-4" /> Download Report
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleGenerateReport}
                      disabled={compiling}
                      className="cursor-pointer"
                    >
                      Recompile
                    </Button>
                  </>
                )}
              </div>
            </div>
          }
        />
      </div>

      {!reportGenerated ? (
        <div className="print:hidden">
          <Panel
            title="Report Constructor"
            eyebrow="Status"
            className="py-20 text-center flex flex-col justify-center items-center"
          >
            <FileText className="size-12 text-muted-foreground/60 mb-4 animate-pulse-soft" />
            <h3 className="text-base font-semibold">No Report Compiled</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2 mb-6">
              Generate a research report to aggregate active farm twin profiles, weather history
              logs, and rule-satisfaction traces.
            </p>
            <Button onClick={handleGenerateReport} disabled={compiling} className="cursor-pointer">
              {compiling ? "Compiling..." : "Generate Farm Intelligence Report"}
            </Button>
          </Panel>
        </div>
      ) : (
        <div
          id="agritwin-report-pdf-capture"
          className="space-y-6 max-w-[900px] mx-auto bg-surface/50 border-2 border-primary rounded-2xl p-6 md:p-10 shadow-glow overflow-hidden relative"
        >
          {/* Neon Accent Glow strip at the top */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary/50 to-primary" />

          {/* Print Header */}
          <div className="flex justify-between items-start border-b border-primary/20 pb-6 print:border-black/20">
            <div>
              <span className="font-mono text-[0.65rem] text-primary tracking-widest uppercase font-bold">
                {activeTrans.ledger}
              </span>
              <h2 className="text-2xl font-bold font-display mt-1 text-foreground">{farm.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Coordinates: {farm.coordinates} · Nashik District, MH
              </p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p className="font-mono uppercase font-semibold text-primary">
                Report ID: AT-{Date.now().toString().slice(-6)}
              </p>
              <p className="mt-1">Compiled: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Section 1: Twin Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary border-b border-primary/25 pb-1.5">
              {activeTrans.profile}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs border border-primary/30 p-4 rounded-xl bg-primary/5">
              <div>
                <span className="text-muted-foreground block">{activeTrans.crop}</span>
                <span className="font-semibold text-foreground">
                  {farm.crop} ({farm.variety})
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">{activeTrans.growthStage}</span>
                <span className="font-semibold text-foreground">{farm.growthStage}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">{activeTrans.soil}</span>
                <span className="font-semibold text-foreground text-primary">
                  {activeTrans.soilVal}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">{activeTrans.irrigation}</span>
                <span className="font-semibold text-foreground">{farm.irrigation}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Health Indices */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary border-b border-primary/25 pb-1.5">
              {activeTrans.scoresTitle}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="panel bg-background/25 p-4 border border-primary/45 rounded-xl text-center shadow-[0_2px_10px_rgba(34,197,94,0.05)]">
                <span className="text-muted-foreground block">{activeTrans.compHealth}</span>
                <span className="text-xl font-bold font-display text-primary mt-1 block">
                  {farm.healthScore}/100
                </span>
              </div>
              <div className="panel bg-background/25 p-4 border border-primary/45 rounded-xl text-center shadow-[0_2px_10px_rgba(34,197,94,0.05)]">
                <span className="text-muted-foreground block">{activeTrans.predYield}</span>
                <span className="text-xl font-bold font-display text-foreground mt-1 block">
                  2.8 t/acre
                </span>
              </div>
              <div className="panel bg-background/25 p-4 border border-primary/45 rounded-xl text-center shadow-[0_2px_10px_rgba(34,197,94,0.05)]">
                <span className="text-muted-foreground block">{activeTrans.pathogenRisk}</span>
                <span className="text-xl font-bold font-display text-critical mt-1 block">
                  74/100
                </span>
              </div>
              <div className="panel bg-background/25 p-4 border border-primary/45 rounded-xl text-center shadow-[0_2px_10px_rgba(34,197,94,0.05)]">
                <span className="text-muted-foreground block">{activeTrans.dataQuality}</span>
                <span className="text-xl font-bold font-display text-warning mt-1 block">91%</span>
              </div>
            </div>
          </div>

          {/* Section 3: Diagnostic Radar Chart */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary border-b border-primary/25 pb-1.5">
              {activeTrans.radarTitle}
            </h3>
            <div className="panel bg-background/10 border border-primary/45 p-4 rounded-xl shadow-[0_2px_10px_rgba(34,197,94,0.05)] h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" r="80%" data={radarChartData}>
                  <PolarGrid stroke="var(--chart-grid)" />
                  <PolarAngleAxis dataKey="subject" stroke="var(--chart-axis)" fontSize={10} />
                  <PolarRadiusAxis stroke="var(--chart-axis)" fontSize={8} />
                  <Radar
                    name="North Block (A)"
                    dataKey="A"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.25}
                  />
                  <Radar
                    name="South Block (B)"
                    dataKey="B"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section 4: Diagnostic recommendations */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-primary border-b border-primary/25 pb-1.5">
              {activeTrans.checklistTitle}
            </h3>
            <ul className="space-y-3">
              {activeRecs.map((r, i) => (
                <li
                  key={i}
                  className="panel bg-background/15 border border-primary/35 p-4 rounded-xl flex items-start gap-3 shadow-[0_2px_10px_rgba(34,197,94,0.02)]"
                >
                  <CheckSquare className="size-4 text-primary mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">{r.title}</p>
                    <p className="text-[0.7rem] text-muted-foreground leading-normal">{r.reason}</p>
                    <div className="pt-1 flex items-center justify-between text-[0.6rem] text-muted-foreground">
                      <span>
                        Source: <strong className="text-primary">{r.source}</strong>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Print specific details / disclaimer */}
          <div className="border-t border-primary/20 pt-6 mt-8 space-y-4">
            <div className="rounded-lg border border-warning/40 bg-warning/5 p-4 flex gap-2 text-[0.7rem] text-muted-foreground">
              <AlertTriangle className="size-4 text-warning shrink-0" />
              <p>
                <strong className="text-warning">{activeTrans.disclaimerTitle}</strong>{" "}
                {activeTrans.disclaimerText}
              </p>
            </div>
            <Disclaimer />
          </div>
        </div>
      )}
    </div>
  );
}
