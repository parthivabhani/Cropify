import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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

  const photos: ResearchPhoto[] = [
    {
      id: "photo-1",
      category: "interviews",
      title: "Geotagged Farmer Interview — Selu",
      location: "Selu, Maharashtra, India",
      region: "GPS Map Camera Geotag: 6V3M+8MP",
      image: "/research/selu_farmer_interview_geotag.png",
      tag: "Farmer Interview",
      tagTone: "healthy",
      summary:
        "Student researcher conducting direct farmer interviews in the field with official GPS camera verification, capturing ground-truth disease occurrences and local farming practices.",
      methodology:
        "Semi-structured agronomic interview documenting tomato pest history, irrigation schedules, and localized fertilizer applications directly with local growers.",
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
  ];

  const filteredPhotos =
    activeFilter === "all" ? photos : photos.filter((p) => p.category === activeFilter);

  return (
    <div className="space-y-8 animate-rise pb-12">
      {/* Page Header */}
      <PageHeader
        eyebrow="Academic Fieldwork & Ground Truthing"
        title="Student Research & Field Evidence"
        subtitle="Empirical photographic proof of on-site farmer interviews, mobile crop diagnostics testing, and agricultural infrastructure scouting conducted by the student research team across Maharashtra."
      />

      {/* Fieldwork Evidence Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-2xl border border-border/70 flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <FileCheck className="size-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-display text-foreground block">
              8 Field Proofs
            </span>
            <span className="text-xs text-muted-foreground">Original Research Photos</span>
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-border/70 flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-healthy/10 border border-healthy/20 flex items-center justify-center text-healthy shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-display text-foreground block">
              100% Ground Truth
            </span>
            <span className="text-xs text-muted-foreground">In-Situ Verified</span>
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-border/70 flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-water/10 border border-water/20 flex items-center justify-center text-water shrink-0">
            <MapPin className="size-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-display text-foreground block">
              Selu & Nashik
            </span>
            <span className="text-xs text-muted-foreground">Maharashtra Agronomy Belt</span>
          </div>
        </div>

        <div className="glass p-4 rounded-2xl border border-border/70 flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning shrink-0">
            <Users className="size-5" />
          </div>
          <div>
            <span className="text-xl font-bold font-display text-foreground block">
              Farmer Direct
            </span>
            <span className="text-xs text-muted-foreground">Structured Field Surveys</span>
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
              {label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-muted-foreground">
          Showing {filteredPhotos.length} of {photos.length} photos
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
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

              {/* Tag Badge */}
              <div className="absolute top-3 left-3">
                <Chip tone={photo.tagTone} className="text-[0.7rem] shadow-md font-semibold">
                  {photo.tag}
                </Chip>
              </div>

              {/* Expand Hint */}
              <div className="absolute top-3 right-3 size-8 rounded-full glass flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="size-4" />
              </div>

              {/* Geotag / Location Strip */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-[0.68rem] font-mono text-foreground/90 glass-pill px-2.5 py-1 truncate">
                <MapPin className="size-3 text-warning shrink-0" />
                <span className="truncate">{photo.location}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold font-display text-foreground group-hover:text-primary transition-colors">
                  {photo.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1.5">
                  {photo.summary}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-border/50 text-xs">
                <div className="text-[0.72rem] text-muted-foreground">
                  <strong className="text-foreground font-semibold">Methodology: </strong>
                  {photo.methodology}
                </div>

                <div className="flex items-center justify-between text-[0.7rem] font-mono pt-1 text-muted-foreground">
                  <span>{photo.region}</span>
                  <span className="text-healthy font-semibold flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> {photo.verificationStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal for Full-Resolution Photo Inspection */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl glass-card border border-border/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border/60">
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">
                  {selectedPhoto.title}
                </h3>
                <p className="text-xs text-muted-foreground font-mono flex items-center gap-1.5 mt-0.5">
                  <MapPin className="size-3.5 text-warning" />
                  <span>{selectedPhoto.location}</span>
                  <span>•</span>
                  <span>{selectedPhoto.region}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-full hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                aria-label="Close photo preview"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col items-center gap-4">
              <div className="w-full max-h-[60vh] rounded-2xl overflow-hidden border border-border/60 bg-black flex items-center justify-center">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-[60vh] object-contain"
                />
              </div>

              <div className="w-full space-y-2 text-xs">
                <p className="text-foreground font-medium leading-relaxed">
                  {selectedPhoto.summary}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Agronomic Research Method: </strong>
                  {selectedPhoto.methodology}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentResearchPage;
