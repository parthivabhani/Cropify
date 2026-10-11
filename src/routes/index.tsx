import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowDown, ArrowUpRight, AlertTriangle, Check } from "lucide-react";
import { HeroLandscape, ProbeCrossSection } from "@/components/agri/landscape-art";
import { CropifyLogo } from "@/components/agri/logo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Cropify — Intelligent Digital Twin for Precision Agriculture & Multi-Crop Management",
      },
      {
        name: "description",
        content:
          "Cropify pairs in-field soil sensors, multi-crop leaf disease detection and agronomy rules into one living model for precision farming across diverse crops.",
      },
    ],
  }),
  component: LandingPage,
});

// Organic hero blob (Carbonex / Enjoy Nature) — shared by the clip path and its shadow shape.
const BLOB =
  "M128 38C268-8 468 22 556 118c86 94 34 206 44 310 12 130-96 214-238 194-130-18-190-82-270-122C12 460-10 360 30 270 70 180 22 76 128 38Z";

function LeafShape({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 40 64" className={className} style={style} aria-hidden="true">
      <path
        d="M20 2C6 14 2 34 10 52c3 6 7 9 10 10 3-1 7-4 10-10 8-18 4-38-10-50Z"
        fill="currentColor"
      />
      <path d="M20 8v54" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" fill="none" />
    </svg>
  );
}

function Wave({ fill, flip = false }: { fill: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={cn("block h-16 w-full sm:h-24", flip && "rotate-180")}
      aria-hidden="true"
    >
      <path d="M0 70C220 128 470 4 720 42s520 92 720 18v60H0Z" fill={fill} />
    </svg>
  );
}

const modules = [
  {
    to: "/farm-twin",
    title: "Farm Twin",
    body: "The plot as a living map — zones, soil probe readings and crop health in one view.",
  },
  {
    to: "/disease-analysis",
    title: "Disease Doctor",
    body: "Photograph a leaf, get early or late blight severity and what to spray (or not).",
  },
  {
    to: "/reasoning",
    title: "Reasoning",
    body: "Watch the model propose and the agronomy rules approve, reject or correct it.",
  },
  {
    to: "/research",
    title: "Student Research",
    body: "Geotagged farmer field interviews, hydrological audits, and live 7-in-1 sensor benchmarks.",
  },
  {
    to: "/validation",
    title: "Validation Lab",
    body: "R1 results, R2 system performance and R3 outcome checks against field truth.",
  },
] as const;

// Research fieldwork photos for the clothesline polaroids.
const fieldWork = [
  {
    image: "/research/selu_farmer_interview_geotag.png",
    title: "Farmer interviews",
    note: "Spray habits, yields, soil",
    bg: "bg-[#12352a]",
  },
  {
    image: "/research/field_irrigation_well.png",
    title: "Irrigation audits",
    note: "Wells, tanks and drip lines",
    bg: "bg-[#cfe0f0]",
  },
  {
    image: "/research/image_copy_10.png",
    title: "Sensor field tests",
    note: "7-in-1 probe in crop row",
    bg: "bg-leaf",
  },
  {
    image: "/research/student_field_testing.png",
    title: "Geotagged surveys",
    note: "Every visit on the map",
    bg: "bg-[#d9d3ec]",
  },
  {
    image: "/research/farmland_pasture_landscape.png",
    title: "Boundary walks",
    note: "Plots mapped on foot",
    bg: "bg-[#f0c9b5]",
  },
];

// Sag of the clothesline at each card position (px from the top of the line) and its tilt.
const lineSag = [38, 62, 70, 62, 38];
const lineTilt = [5, 2.5, 0, -2.5, -5];

export function LandingPage() {
  const [moisture, setMoisture] = useState(62);
  const [nitrogen, setNitrogen] = useState(58);

  // Mitscherlich yield response, with a waterlogging penalty above 75% moisture.
  const yieldEstimate = (
    2.8 *
    (1 - Math.exp(-0.035 * nitrogen)) *
    (moisture > 75 ? 0.88 : 1.0)
  ).toFixed(2);
  const tooWet = moisture > 75;
  const lowN = nitrogen < 35;

  return (
    <div className="min-h-screen overflow-x-hidden bg-linen font-sans text-ink selection:bg-leaf selection:text-ink">
      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-10 px-5 pt-8 pb-16 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-6 lg:py-10">
        <div className="absolute top-6 left-5 flex items-center gap-2 text-forest-2 sm:left-8 lg:top-8">
          <CropifyLogo size={26} />
          <span className="font-display text-lg font-semibold tracking-wide text-ink">CROPIFY</span>
        </div>

        <div className="relative z-10 order-2 pt-4 lg:order-1 lg:pt-16">
          <p className="font-display text-xl font-light tracking-[0.12em] text-ink/60 sm:text-2xl">
            WE ARE
          </p>
          <h1 className="mt-2 font-display text-[2.9rem] leading-[0.95] font-semibold tracking-tight text-ink uppercase sm:text-7xl">
            Growing
            <br />
            smarter
            <br />
            <span className="text-forest-2">crops</span>
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-ink/70">
            Cropify keeps a living copy of the farm. A soil probe in the ground, a camera on the
            leaves, and a set of agronomy rules that check every suggestion before it reaches the
            farmer.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Link
              to="/farm-twin"
              className="group inline-flex items-center gap-3 rounded-full bg-leaf py-3.5 pr-3.5 pl-7 font-display text-sm font-semibold tracking-[0.08em] text-ink uppercase shadow-[0_14px_30px_-14px_rgba(120,150,30,0.9)] transition-transform hover:-translate-y-0.5"
            >
              Enter the farm twin
              <span className="flex size-8 items-center justify-center rounded-full bg-ink text-leaf transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="size-4" />
              </span>
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink/70 underline-offset-4 hover:text-ink hover:underline"
            >
              How it works <ArrowDown className="size-4" />
            </a>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6">
            {[
              ["7", "soil readings", "per probe"],
              ["94%", "leaf disease", "accuracy"],
              ["Universal", "farm telemetry", "any crop & plot"],
            ].map(([n, a, b]) => (
              <div key={a} className="flex flex-col gap-1.5">
                <dt className="font-display text-4xl font-light text-forest-2/70 sm:text-5xl">
                  {n}
                </dt>
                <dd className="text-xs leading-tight text-ink/70 sm:text-sm">
                  {a}
                  <br />
                  {b}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Organic photo blob */}
        <div className="relative order-1 mx-auto mt-14 w-full max-w-[640px] lg:order-2 lg:mt-0">
          <svg
            viewBox="0 0 640 640"
            className="w-full"
            role="img"
            aria-label="Illustration of agricultural farmland with a soil probe"
          >
            <defs>
              <clipPath id="hero-blob">
                <path d={BLOB} />
              </clipPath>
            </defs>
            <path d={BLOB} fill="#12352a" transform="translate(22 26)" />
            <path
              d={BLOB}
              fill="#b4d23f"
              transform="translate(-14 -12) scale(0.985)"
              opacity="0.9"
            />
            <g clipPath="url(#hero-blob)">
              <HeroLandscape />
            </g>
            <path
              d="M-10 520c120-40 180 40 300 10s170-120 360-70"
              fill="none"
              stroke="#f4f1e8"
              strokeWidth="5"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>

          <LeafShape
            className="absolute -top-2 left-[8%] w-8 animate-sway text-forest-2"
            style={{ "--r": "-25deg" } as React.CSSProperties}
          />
          <LeafShape
            className="absolute top-[42%] -right-1 w-10 animate-sway text-leaf [animation-delay:1.2s]"
            style={{ "--r": "35deg" } as React.CSSProperties}
          />
          <LeafShape
            className="absolute bottom-[6%] left-[2%] w-6 animate-sway text-forest-2/70 [animation-delay:2.4s]"
            style={{ "--r": "-60deg" } as React.CSSProperties}
          />

          <div className="absolute bottom-[12%] left-[10%] rounded-2xl bg-linen/95 px-4 py-3 shadow-xl backdrop-blur sm:left-[14%]">
            <p className="font-display text-[0.65rem] tracking-[0.16em] text-ink/55 uppercase">
              Root zone · now
            </p>
            <p className="mt-1 font-display text-lg leading-tight font-medium text-ink">
              Moisture 62% <span className="text-ink/30">/</span> N 68 mg/kg
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. HOW IT WORKS (forest) ────────────────────────────── */}
      <Wave fill="#12352a" />
      <section id="how" className="relative -mt-px bg-forest pt-10 pb-24 text-linen sm:pt-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.6fr] lg:items-center">
          <div>
            <span className="block h-0.5 w-12 bg-leaf" />
            <h2 className="mt-5 font-display text-4xl leading-tight font-medium sm:text-5xl">
              Sense.
              <br />
              See.
              <br />
              <span className="text-leaf">Reason.</span>
            </h2>
            <p className="mt-5 max-w-sm text-linen/70">
              Three loops run on every plot. The neural side notices things; the rule side decides
              whether they make agronomic sense.
            </p>
            <div className="mt-10 hidden overflow-hidden rounded-full border-4 border-leaf/40 lg:block lg:h-[340px] lg:w-[220px]">
              <ProbeCrossSection className="block size-full" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                n: "01",
                t: "Sense",
                b: "A 7-in-1 RS485 probe reports moisture, temperature, pH, EC and N-P-K straight from the root zone.",
                cls: "bg-[#1b4a37]",
              },
              {
                n: "02",
                t: "See",
                b: "A leaf photo is scored for early blight, late blight and leaf miner, with lesion severity.",
                cls: "bg-gradient-to-br from-[#2d6e3f] to-leaf text-ink sm:-translate-y-8",
              },
              {
                n: "03",
                t: "Reason",
                b: "Agronomy rules check the suggestion — dosage limits, spray intervals, weather — before advice goes out.",
                cls: "bg-linen text-ink",
              },
            ].map((c) => (
              <article
                key={c.n}
                className={cn(
                  "flex min-h-[300px] flex-col justify-between rounded-[2.5rem] p-7 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]",
                  c.cls,
                )}
              >
                <span className="font-display text-sm tracking-[0.2em] opacity-60">{c.n}</span>
                <div>
                  <span className="block h-0.5 w-8 bg-current opacity-40" />
                  <h3 className="mt-4 font-display text-3xl font-medium">{c.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed opacity-80">{c.b}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Wave fill="#12352a" flip />

      {/* ── 3. MODULES (editorial list) ─────────────────────────── */}
      <section className="relative mx-auto max-w-7xl overflow-hidden px-5 py-24 sm:px-8">
        <p
          aria-hidden="true"
          className="pointer-events-none absolute top-6 right-0 font-display text-[18vw] leading-none font-bold text-ink/[0.04] select-none lg:text-[11rem]"
        >
          INSIDE
        </p>
        <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="font-display text-4xl font-medium sm:text-5xl">What's inside</h2>
          <p className="max-w-sm text-ink/65">
            Five core rooms, and ten more tools for weather, reports, scenarios and sensor setup
            once you're in.
          </p>
        </div>

        <ul className="relative mt-12 border-t border-ink/15">
          {modules.map((m, i) => (
            <li key={m.to}>
              <Link
                to={m.to}
                className="group grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-ink/15 px-2 py-7 transition-colors hover:bg-leaf/90 sm:grid-cols-[5rem_1fr_1.2fr_auto] sm:px-6"
              >
                <span className="font-display text-sm text-ink/45 group-hover:text-ink">
                  0{i + 1}
                </span>
                <span className="font-display text-2xl font-medium sm:text-4xl">{m.title}</span>
                <span className="col-span-3 row-start-2 text-sm text-ink/65 group-hover:text-ink sm:col-span-1 sm:row-start-auto">
                  {m.body}
                </span>
                <span className="col-start-3 row-start-1 flex size-11 items-center justify-center rounded-full border border-ink/20 transition-all group-hover:border-ink group-hover:bg-ink group-hover:text-leaf sm:col-start-auto sm:row-start-auto">
                  <ArrowUpRight className="size-5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 4. PLAYGROUND (Mount-style instrument panel) ────────── */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
        <div className="rounded-[2.5rem] bg-[#0e100e] p-6 text-[#ebeee3] sm:p-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-display text-xs tracking-[0.18em] text-[#ebeee3]/50 uppercase">
                Try it
              </p>
              <h2 className="mt-2 font-display text-3xl font-medium sm:text-4xl">
                Move the soil. Watch the yield.
              </h2>
            </div>
            <p className="max-w-sm text-sm text-[#ebeee3]/60">
              A small slice of the twin: the Mitscherlich response curve the rules use, with a
              waterlogging penalty.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-8 rounded-[1.75rem] bg-[#161916] p-6 sm:p-8">
              {[
                {
                  label: "Available nitrogen",
                  value: nitrogen,
                  unit: "mg/kg",
                  min: 20,
                  max: 120,
                  set: setNitrogen,
                  ticks: ["20 deficient", "60 optimal", "120 excess"],
                },
                {
                  label: "Root-zone moisture",
                  value: moisture,
                  unit: "%",
                  min: 30,
                  max: 95,
                  set: setMoisture,
                  ticks: ["30 wilting", "60 field cap.", "95 waterlogged"],
                },
              ].map((s) => (
                <label key={s.label} className="block">
                  <span className="flex items-baseline justify-between">
                    <span className="text-sm text-[#ebeee3]/70">{s.label}</span>
                    <span className="font-display text-2xl text-[#cde27f]">
                      {s.value}
                      <span className="ml-1 text-sm text-[#ebeee3]/50">{s.unit}</span>
                    </span>
                  </span>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    value={s.value}
                    onChange={(e) => s.set(Number(e.target.value))}
                    className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#2a2e29] accent-[#cde27f]"
                  />
                  <span className="mt-2 flex justify-between text-[0.7rem] text-[#ebeee3]/40">
                    {s.ticks.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex flex-col justify-between rounded-[1.75rem] bg-[#cde27f] p-6 text-[#121410] sm:p-8">
              <div>
                <p className="font-display text-xs tracking-[0.18em] uppercase opacity-60">
                  Expected harvest
                </p>
                <p className="mt-2 font-display text-7xl font-light tracking-tight sm:text-8xl">
                  {yieldEstimate}
                </p>
                <p className="text-sm opacity-70">tonnes per acre</p>
              </div>
              <ul className="mt-8 space-y-2.5 text-sm">
                <li className="flex gap-2">
                  {lowN ? (
                    <AlertTriangle className="size-4 shrink-0" />
                  ) : (
                    <Check className="size-4 shrink-0" />
                  )}
                  {lowN
                    ? "Nitrogen is low — expect yellowing leaves."
                    : "Nitrogen is in the useful range."}
                </li>
                <li className="flex gap-2">
                  {tooWet ? (
                    <AlertTriangle className="size-4 shrink-0" />
                  ) : (
                    <Check className="size-4 shrink-0" />
                  )}
                  {tooWet
                    ? "Over 75% moisture — root rot and damping-off risk."
                    : "Moisture is balanced, no runoff."}
                </li>
              </ul>
              <Link
                to="/scenarios"
                className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-[#121410] px-5 py-2.5 text-sm font-medium text-[#cde27f]"
              >
                Open the scenario simulator <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. FIELD RESEARCH (Astro clothesline) ───────────────── */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/60 px-4 py-1.5 text-sm">
            <span className="size-2 rounded-full bg-leaf" /> Fieldwork, Maharashtra
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight font-semibold uppercase sm:text-6xl">
            Built in the <span className="text-forest-2">field</span>,
            <br />
            not on a lab bench
          </h2>
          <p className="mt-4 text-ink/65">
            Every number in the twin was checked against a real plot, a real well or a real
            conversation with a grower.
          </p>
        </div>

        {/* Desktop: photos pegged to a sagging line */}
        <div className="relative mx-auto mt-14 hidden max-w-[1400px] px-4 md:block">
          <svg
            viewBox="0 0 1000 140"
            preserveAspectRatio="none"
            className="absolute inset-x-0 top-0 h-[140px] w-full"
            aria-hidden="true"
          >
            <path
              d="M0 20Q500 120 1000 20"
              fill="none"
              stroke="#17241c"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
          </svg>
          <div className="relative grid grid-cols-5 gap-5">
            {fieldWork.map((p, i) => (
              <Link
                key={p.title}
                to="/research"
                className="group relative rounded-2xl bg-white p-3 pb-4 shadow-[0_20px_40px_-20px_rgba(23,36,28,0.45)] transition-all duration-300 hover:z-20 hover:scale-105 hover:shadow-2xl block cursor-pointer"
                style={{
                  marginTop: (lineSag[i] ?? 0) - 8,
                  transform: `rotate(${lineTilt[i] ?? 0}deg)`,
                }}
              >
                <span className="absolute -top-4 left-1/2 h-7 w-4 -translate-x-1/2 rounded-sm bg-forest-2 shadow">
                  <span className="absolute top-1.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-linen" />
                </span>
                <div className="relative aspect-[4/3.4] w-full overflow-hidden rounded-xl bg-forest-2/15 shadow-inner">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                </div>
                <figcaption className="mt-3 px-1">
                  <p className="font-display text-base font-semibold text-ink group-hover:text-forest-2 transition-colors">
                    {p.title}
                  </p>
                  <p className="text-xs text-ink/65 font-medium mt-0.5">{p.note}</p>
                </figcaption>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile: swipeable row */}
        <div className="mt-10 flex snap-x gap-4 overflow-x-auto px-5 pb-4 md:hidden">
          {fieldWork.map((p) => (
            <Link
              key={p.title}
              to="/research"
              className="w-56 shrink-0 snap-center rounded-2xl bg-white p-2.5 shadow-lg block"
            >
              <div className="relative aspect-[4/3.4] w-full overflow-hidden rounded-xl bg-forest-2/15 shadow-inner">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-2 px-1">
                <p className="font-display text-sm font-semibold text-ink">{p.title}</p>
                <p className="text-[0.72rem] text-ink/65 font-medium">{p.note}</p>
              </figcaption>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/research"
            className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-6 py-3 text-sm font-medium transition-colors hover:bg-ink hover:text-linen"
          >
            See the photos in Student Research <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ── 6. CLOSING CTA ──────────────────────────────────────── */}
      <Wave fill="#12352a" />
      <section className="relative -mt-px overflow-hidden bg-forest px-5 pt-16 pb-10 text-linen sm:px-8">
        <p
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-[19vw] leading-none font-bold text-linen/[0.05] select-none"
        >
          CROPIFY
        </p>
        <div className="relative mx-auto max-w-3xl py-16 text-center">
          <h2 className="font-display text-4xl leading-tight font-medium sm:text-6xl">
            The farm is waiting.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-linen/70">
            Open the twin to see today's soil, leaf scans and the advice the rules have signed off.
          </p>
          <Link
            to="/farm-twin"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-leaf py-4 pr-4 pl-8 font-display text-sm font-semibold tracking-[0.08em] text-ink uppercase transition-transform hover:-translate-y-0.5"
          >
            Enter the farm twin
            <span className="flex size-9 items-center justify-center rounded-full bg-ink text-leaf">
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>

        <footer className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-linen/15 pt-6 text-xs text-linen/55 sm:flex-row">
          <span className="flex items-center gap-2 text-linen/80">
            <CropifyLogo size={18} className="text-leaf" /> Cropify
          </span>
          <span>
            Autonomous neuro-symbolic digital twin for universal precision agriculture & multi-crop
            farms
          </span>
        </footer>
      </section>
    </div>
  );
}
