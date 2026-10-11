import { Link } from "@tanstack/react-router";
import {
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
  GraduationCap,
  Wheat,
  ArrowLeft,
} from "lucide-react";
import { useState, type ComponentType } from "react";
import { AgriTwinLogo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

type NavItem = { to: string; label: string; icon: ComponentType<{ className?: string }> };

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: "Core",
    items: [
      { to: "/farm-twin", label: "Farm Twin", icon: Sprout },
      { to: "/disease-analysis", label: "Disease Doctor", icon: Microscope },
      { to: "/reasoning", label: "Reasoning", icon: Workflow },
      { to: "/research", label: "Student Research", icon: GraduationCap },
      { to: "/validation", label: "Validation Lab", icon: FlaskConical },
    ],
  },
  {
    title: "Field tools",
    items: [
      { to: "/assistant", label: "Kisan Copilot", icon: Mic },
      { to: "/weather", label: "Weather", icon: CloudSun },
      { to: "/crop-intelligence", label: "Crop Intelligence", icon: Wheat },
      { to: "/reports", label: "Advisory Reports", icon: FileText },
      { to: "/interview", label: "Farmer Interviews", icon: ClipboardList },
    ],
  },
  {
    title: "System",
    items: [
      { to: "/scenarios", label: "Scenarios", icon: SlidersHorizontal },
      { to: "/knowledge-graph", label: "Knowledge Graph", icon: Share2 },
      { to: "/architecture", label: "Architecture", icon: Network },
      { to: "/history", label: "History & Logs", icon: History },
      { to: "/settings", label: "Sensor Settings", icon: Settings },
    ],
  },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5 px-3 pt-1 pb-6">
        <span className="text-sidebar-primary">
          <AgriTwinLogo size={26} />
        </span>
        <span className="font-display text-xl font-semibold tracking-tight">AgriTwin</span>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3 pb-2 font-display text-[0.68rem] font-medium uppercase tracking-[0.16em] text-sidebar-foreground/45">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={onNavigate}
                    activeProps={{
                      className: "bg-sidebar-primary text-sidebar-primary-foreground font-semibold",
                    }}
                    inactiveProps={{
                      className:
                        "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    }}
                    className="flex items-center gap-3 rounded-full px-3 py-2 text-sm transition-colors"
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-4 border-t border-sidebar-border pt-4">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            onClick={onNavigate}
            className="flex flex-1 items-center gap-2 rounded-full px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <ArrowLeft className="size-4" />
            Home
          </Link>
          <ThemeToggle className="size-9 border border-sidebar-border text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground" />
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-3 left-3 z-30 hidden w-60 rounded-[1.75rem] bg-sidebar p-4 text-sidebar-foreground lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile: floating menu button instead of a top bar */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 inline-flex items-center gap-2 rounded-full bg-sidebar px-4 py-2.5 text-sm font-medium text-sidebar-foreground shadow-lg lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="size-4" />
        Menu
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/50 animate-in fade-in-0 duration-200"
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar p-4 text-sidebar-foreground animate-in slide-in-from-left duration-300">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent"
              aria-label="Close navigation"
            >
              <X className="size-5" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <main className="px-4 pt-20 pb-12 sm:px-6 lg:ml-[16.5rem] lg:px-10 lg:pt-10">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
