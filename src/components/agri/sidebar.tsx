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
} from "lucide-react";
import { useState } from "react";
import { AgriTwinLogo } from "./logo";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/farm-twin", label: "Farm Twin", icon: Sprout },
  { to: "/crop-intelligence", label: "Crop Intelligence", icon: Sprout },
  { to: "/disease-analysis", label: "Disease Analysis", icon: Microscope },
  { to: "/reasoning", label: "Reasoning Engine", icon: Workflow },
  { to: "/scenarios", label: "Scenario Simulator", icon: SlidersHorizontal },
  { to: "/weather", label: "Weather", icon: CloudSun },
  { to: "/knowledge-graph", label: "Knowledge Graph", icon: Share2 },
  { to: "/assistant", label: "AI Assistant", icon: Mic },
  { to: "/interview", label: "Farmer Interview", icon: ClipboardList },
  { to: "/history", label: "Farm History", icon: History },
  { to: "/architecture", label: "Architecture", icon: Network },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/validation", label: "Validation", icon: FlaskConical },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          activeProps={{
            className:
              "bg-sidebar-accent text-sidebar-accent-foreground border-primary/40 shadow-[inset_2px_0_0_0_var(--primary)]",
          }}
          inactiveProps={{ className: "text-muted-foreground border-transparent" }}
          className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
        >
          <Icon className="size-4 shrink-0" />
          <span className="truncate">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

function StatusFooter() {
  return (
    <div className="border-t border-sidebar-border p-3">
      <div className="glass flex items-center gap-3 rounded-lg px-3 py-2.5">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-pulse-soft rounded-full bg-healthy" />
          <span className="relative inline-flex size-2.5 rounded-full bg-healthy" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs font-medium">Farm Twin: Online</p>
          <p className="truncate font-mono text-[0.65rem] text-muted-foreground">
            synced 2 min ago · demo data
          </p>
        </div>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 px-5 py-5">
      <span className="text-foreground">
        <AgriTwinLogo size={30} />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-base font-semibold tracking-tight">AgriTwin</span>
        <span className="block font-mono text-[0.6rem] tracking-[0.14em] text-muted-foreground uppercase">
          Neuro-Symbolic
        </span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <Brand />
        <NavList />
        <StatusFooter />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between pr-3">
            <Brand />
            <button aria-label="Close navigation" onClick={() => setOpen(false)}>
              <X className="size-5 text-muted-foreground" />
            </button>
          </div>
          <NavList onNavigate={() => setOpen(false)} />
          <StatusFooter />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <div className="glass sticky top-0 z-20 flex items-center gap-3 border-b px-4 py-3 lg:hidden">
          <button aria-label="Open navigation" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </button>
          <span className="font-display text-sm font-semibold">AgriTwin</span>
          <span className="ml-auto flex items-center gap-2 font-mono text-[0.65rem] text-muted-foreground">
            <span className="size-2 rounded-full bg-healthy" /> ONLINE
          </span>
        </div>
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 md:px-8 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
