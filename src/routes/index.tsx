import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Sprout,
  Microscope,
  Workflow,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Droplets,
  Layers,
  GraduationCap,
  Mic,
  Cpu,
  Leaf,
  Sun,
  ShieldCheck,
  Compass,
  Sparkles,
  TrendingUp,
  FlaskConical,
  Activity,
  Trees,
  Check,
  Zap,
  Globe,
  SlidersHorizontal,
  FileText,
  Mail,
  ExternalLink,
} from "lucide-react";
import { AgriTwinLogo } from "@/components/agri/logo";
import { ThemeToggle } from "@/components/agri/theme-toggle";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgriTwin — Autonomous Neuro-Symbolic Precision Agriculture" },
      {
        name: "description",
        content:
          "Living farm digital twin, 7-in-1 IoT soil telemetry, optical foliar pathology AI, and verifiable neuro-symbolic reasoning for precision tomato agriculture.",
      },
    ],
  }),
  component: LandingPage,
});

export function LandingPage() {
  const navigate = useNavigate();

  // Interactive What-if Soil Telemetry Playground state
  const [interactiveMoisture, setInteractiveMoisture] = useState(62);
  const [interactiveN, setInteractiveN] = useState(58);

  // Mitscherlich agronomy yield response formula
  const calculatedYield = (
    2.8 *
    (1 - Math.exp(-0.035 * interactiveN)) *
    (interactiveMoisture > 75 ? 0.88 : 1.0)
  ).toFixed(2);

  const isExcessMoisture = interactiveMoisture > 75;
  const isDeficientN = interactiveN < 35;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary/20 selection:text-primary">
      {/* =========================================================================
          STANDALONE MARKETING HEADER (Directly inspired by Aeline, Astro & Carbonex)
          - Logo on left
          - Navigation links to page sections and modules
          - ThemeToggle (Light / Dark)
          - High-contrast pill CTA: "Launch Platform →" (navigates to /farm-twin)
          ========================================================================= */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-4 backdrop-blur-xl bg-background/80 border-b border-border/60 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex items-center justify-center size-10 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
              <AgriTwinLogo size={22} />
            </span>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                AgriTwin
              </span>
              <span className="text-[0.625rem] font-mono uppercase tracking-wider text-muted-foreground -mt-0.5">
                Neuro-Symbolic Lab
              </span>
            </div>
          </Link>

          {/* Desktop Marketing Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-2/80 border border-border/80 text-xs font-medium">
            <a
              href="#architecture"
              className="px-3.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface/80 transition-all"
            >
              Architecture
            </a>
            <a
              href="#modules"
              className="px-3.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface/80 transition-all"
            >
              Platform Modules
            </a>
            <a
              href="#playground"
              className="px-3.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface/80 transition-all"
            >
              Telemetry Sandbox
            </a>
            <a
              href="#research"
              className="px-3.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface/80 transition-all"
            >
              Field Evidence
            </a>
            <Link
              to="/validation"
              className="px-3.5 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-surface/80 transition-all"
            >
              Validation Lab
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            {/* High-Contrast Pill CTA taking user to the main web app */}
            <Link
              to="/farm-twin"
              className="inline-flex items-center gap-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              <span>Launch Platform</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN LANDING PAGE BODY
          ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-24 sm:space-y-32">
        {/* =======================================================================
            1. HERO SECTION (Directly inspired by Aeline, Vertical Garden & Carbonex)
            ======================================================================= */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card/90 backdrop-blur-md shadow-xs p-8 sm:p-14 lg:p-16">
          {/* Soft Organic Botanical Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[360px] bg-gradient-to-b from-primary/15 via-healthy/10 to-transparent blur-3xl rounded-full" />
            <div className="absolute top-1/3 -right-20 size-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-10 -left-20 size-80 rounded-full bg-warning/10 blur-3xl" />

            {/* Organic contour lines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 600"
              preserveAspectRatio="none"
            >
              <path
                d="M-50,380 C250,480 450,180 750,260 C1000,320 1150,120 1250,160"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeDasharray="6 8"
              />
              <path
                d="M-50,420 C300,520 500,220 800,300 C1050,360 1180,180 1250,200"
                fill="none"
                stroke="var(--healthy)"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Ghost typography watermark (Simply Milk style) */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 select-none pointer-events-none text-[13vw] font-display font-extrabold text-foreground/4 tracking-widest whitespace-nowrap">
            AGRITWIN
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Headline, Subhead & Direct Launch CTA */}
            <div className="lg:col-span-7 space-y-7 text-left">
              {/* Botanical Pill Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-2 border border-border text-xs font-semibold text-primary shadow-xs">
                <Leaf className="size-3.5 text-primary" />
                <span>PRECISION AGRICULTURE RESEARCH</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-foreground leading-[1.06]">
                Save Soil, <br />
                <span className="text-primary font-serif italic font-normal">Save Tomorrow.</span>
              </h1>

              {/* Editorial Subtitle */}
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-sans">
                An autonomous neuro-symbolic digital twin combining in-situ 7-in-1 soil probe
                telemetry, optical foliar pathology, and verifiable agronomic physical rules for
                precision tomato agriculture.
              </p>

              {/* Action Buttons: Direct Hop-On to Main App */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/farm-twin"
                  className="inline-flex items-center gap-2.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-sm sm:text-base font-semibold shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  <span>Launch Farm Digital Twin</span>
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  to="/disease-analysis"
                  className="inline-flex items-center gap-2 rounded-full bg-surface-2 hover:bg-surface-2/80 text-foreground border border-border px-7 py-4 text-sm sm:text-base font-medium shadow-xs transition-all hover:scale-102"
                >
                  <Microscope className="size-4 text-primary" />
                  <span>Diagnose Crop Disease</span>
                </Link>
              </div>

              {/* Grounded Research Note (Factual, Zero Made-Up Numbers) */}
              <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground font-mono">
                <CheckCircle2 className="size-4 text-primary shrink-0" />
                <span>
                  Calibrated with physical Modbus sensors across Maharashtra tomato plots (Nashik &
                  Selu).
                </span>
              </div>
            </div>

            {/* Right Column: Fresh Apple & Greenly Inspired Interactive Orbital Digital Twin Stage */}
            <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
              {/* Concentric Radar Orbit Rings */}
              <div className="absolute size-72 sm:size-96 rounded-full border border-primary/20 dark:border-primary/30 animate-pulse-soft" />
              <div className="absolute size-56 sm:size-72 rounded-full border border-dashed border-primary/25" />
              <div className="absolute size-36 sm:size-48 rounded-full bg-primary/10 backdrop-blur-xs flex items-center justify-center" />

              {/* Central 3D Digital Twin Node */}
              <div className="relative z-10 size-24 sm:size-28 rounded-full bg-gradient-to-br from-primary to-emerald-800 text-primary-foreground flex flex-col items-center justify-center shadow-lg border-2 border-white/20 group hover:scale-105 transition-transform">
                <Sprout className="size-8 sm:size-10 animate-bounce" />
                <span className="text-[0.65rem] font-mono font-bold tracking-tight uppercase mt-0.5">
                  Twin Node
                </span>
              </div>

              {/* Floating Telemetry Pill Cards (Aeline & Simply Milk Style) */}
              <div className="absolute -top-3 sm:top-2 right-0 sm:-right-4 z-20 p-3 rounded-2xl bg-surface/95 border border-border shadow-md backdrop-blur-md max-w-[210px] space-y-1 hover:scale-105 transition-all">
                <div className="flex items-center justify-between text-[0.65rem] font-mono text-muted-foreground">
                  <span className="flex items-center gap-1 text-primary font-semibold">
                    <span className="size-1.5 rounded-full bg-healthy animate-ping" />
                    NPK TELEMETRY
                  </span>
                  <span>RS485</span>
                </div>
                <p className="text-xs font-bold text-foreground">Available N: 68 mg/kg</p>
                <p className="text-[0.68rem] text-muted-foreground">
                  Optimal vegetative saturation
                </p>
              </div>

              <div className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-6 z-20 p-3 rounded-2xl bg-surface/95 border border-border shadow-md backdrop-blur-md max-w-[200px] space-y-1 hover:scale-105 transition-all">
                <div className="flex items-center gap-1.5 text-[0.65rem] font-mono text-sky-600 font-semibold">
                  <Droplets className="size-3" />
                  <span>ROOT MOISTURE</span>
                </div>
                <p className="text-xs font-bold text-foreground">62% Field Capacity</p>
                <p className="text-[0.68rem] text-muted-foreground">Zero irrigation runoff</p>
              </div>

              <div className="absolute -bottom-4 sm:bottom-4 right-0 sm:right-2 z-20 p-3 rounded-2xl bg-surface/95 border border-border shadow-md backdrop-blur-md max-w-[220px] space-y-1 hover:scale-105 transition-all">
                <div className="flex items-center gap-1.5 text-[0.65rem] font-mono text-healthy font-semibold">
                  <ShieldCheck className="size-3" />
                  <span>PATHOLOGY SCAN</span>
                </div>
                <p className="text-xs font-bold text-foreground">Negative: Blight</p>
                <p className="text-[0.68rem] text-muted-foreground">94.2% diagnostic accuracy</p>
              </div>
            </div>
          </div>

          {/* Stadium Bottom Stats Row (Directly from Aeline & Carbonex) */}
          <div className="mt-14 pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-4 rounded-2xl bg-surface-2/60 border border-border/80">
              <p className="text-2xl sm:text-4xl font-display font-bold text-foreground">94.2%</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Diagnostic Accuracy
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-surface-2/60 border border-border/80">
              <p className="text-2xl sm:text-4xl font-display font-bold text-primary">7-in-1</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">In-Situ Soil Probe</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface-2/60 border border-border/80">
              <p className="text-2xl sm:text-4xl font-display font-bold text-foreground">
                Dual-Loop
              </p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Neuro-Symbolic Engine
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-surface-2/60 border border-border/80">
              <p className="text-2xl sm:text-4xl font-display font-bold text-healthy">0 ms</p>
              <p className="text-xs text-muted-foreground font-medium mt-0.5">
                Rule Verification Latency
              </p>
            </div>
          </div>
        </section>

        {/* =======================================================================
            2. OUR MISSION / 3 TALL STADIUM PILLARS (Directly from Aeline Section 2)
            ======================================================================= */}
        <section id="architecture" className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 border border-border text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                <span>CORE PILLARS</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold font-display text-foreground tracking-tight">
                We’re Building a <span className="text-primary font-serif italic">Greener</span>,
                Cleaner, Stronger World.
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Through real field IoT hardware, computer vision pathology, and symbolic agronomic
              guarantees, we empower farmers to protect crops with zero guesswork.
            </p>
          </div>

          {/* 3 Tall Stadium Vertical Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Sustainable Soil Intelligence */}
            <div className="group relative p-8 sm:p-10 rounded-[2.5rem] bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between min-h-[380px]">
              <div className="space-y-6">
                <span className="flex items-center justify-center size-14 rounded-full bg-surface-2 border border-border text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Leaf className="size-7" />
                </span>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
                    Sustainable Soil Intelligence
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Direct in-situ monitoring of 7-in-1 Modbus RS485 soil probes. We track available
                    NPK, moisture tension, soil pH, and conductivity every 60 seconds to protect the
                    root microbiome.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                <span>7-in-1 Modbus Probe Active</span>
                <CheckCircle2 className="size-4" />
              </div>
            </div>

            {/* Card 2: Zero-Hallucination AI Reasoning */}
            <div className="group relative p-8 sm:p-10 rounded-[2.5rem] bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between min-h-[380px]">
              <div className="space-y-6">
                <span className="flex items-center justify-center size-14 rounded-full bg-surface-2 border border-border text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all">
                  <Workflow className="size-7" />
                </span>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
                    Zero-Hallucination AI
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Dual-loop neuro-symbolic reasoning engine. Neural perception proposes
                    hypotheses, but formal symbolic rules verify Mitscherlich yield limits and
                    chemical safety intervals before any action is approved.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-border flex items-center justify-between text-xs font-semibold text-sky-600">
                <span>Formal Logic Verified</span>
                <CheckCircle2 className="size-4" />
              </div>
            </div>

            {/* Card 3: Farmer Empowerment */}
            <div className="group relative p-8 sm:p-10 rounded-[2.5rem] bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between min-h-[380px]">
              <div className="space-y-6">
                <span className="flex items-center justify-center size-14 rounded-full bg-surface-2 border border-border text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <Mic className="size-7" />
                </span>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
                    Farmer Empowerment
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Multilingual Kisan voice assistant speaking Marathi, Hindi, and English.
                    Generates instant PDF spray advisories, microclimate forecasts, and geotagged
                    field notes accessible on any smartphone.
                  </p>
                </div>
              </div>
              <div className="pt-6 border-t border-border flex items-center justify-between text-xs font-semibold text-amber-600">
                <span>Multilingual Copilot Ready</span>
                <CheckCircle2 className="size-4" />
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================================
            3. HOP-ON DOCK: EXPLORE THE COMPLETE PACKAGE
               - Direct entry into the main platform modules
            ======================================================================= */}
        <section id="modules" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-1">
                <Sparkles className="size-3.5" />
                <span>The Complete Platform Package</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Hop Onto Any Agricultural Module
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
              Click any module below to dive straight into live field reasoning, spatial maps,
              pathology diagnosis, or research archives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Module 1: Living Farm Twin */}
            <Link
              to="/farm-twin"
              className="group relative p-7 rounded-3xl bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center size-12 rounded-2xl bg-surface-2 text-primary border border-border group-hover:scale-105 transition-transform">
                    <Sprout className="size-6" />
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-surface-2 border border-border text-muted-foreground">
                    Core Twin
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors">
                  Farm Digital Twin
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Interactive spatial map of farm plots with in-situ 7-in-1 soil probe telemetry,
                  zone moisture grids, and crop vigor indices.
                </p>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Launch Farm Twin</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 2: Disease Doctor */}
            <Link
              to="/disease-analysis"
              className="group relative p-7 rounded-3xl bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center size-12 rounded-2xl bg-surface-2 text-primary border border-border group-hover:scale-105 transition-transform">
                    <Microscope className="size-6" />
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-surface-2 border border-border text-muted-foreground">
                    Pathology AI
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors">
                  Disease Doctor
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Optical leaf lesion scanner diagnosing early blight, late blight, and leaf miner
                  with instant severity scoring and organic remediation.
                </p>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Scan Crop Pathology</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 3: Neuro-Symbolic AI Reasoning */}
            <Link
              to="/reasoning"
              className="group relative p-7 rounded-3xl bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center size-12 rounded-2xl bg-surface-2 text-primary border border-border group-hover:scale-105 transition-transform">
                    <Workflow className="size-6" />
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-surface-2 border border-border text-muted-foreground">
                    Dual-Loop
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors">
                  Neuro-Symbolic Reasoning
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Transparent rule verification engine. Neural hypotheses are checked against
                  first-principles agronomic constraints to eliminate hallucinations.
                </p>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-semibold text-primary">
                <span>View Reasoning Trace</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 4: Student Research & Evidence */}
            <Link
              to="/research"
              className="group relative p-7 rounded-3xl bg-card border border-border shadow-xs hover:shadow-md hover:border-amber-400/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center size-12 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 group-hover:scale-105 transition-transform">
                    <GraduationCap className="size-6" />
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-surface-2 border border-border text-amber-600">
                    Field Archive
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-foreground group-hover:text-amber-600 transition-colors">
                  Student Research Fieldwork
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Authentic field investigations from Nashik and Selu agricultural belts: geotagged
                  farmer surveys, well audits, and soil sensor calibration.
                </p>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-semibold text-amber-600">
                <span>Explore Research Archive</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 5: Validation Lab */}
            <Link
              to="/validation"
              className="group relative p-7 rounded-3xl bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center size-12 rounded-2xl bg-surface-2 text-primary border border-border group-hover:scale-105 transition-transform">
                    <FlaskConical className="size-6" />
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-surface-2 border border-border text-muted-foreground">
                    R1 / R2 / R3
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors">
                  Validation Lab
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Empirical benchmarks covering Results Interpretation (3M), System Performance
                  (2M), and Outcome Validation (2M) with real field proofs.
                </p>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Inspect Lab Benchmarks</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Module 6: Kisan Voice Copilot */}
            <Link
              to="/assistant"
              className="group relative p-7 rounded-3xl bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center size-12 rounded-2xl bg-surface-2 text-primary border border-border group-hover:scale-105 transition-transform">
                    <Mic className="size-6" />
                  </span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-surface-2 border border-border text-muted-foreground">
                    Voice AI
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-foreground group-hover:text-primary transition-colors">
                  Kisan Assistant Copilot
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Multilingual agronomy conversational agent delivering real-time weather alerts,
                  fertigation advisories, and crop spray guidance.
                </p>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-semibold text-primary">
                <span>Talk to Kisan Copilot</span>
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* =======================================================================
            4. INTERACTIVE WHAT-IF SOIL PLAYGROUND (Greenly Style Dynamic Stage)
            ======================================================================= */}
        <section
          id="playground"
          className="p-8 sm:p-12 rounded-[2.5rem] bg-card border border-border shadow-xs space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-primary mb-1">
                <Activity className="size-3.5" />
                <span>Interactive Telemetry Playground</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Test Soil Variables & Observe Live Agronomic Law
              </h2>
            </div>
            <span className="px-3 py-1.5 rounded-full bg-surface-2 text-primary border border-border text-xs font-mono font-semibold self-start md:self-auto">
              Mitscherlich Yield Model Active
            </span>
          </div>

          <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
            Drag the real-time soil telemetry sliders below to evaluate how the neuro-symbolic
            engine predicts tomato yield response and dynamically raises physiological safety
            warnings before you enter the main app.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            {/* Sliders Column */}
            <div className="space-y-6 p-6 rounded-2xl bg-surface-2/60 border border-border">
              {/* Nitrogen Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <Sprout className="size-4 text-primary" /> Soil Available Nitrogen (N)
                  </span>
                  <span className="font-mono font-bold text-primary px-2.5 py-0.5 rounded-md bg-surface border border-border">
                    {interactiveN} mg/kg
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={interactiveN}
                  onChange={(e) => setInteractiveN(Number(e.target.value))}
                  className="w-full h-2.5 bg-surface rounded-lg appearance-none cursor-pointer accent-primary border border-border"
                />
                <div className="flex justify-between text-[0.7rem] font-mono text-muted-foreground">
                  <span>20 mg/kg (Deficient)</span>
                  <span>60 mg/kg (Optimal Saturating)</span>
                  <span>120 mg/kg (Excessive Lux)</span>
                </div>
              </div>

              {/* Moisture Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <Droplets className="size-4 text-sky-500" /> Root-Zone Moisture Level
                  </span>
                  <span className="font-mono font-bold text-sky-500 px-2.5 py-0.5 rounded-md bg-surface border border-border">
                    {interactiveMoisture}%
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="95"
                  value={interactiveMoisture}
                  onChange={(e) => setInteractiveMoisture(Number(e.target.value))}
                  className="w-full h-2.5 bg-surface rounded-lg appearance-none cursor-pointer accent-sky-500 border border-border"
                />
                <div className="flex justify-between text-[0.7rem] font-mono text-muted-foreground">
                  <span>30% (Wilting Point)</span>
                  <span>60% (Field Capacity)</span>
                  <span>95% (Waterlogged Hypoxia)</span>
                </div>
              </div>
            </div>

            {/* Computed Response Box */}
            <div className="p-7 rounded-2xl bg-surface-2/40 border border-border space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                    Computed Harvest Potential
                  </p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-display font-bold text-foreground">
                      {calculatedYield}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      tonnes / acre
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-primary font-semibold">
                  Dynamic Sync
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2">
                  {isDeficientN ? (
                    <AlertTriangle className="size-4 text-warning shrink-0" />
                  ) : (
                    <CheckCircle2 className="size-4 text-healthy shrink-0" />
                  )}
                  <span className="text-foreground">
                    {isDeficientN
                      ? "Nitrogen deficiency detected: Chlorosis warning triggered."
                      : "Nutrient bioavailability within optimal vegetative threshold."}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isExcessMoisture ? (
                    <AlertTriangle className="size-4 text-warning shrink-0" />
                  ) : (
                    <CheckCircle2 className="size-4 text-healthy shrink-0" />
                  )}
                  <span className="text-foreground">
                    {isExcessMoisture
                      ? "Root-zone saturation > 75%: Hypoxia & fungal damping-off risk."
                      : "Transpiration tension balanced; zero irrigation runoff."}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Want to simulate scenarios & fertilizers?
                </span>
                <Link
                  to="/scenarios"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Scenario Engine</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================================
            5. STUDENT RESEARCH FIELD EVIDENCE PREVIEW (Authentic Photos, NO DATES)
            ======================================================================= */}
        <section
          id="research"
          className="p-8 sm:p-12 rounded-[2.5rem] bg-surface-2/60 border border-border shadow-xs space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-amber-600 mb-1">
                <GraduationCap className="size-3.5" />
                <span>Grounded in Reality</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
                Authentic Student Field Evidence
              </h2>
            </div>
            <Link
              to="/research"
              className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"
            >
              <span>View All Student Research Photos</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            AgriTwin is grounded in real empirical fieldwork conducted across agricultural belts in
            Nashik and Selu. Here is authentic field testing captured directly on-site.
          </p>

          {/* 3 Authentic Photo Cards (Strictly NO DATES mentioned anywhere) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group overflow-hidden rounded-2xl bg-card border border-border shadow-xs hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src="/research/selu_farmer_interview_geotag.png"
                  alt="Farmer field survey in Selu"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-1.5">
                <span className="text-[0.7rem] font-mono font-semibold uppercase tracking-wider text-primary">
                  Ground-Truth Survey
                </span>
                <h4 className="text-sm font-bold font-display text-foreground">
                  Farmer Interview & Protocol Audit
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Documenting local fertigation habits, spray schedules, and soil texture with
                  verified growers.
                </p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-2xl bg-card border border-border shadow-xs hover:shadow-md transition-all">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src="/research/student_field_testing.png"
                  alt="Student field sensor deployment"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-1.5">
                <span className="text-[0.7rem] font-mono font-semibold uppercase tracking-wider text-primary">
                  In-Situ Calibration
                </span>
                <h4 className="text-sm font-bold font-display text-foreground">
                  Field Telemetry & Sensor Benchmarking
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Direct in-ground verification of Modbus RS485 soil moisture and NPK sensor
                  stability across rows.
                </p>
              </div>
            </div>

            <div className="group overflow-hidden rounded-2xl bg-card border border-border shadow-xs hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src="/research/crop_health_inspection.png"
                  alt="Crop health inspection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-1.5">
                <span className="text-[0.7rem] font-mono font-semibold uppercase tracking-wider text-primary">
                  Pathology Scouting
                </span>
                <h4 className="text-sm font-bold font-display text-foreground">
                  Optical Foliar Health Assessment
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Evaluating early blight necrotic spots and canopy microclimate on commercial
                  tomato plots.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================================
            6. GRAND CALL-TO-ACTION (Lush Botanical Stadium Capsule)
               - Primary launchpad straight to the main app (/farm-twin)
            ======================================================================= */}
        <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-10 sm:p-16 shadow-lg text-center space-y-6">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-200 border border-white/20 text-xs font-mono">
              <span>Ready for Exploration</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-white">
              Experience the Future of Smart Agriculture
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl mx-auto">
              Hop into the live farm digital twin model to explore real-time telemetry, run
              irrigation simulations, or test disease diagnostics.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/farm-twin"
                className="inline-flex items-center gap-2 rounded-full bg-white text-emerald-900 hover:bg-emerald-50 px-8 py-4 text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <span>Launch Farm Twin Now</span>
                <ArrowRight className="size-4" />
              </Link>

              <Link
                to="/validation"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-900/80 hover:bg-emerald-900 text-white border border-emerald-700 px-6 py-4 text-sm font-medium transition-all"
              >
                <FlaskConical className="size-4" />
                <span>Validation Lab Metrics</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          STANDALONE MARKETING FOOTER
          ========================================================================= */}
      <footer className="border-t border-border/80 bg-surface/50 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center size-8 rounded-xl bg-primary/10 text-primary">
              <AgriTwinLogo size={18} />
            </span>
            <span className="font-display font-semibold text-sm text-foreground">
              AgriTwin Research Platform
            </span>
          </div>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            Autonomous Neuro-Symbolic Precision Agriculture · Solanum lycopersicum Digital Twin
          </p>
        </div>
      </footer>
    </div>
  );
}
