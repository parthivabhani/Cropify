import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  MapPin,
  CheckCircle2,
  Filter,
  Maximize2,
  X,
  FileCheck,
  Smartphone,
  Users,
  Compass,
  Sprout,
  Droplets,
  ShieldCheck,
} from "lucide-react";
import { Chip, PageHeader } from "@/components/agri/primitives";
import { tr } from "@/lib/i18n";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Student Research & Field Evidence — Cropify" },
      {
        name: "description",
        content:
          "Empirical photographic proof of on-site farmer interviews, mobile crop diagnostics testing, and agricultural infrastructure scouting conducted by the student research team in Maharashtra.",
      },
    ],
  }),
  component: StudentResearchPage,
});

interface ResearchPhoto {
  id: string;
  category: "interviews" | "testing" | "infrastructure";
  title: string;
  location: string;
  region: string;
  image: string;
  tag: string;
  tagTone: "healthy" | "warning" | "water" | "symbolic";
  summary: string;
  methodology: string;
  verificationStatus: string;
}

export function StudentResearchPage() {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "interviews" | "testing" | "infrastructure"
  >("all");
  const [selectedPhoto, setSelectedPhoto] = useState<ResearchPhoto | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling and handle Escape key when photo lightbox is open
  useEffect(() => {
    if (!selectedPhoto) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPhoto(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPhoto]);

  const photos: ResearchPhoto[] = [
    {
      id: "photo-1",
      category: "interviews",
      title: "Geotagged Farmer Field Interview",
      location: "Field Trial Site (GPS Geotag)",
      region: "GPS Map Camera Geotag: 6V3M+8MP",
      image: "/research/selu_farmer_interview_geotag.png",
      tag: "Farmer Interview",
      tagTone: "healthy",
      summary:
        "Student researcher conducting direct farmer interviews in the field with official GPS camera verification, capturing ground-truth disease occurrences and local farming practices.",
      methodology:
        "Semi-structured agronomic interview documenting crop pest history, irrigation schedules, and localized fertilizer applications directly with local growers.",
      verificationStatus: "GPS Geotag Verified",
    },
    {
      id: "photo-2",
      category: "testing",
      title: "In-Field Mobile Crop Diagnostics Testing",
      location: "Crop Field Plot, Maharashtra",
      region: "Vegetative Canopy Row A-14",
      image: "/research/student_field_testing.png",
      tag: "App Field Testing",
      tagTone: "healthy",
      summary:
        "Student research team testing mobile diagnostic workflows and computer vision leaf inference directly within actual crop rows to evaluate real-world daylight and camera angle robustness.",
      methodology:
        "Benchmarking mobile YOLO lesion detection on natural foliage against physical agronomist leaf scouting observations under field sunlight.",
      verificationStatus: "In-Situ Field Tested",
    },
    {
      id: "photo-3",
      category: "interviews",
      title: "Agronomist & Farmer Field Survey Notes",
      location: "Rural Farmland, Maharashtra",
      region: "Agricultural Field Plot",
      image: "/research/farmer_field_survey.png",
      tag: "Field Survey",
      tagTone: "healthy",
      summary:
        "On-site collaborative fieldwork documenting farmer questions, vernacular Hinglish phrasing, and local irrigation timings to build the domain ontology for the Kisan Assistant.",
      methodology:
        "Qualitative farmer field survey capturing local spray terminology, traditional disease indicators, and seasonal crop rotation cycles.",
      verificationStatus: "Survey Verified",
    },
    {
      id: "photo-4",
      category: "infrastructure",
      title: "Irrigation Well & Hydrological Source Mapping",
      location: "Farm Water Resource Zone",
      region: "Open-Well Irrigation Canal",
      image: "/research/field_irrigation_well.png",
      tag: "Water Telemetry",
      tagTone: "water",
      summary:
        "Detailed inspection of farm water storage and open-well irrigation sources to calibrate root-zone moisture recharge models and deficit irrigation schedules.",
      methodology:
        "Hydrological source assessment to determine salinity baseline, pump discharge capacity, and evaporation loss parameters for the digital twin.",
      verificationStatus: "Hydrology Audited",
    },
    {
      id: "photo-5",
      category: "infrastructure",
      title: "Crop Plot Canopy & Microclimate Scouting",
      location: "North Canopy Plot",
      region: "Crop Architecture Zone",
      image: "/research/field_orchard_plot.png",
      tag: "Canopy Scouting",
      tagTone: "healthy",
      summary:
        "Evaluating crop canopy architecture and spacing to establish boundary parameters for relative humidity traps that trigger fungal sporulation.",
      methodology:
        "Spatial canopy density evaluation measuring row spacing and leaf area distribution for microclimate humidity mapping.",
      verificationStatus: "Canopy Verified",
    },
    {
      id: "photo-6",
      category: "testing",
      title: "Crop Foliage & Soil Health Inspection",
      location: "Field Inspection Plot",
      region: "Ground-Truth Verification Line",
      image: "/research/crop_health_inspection.png",
      tag: "Foliage Inspection",
      tagTone: "healthy",
      summary:
        "Physical inspection of vegetative foliage and soil texture to benchmark symbolic reasoning recommendations against traditional agronomist recommendations.",
      methodology:
        "Close-up inspection of lower-canopy foliage for early pathogen symptoms, chlorosis, and soil crusting characteristics.",
      verificationStatus: "Agronomic Proof",
    },
    {
      id: "photo-7",
      category: "infrastructure",
      title: "Farmland Border & Agro-Ecological Plot",
      location: "Maharashtra Farmland Basin",
      region: "Field Plot Landscape",
      image: "/research/farmland_pasture_landscape.png",
      tag: "Agro-Ecosystem",
      tagTone: "symbolic",
      summary:
        "Landscape-scale agro-ecological boundary inspection evaluating windbreaks, microclimate variation, and boundary soil variation across the farming area.",
      methodology:
        "Boundary mapping and topographic slope evaluation to understand moisture drainage gradients during heavy rainfall.",
      verificationStatus: "Landscape Mapped",
    },
    {
      id: "photo-8",
      category: "infrastructure",
      title: "Field Plantation & Agroforestry Boundary",
      location: "Plantation Plot Sector",
      region: "Perimeter Vegetation Zone",
      image: "/research/field_plantation_plot.png",
      tag: "Plot Boundary",
      tagTone: "healthy",
      summary:
        "Survey of farm perimeter vegetation and soil shading characteristics to calibrate evapotranspiration and solar radiation attenuation models.",
      methodology:
        "Field perimeter survey mapping solar angle exposure and shade dynamics influencing localized ambient temperatures.",
      verificationStatus: "Perimeter Audited",
    },
    {
      id: "photo-9",
      category: "testing",
      title: "7-in-1 Modbus Soil Sensor Hardware Benchmarking",
      location: "Hardware Lab Bench, Maharashtra",
      region: "RS485 Telemetry Rig & Raspberry Pi Testbed",
      image: "/research/soil_sensor_hardware_rig.png",
      tag: "Sensor Hardware Rig",
      tagTone: "water",
      summary:
        "Laboratory calibration of the industrial 7-in-1 Modbus RS485 soil sensor probe connected via USB serial adapter to a Raspberry Pi controller, streaming real-time moisture (46%), temperature (28.5°C), humidity (70%), and N-P-K nutrient readings to the AgriTwin/Cropify telemetry dashboard.",
      methodology:
        "Live hardware serial polling (Modbus RTU over RS485 at 9600 baud) benchmarking analog soil electrical conductivity against calibrated digital twin soil sensor registers.",
      verificationStatus: "Hardware Telemetry Verified",
    },
    {
      id: "photo-10",
      category: "testing",
      title: "Real-Time Edge Sensor Telemetry & AgriTwin Integration",
      location: "Student Research Lab, Maharashtra",
      region: "Edge Telemetry Validation Bench",
      image: "/research/sensor_telemetry_live_stream.png",
      tag: "Edge Telemetry Testing",
      tagTone: "healthy",
      summary:
        "Student researcher validating live end-to-end telemetry synchronization from the 7-in-1 stainless probe and Raspberry Pi controller into the digital twin interface, confirming real-time telemetry ingestion and alert boundaries under test conditions.",
      methodology:
        "End-to-end hardware-in-the-loop validation assessing packet latency, register parity, and real-time telemetry threshold triggers for automated soil nutrient profiling.",
      verificationStatus: "Edge Rig Validated",
    },
    {
      id: "photo-11",
      category: "testing",
      title: "In-Situ 7-in-1 Soil Sensor & Mobile Field Telemetry Rig",
      location: "Active Crop Plot, Maharashtra",
      region: "Crop Row In-Field Telemetry Station",
      image: "/research/image_copy_10.png",
      tag: "Live Sensor Deployment",
      tagTone: "water",
      summary:
        "Student researcher field deployment of the industrial 7-in-1 RS485 soil probe and Raspberry Pi edge computer directly inside crop rows, validating live mobile telemetry streaming (Nitrogen 41 mg/kg, Phosphorus 18 mg/kg, Potassium 67 mg/kg, Soil Moisture 34%, Temp 26.4°C, pH 6.5).",
      methodology:
        "In-situ ground-truth testing verifying physical probe insertion depth, root-zone N-P-K electro-chemical response, and wireless telemetry sync under direct field conditions.",
      verificationStatus: "In-Situ Field Telemetry Verified",
    },
    {
      id: "photo-12",
      category: "testing",
      title: "In-Field Soil Moisture & Microclimate Telemetry Benchmarking",
      location: "Active Crop Field Plot",
      region: "Root-Zone Drip Line Irrigation Sector",
      image: "/research/image_copy_11.png",
      tag: "Dual-Probe Calibration",
      tagTone: "water",
      summary:
        "Direct in-situ validation of soil moisture and ambient microclimate conditions along active drip irrigation rows. The dual-prong soil sensor probe reads real-time ground moisture (65%), ambient temperature (29.4°C), and relative humidity (42%) synced with the mobile telemetry app.",
      methodology:
        "Cross-calibrating physical analog soil capacitance and resistance with digital twin telemetry ingestion to verify moisture thresholds during active drip cycles.",
      verificationStatus: "Dual-Probe Calibrated",
    },
    {
      id: "photo-13",
      category: "testing",
      title: "Microcontroller Soil Nutrient Acquisition Rig (Arduino & Field Sensor)",
      location: "Field Telemetry Testbed",
      region: "Vegetative Crop Canopy Root-Zone",
      image: "/research/image_copy_12.png",
      tag: "Edge Microcontroller Rig",
      tagTone: "healthy",
      summary:
        "Field deployment of an Arduino Uno edge microcontroller rig coupled with the soil sensor probe and portable power bank in active farm soil. Validates live acquisition and wireless synchronization of Soil Nutrient Levels: Nitrogen (42 mg/kg), Phosphorus (18 mg/kg), and Potassium (76 mg/kg) to the mobile digital twin app.",
      methodology:
        "Hardware-in-the-field acquisition testing assessing ADC conversion accuracy, analog probe voltage stability, and live wireless sync of N-P-K nutrient readings under outdoor soil conditions.",
      verificationStatus: "Microcontroller In-Field Verified",
    },
  ];

  const filteredPhotos =
    activeFilter === "all" ? photos : photos.filter((p) => p.category === activeFilter);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <PageHeader
        eyebrow={tr("Academic Fieldwork & Ground Truthing")}
        title={tr("Student Research & Field Evidence")}
        subtitle={tr(
          "Empirical photographic proof of on-site farmer interviews, mobile crop diagnostics testing, and agricultural infrastructure scouting conducted by the student research team across Maharashtra.",
        )}
      />

      {/* Fieldwork Evidence Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-2xl border border-border/70 flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <FileCheck className="size-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-display text-foreground block">
              {tr("13 Field Proofs")}
            </span>
            <span className="text-xs text-muted-foreground">{tr("Original Research Photos")}</span>
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-border/70 flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-healthy/10 border border-healthy/20 flex items-center justify-center text-healthy shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-display text-foreground block">
              {tr("100% Ground Truth")}
            </span>
            <span className="text-xs text-muted-foreground">{tr("In-Situ Verified")}</span>
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-border/70 flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-water/10 border border-water/20 flex items-center justify-center text-water shrink-0">
            <MapPin className="size-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-display text-foreground block">
              {tr("Multi-Plot Trials")}
            </span>
            <span className="text-xs text-muted-foreground">{tr("Universal Farm Evidence")}</span>
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-border/70 flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning shrink-0">
            <Users className="size-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-display text-foreground block">
              {tr("Farmer Direct")}
            </span>
            <span className="text-xs text-muted-foreground">{tr("Structured Field Surveys")}</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              ["all", "All Field Photos"],
              ["interviews", "Farmer Interviews & Surveys"],
              ["testing", "App Field Testing"],
              ["infrastructure", "Farm Infrastructure"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeFilter === key
                  ? "bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20"
                  : "bg-surface/80 border border-border/70 text-muted-foreground hover:text-foreground hover:bg-surface-2"
              }`}
            >
              {tr(label)}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-muted-foreground">
          {tr("Showing")} {tr(filteredPhotos.length)} {tr("of")} {tr(photos.length)} {tr("photos")}
        </span>
      </div>

      {/* Photo Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="glass-card rounded-2xl overflow-hidden border border-border/70 group hover:border-primary/50 transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image Container with Zoom Trigger */}
            <div
              className="relative aspect-[4/3] overflow-hidden bg-surface-2 cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.image}
                alt={tr(photo.title)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

              {/* Tag Badge */}
              <div className="absolute top-3 left-3">
                <Chip tone={photo.tagTone} className="text-[0.7rem] shadow-md font-semibold">
                  {tr(photo.tag)}
                </Chip>
              </div>

              {/* Expand Hint / Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhoto(photo);
                }}
                aria-label={tr(`Expand ${photo.title}`)}
                className="absolute top-3 right-3 h-7 px-2 rounded-full glass flex items-center gap-1 text-[0.68rem] font-medium text-foreground hover:bg-surface-2 transition-all cursor-pointer shadow-md"
              >
                <Maximize2 className="size-3 text-primary" />
                <span className="hidden sm:inline">{tr("Expand")}</span>
              </button>

              {/* Geotag / Location Strip */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-[0.68rem] font-mono text-foreground/90 glass-pill px-2.5 py-1 truncate">
                <MapPin className="size-3 text-warning shrink-0" />
                <span className="truncate">{tr(photo.location)}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold font-display text-foreground group-hover:text-primary transition-colors">
                  {tr(photo.title)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                  {tr(photo.summary)}
                </p>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-border/50 text-xs">
                <div className="text-[0.72rem] text-muted-foreground">
                  <strong className="text-foreground font-semibold">{tr("Methodology:")} </strong>
                  {tr(photo.methodology)}
                </div>

                <div className="flex items-center justify-between text-[0.7rem] font-mono pt-1 text-muted-foreground">
                  <span>{tr(photo.region)}</span>
                  <span className="text-healthy font-semibold flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> {tr(photo.verificationStatus)}
                  </span>
                </div>

                {/* Explicit Expand Photograph Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhoto(photo);
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-surface-2 hover:bg-surface-3 text-xs font-semibold text-foreground border border-border/70 hover:border-primary/60 transition-all cursor-pointer shadow-sm group/btn"
                >
                  <Maximize2 className="size-3.5 text-primary group-hover/btn:scale-110 transition-transform" />
                  <span>{tr("Expand Photograph")}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal for Full-Resolution Photo Inspection — portaled directly to document.body, centered in viewport */}
      {mounted &&
        selectedPhoto &&
        createPortal(
          <div
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedPhoto(null);
            }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Permanent Floating Close Button — Fixed to viewport top-right, guaranteed never off-screen */}
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              className="fixed top-3 right-3 sm:top-5 sm:right-6 z-[110] flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-background/95 hover:bg-surface-2 text-foreground border border-border/80 shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:scale-105 active:scale-95 group"
              aria-label={tr("Close photo preview")}
            >
              <X className="size-4 text-primary group-hover:rotate-90 transition-transform duration-200" />
              <span className="text-xs font-semibold">{tr("Close (Esc)")}</span>
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl glass-card border border-border/80 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] my-auto animate-in zoom-in-95 duration-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-border/60 shrink-0 bg-surface-1/70">
                <div className="pr-3">
                  <h3 className="font-display font-bold text-base sm:text-lg text-foreground">
                    {tr(selectedPhoto.title)}
                  </h3>
                  <p className="text-[0.72rem] text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
                    <MapPin className="size-3 text-warning shrink-0" />
                    <span className="truncate">{tr(selectedPhoto.location)}</span>
                    <span>•</span>
                    <span>{tr(selectedPhoto.region)}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  className="p-1.5 sm:p-2 rounded-xl bg-surface-2 hover:bg-surface-3 text-muted-foreground hover:text-foreground transition-all cursor-pointer border border-border/50 shrink-0"
                  aria-label={tr("Close photo preview")}
                >
                  <X className="size-4.5 sm:size-5" />
                </button>
              </div>

              {/* Modal Body with centered photo and details */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 flex flex-col items-center gap-3.5">
                <div className="w-full max-h-[58vh] sm:max-h-[64vh] rounded-xl sm:rounded-2xl overflow-hidden border border-border/60 bg-black/80 flex items-center justify-center p-1 sm:p-2">
                  <img
                    src={selectedPhoto.image}
                    alt={tr(selectedPhoto.title)}
                    className="max-w-full max-h-[56vh] sm:max-h-[62vh] object-contain rounded-lg"
                  />
                </div>

                <div className="w-full space-y-2 text-xs">
                  <p className="text-foreground font-medium leading-relaxed">
                    {tr(selectedPhoto.summary)}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">{tr("Agronomic Research Method:")} </strong>
                    {tr(selectedPhoto.methodology)}
                  </p>
                </div>

                {/* Bottom Close Action */}
                <div className="w-full pt-2 border-t border-border/40 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(null)}
                    className="px-3.5 py-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 text-xs font-semibold text-foreground border border-border/60 transition-colors cursor-pointer"
                  >
                    {tr("Close Preview")}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default StudentResearchPage;
