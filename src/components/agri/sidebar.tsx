import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Sprout,
  Microscope,
  Workflow,
  SlidersHorizontal,
  CloudSun,
  Share2,
  Mic,
  FileText,
  FlaskConical,
  Settings,
  History,
  Network,
  ClipboardList,
  Menu,
  X,
  ChevronRight,
  Radio,
  Sparkles,
  Layers,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { AgriTwinLogo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

// Core farmer-facing and neuro-symbolic navigation links (Home button removed — root is dedicated landing page)
const primaryNav = [
  { to: "/farm-twin", label: "Farm Twin", icon: Sprout },
  { to: "/disease-analysis", label: "Disease Doctor", icon: Microscope },
  { to: "/reasoning", label: "AI Reasoning", icon: Workflow },
  { to: "/research", label: "Student Research", icon: GraduationCap },
  { to: "/validation", label: "Validation Lab", icon: FlaskConical },
] as const;

// Secondary advanced agronomy & system tools (in slide-out drawer)
const drawerNav = [
  {
    category: "Farmer Tools & Reports",
    items: [
      { to: "/assistant", label: "Kisan Copilot", icon: Mic, desc: "Multilingual voice AI advisory for farmers" },
      { to: "/reports", label: "Advisory Reports", icon: FileText, desc: "Actionable field reports & PDF exports" },
      { to: "/weather", label: "Live Weather & Microclimate", icon: CloudSun, desc: "IMD forecast, dew point & VPD" },
      { to: "/crop-intelligence", label: "Crop Intelligence", icon: Sprout, desc: "GDD tracking & growth phenology" },
      { to: "/interview", label: "Farmer Interview Log", icon: ClipboardList, desc: "Agronomist field notes & surveys" },
    ],
  },
  {
    category: "AI Simulation & Architecture",
    items: [
      { to: "/scenarios", label: "Scenario Simulator", icon: SlidersHorizontal, desc: "What-if fertilizer & irrigation testing" },
      { to: "/knowledge-graph", label: "Knowledge Graph", icon: Share2, desc: "Ontology entities & semantic triples" },
      { to: "/architecture", label: "System Architecture", icon: Network, desc: "Neuro-symbolic dual-loop diagram" },
      { to: "/history", label: "Farm History & Logs", icon: History, desc: "Audit trail of sensor data & actions" },
      { to: "/settings", label: "Sensor Configuration", icon: Settings, desc: "Modbus RS485 baud & calibration" },
    ],
  },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative selection:bg-primary/20 selection:text-primary transition-colors duration-200">
      {/* 1. CLEAN, BEAUTIFUL, AIRY TOP BAR (Inspired by Carbonex, Astro & Mount) */}
      <header className="sticky top-3 z-40 w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center justify-between h-16 px-4 sm:px-6 rounded-full bg-surface/90 border border-border shadow-xs backdrop-blur-xl transition-all">
            {/* Brand Logo - Links to root landing page */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <span className="flex items-center justify-center size-9 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <AgriTwinLogo size={20} />
              </span>
              <span className="font-display font-bold text-lg tracking-tight text-foreground">
                AgriTwin
              </span>
            </Link>

            {/* Desktop Center Navigation - Spacious, Cleanly Aligned & Beautiful */}
            <div className="hidden lg:flex items-center gap-1.5 bg-surface-2/80 p-1.5 rounded-full border border-border/80">
              {primaryNav.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  activeProps={{
                    className:
                      "bg-primary text-primary-foreground font-semibold shadow-xs",
                  }}
                  inactiveProps={{
                    className:
                      "text-muted-foreground hover:text-foreground hover:bg-surface/80",
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150"
                >
                  <Icon className="size-3.5 shrink-0" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            {/* Right Controls & Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

              {/* Light Mode / Dark Mode Toggle */}
              <ThemeToggle />

              {/* Drawer Toggle Button ("All Tools") */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-2 hover:bg-surface-2/80 text-foreground border border-border text-xs font-medium transition-all cursor-pointer"
                title="Open all farm & system tools"
              >
                <Layers className="size-3.5 text-primary" />
                <span className="hidden sm:inline">Tools</span>
              </button>

              {/* High-Contrast Pill CTA: Hop onto the Farm Twin Model */}
              <Link
                to="/farm-twin"
                className="inline-flex items-center gap-1.5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95"
              >
                <Sprout className="size-3.5" />
                <span>Launch Model</span>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-full bg-surface-2 text-foreground border border-border hover:bg-surface-2/80"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* 2. MAIN APPLICATION CONTENT (Full-width, spacious & cinematic) */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>

      {/* 3. AGROVIA-STYLE FOOTER WITH TRUSTED AFFILIATIONS & METRICS */}
      <footer className="mt-auto border-t border-border/50 bg-surface/30 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center size-7 rounded-full bg-primary/10 text-primary">
              <AgriTwinLogo size={18} />
            </span>
            <span>
              <strong className="text-foreground font-semibold">AgriTwin</strong> — Living Digital Twin & Neuro-Symbolic Reasoning Platform
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[0.72rem]">
            <span className="flex items-center gap-1.5">
              <Radio className="size-3 text-healthy" /> Modbus RS485 Field Sensor Active
            </span>
            <span>•</span>
            <span>Nashik Field Plot A-14</span>
            <span>•</span>
            <span>Empirical Crop Study 2026</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-surface-2 border border-border/60 text-[0.7rem] font-mono">
              ★ 4.9 Verified Agronomist Rating
            </span>
          </div>
        </div>
      </footer>

      {/* 4. SLIDE-OUT TOOLS DRAWER (Spacious, organized research & system tools) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-md animate-in fade-in-50 duration-200"
          />

          {/* Drawer Sheet */}
          <aside className="relative z-10 w-full max-w-md bg-surface border-l border-border/80 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center justify-center size-8 rounded-full bg-primary/15 text-primary">
                  <Layers className="size-4" />
                </span>
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">
                    Farm & System Tools
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive digital twin modules
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-2 text-muted-foreground hover:text-foreground"
                aria-label="Close drawer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Primary Shortcuts */}
            <div className="space-y-2">
              <p className="text-[0.65rem] font-mono uppercase tracking-wider text-primary font-semibold">
                Quick Navigation
              </p>
              <div className="grid grid-cols-2 gap-2">
                {primaryNav.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-surface-2/40 hover:bg-surface-2 hover:border-primary/40 text-xs font-medium text-foreground transition-all"
                  >
                    <Icon className="size-3.5 text-primary" />
                    <span className="truncate">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categorized Tools */}
            {drawerNav.map((section) => (
              <div key={section.category} className="space-y-2.5">
                <p className="text-[0.65rem] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  {section.category}
                </p>
                <div className="space-y-1.5">
                  {section.items.map(({ to, label, icon: Icon, desc }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setDrawerOpen(false)}
                      className="group flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-surface-2 hover:border-primary/40 transition-all"
                    >
                      <span className="flex items-center justify-center size-7 rounded-lg bg-surface-2 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0 mt-0.5">
                        <Icon className="size-3.5" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                            {label}
                          </span>
                          <ArrowUpRight className="size-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-[0.7rem] text-muted-foreground leading-snug mt-0.5 truncate">
                          {desc}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* System Status in Drawer */}
            <div className="mt-auto pt-4 border-t border-border/60 rounded-xl bg-background/40 p-4 border text-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Hardware Link</span>
                <span className="font-mono text-healthy font-semibold flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-healthy" /> RS485 Connected
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Decision Engine</span>
                <span className="font-mono text-primary font-semibold">
                  Neuro-Symbolic Dual Loop
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Active Crop</span>
                <span className="font-mono text-foreground font-semibold">
                  Tomato (Solanum lycopersicum)
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* 5. MOBILE FULL NAVIGATION MODAL */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background p-6 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-border/60">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
              <AgriTwinLogo size={24} />
              <span className="font-display font-bold text-lg text-foreground">AgriTwin</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-surface-2"
              aria-label="Close menu"
            >
              <X className="size-6 text-foreground" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 space-y-3">
            <p className="text-xs font-mono uppercase text-muted-foreground">Primary Features</p>
            {primaryNav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-surface/60 text-sm font-medium text-foreground hover:bg-surface-2"
              >
                <Icon className="size-4 text-primary" />
                <span>{label}</span>
              </Link>
            ))}

            <p className="text-xs font-mono uppercase text-muted-foreground pt-4">More Modules</p>
            {drawerNav.flatMap((s) => s.items).map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-surface-2"
              >
                <Icon className="size-3.5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
