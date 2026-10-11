# Cropify

**Neuro-symbolic reasoning for intelligent crop production.**

Cropify keeps a living digital twin of a tomato farm. A 7-in-1 soil probe reports what's happening in the root zone, a vision model reads leaf photos for disease, and a layer of agronomy rules checks every suggestion — re-weighting the model's confidence and vetoing unsafe actions — before any advice reaches the farmer.

> B.Tech Computer Science final-year project — _Neuro-Symbolic Reasoning for Intelligent Crop Production in Agriculture_. Field work carried out in Nashik and Selu, Maharashtra.

---

## How it works

| Loop       | What it does                                                                                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sense**  | A 7-in-1 Modbus RS485 probe streams moisture, temperature, pH, EC and N-P-K from the root zone.                                                                 |
| **See**    | A leaf photo is scored for early blight, late blight, septoria and leaf miner, with lesion severity.                                                            |
| **Reason** | Symbolic agronomy rules (weather windows, spray intervals, nitrogen limits) re-weight the neural prediction and block actions that would be wasteful or unsafe. |

The decision flow is: **digital twin → ML prediction → rule validation → scenario simulation → explainable advice.**

## Modules

**Core**

- **Farm Twin** — the plot as a living map: zones, probe readings, crop health and boundary mapping (satellite, camera and GPS-walk tools).
- **Disease Doctor** — leaf lesion detection with severity, re-weighted by field humidity and checked against spray rules.
- **Reasoning Engine** — set field conditions (or pick a scenario), run the pipeline and see the step-by-step trace, which rules fired, the fused confidence, recommended actions and anything the rules blocked.
- **Student Research** — geotagged farmer interviews, irrigation audits and sensor benchmarks from the field.
- **Validation Lab** — R1 results interpretation, R2 system performance and R3 outcome validation.

**Field tools** — Kisan Copilot (multilingual voice assistant), Weather, Crop Intelligence, Advisory Reports (PDF export), Farmer Interviews.

**System** — Scenario Simulator, Knowledge Graph, Architecture, History & Logs, Sensor Settings.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React 19, file-based routing, SSR) on Vite
- Tailwind CSS v4 with a custom token-based design system (light + dark)
- Radix UI primitives, Recharts, Leaflet, lucide-react
- Nitro server output, deployed to Vercel

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173. The landing page is at `/`; the app itself starts at `/farm-twin`.

Other scripts:

```bash
npm run build     # production build (.vercel/output)
npm run lint      # eslint
npm run format    # prettier
```

## Deploying to Vercel

The build targets Vercel's Build Output API (Nitro `vercel` preset, see `vite.config.ts` and `vercel.json`), so no extra configuration is needed:

1. Import this repository in Vercel (**Add New → Project**).
2. Keep the defaults — `vercel.json` sets the install and build commands.
3. Deploy.

To build for another host, set `NITRO_PRESET` (for example `NITRO_PRESET=node-server npm run build`).

## Project structure

```
src/
  routes/            one file per page (index.tsx is the landing page)
  components/agri/   app shell, sidebar, logo, primitives, illustrations, map tools
  components/ui/     Radix-based UI primitives
  lib/agri-data.ts   farm, sensor and domain data
  lib/reasoning-engine.ts   the neuro-symbolic rules engine
  styles.css         design tokens (light / dark) and utilities
public/research/     field photos used on the Student Research page
```

## Design

The visual language mixes an organic, illustrated landing page (flowing shapes, grain, forest and lime) with a calm instrument-panel app: linen and forest green in light mode, near-black with pastel lime in dark mode. Typography is Jost for display and DM Sans for text.

## Disclaimer

Cropify is a research prototype. Its recommendations are decision support and should be confirmed with a local agronomist before being applied in the field.
