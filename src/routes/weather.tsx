import { createFileRoute } from "@tanstack/react-router";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  CloudRain,
  Thermometer,
  Droplet,
  Wind,
  Sun,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { PageHeader, Panel, Stat, Chip, Disclaimer } from "@/components/agri/primitives";
import { farm, weatherSeries } from "@/lib/agri-data";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Weather Intelligence — Cropify" },
      {
        name: "description",
        content: "Localized microclimate tracking and disease risk forecasting.",
      },
    ],
  }),
  component: Weather,
});

function Weather() {
  const current = farm.weather;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sensor Telemetry"
        title="Weather Intelligence"
        subtitle="Localized climate intelligence linked to agricultural rules. Atmospheric variables are evaluated continuously to detect microclimate risk windows."
      />

      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        <div className="panel p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
            <Thermometer className="size-5" />
          </div>
          <div>
            <p className="label-eyebrow text-[0.6rem]">Temperature</p>
            <p className="text-lg font-semibold mt-0.5">{current.temp}°C</p>
          </div>
        </div>

        <div className="panel p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <Droplet className="size-5" />
          </div>
          <div>
            <p className="label-eyebrow text-[0.6rem]">Humidity</p>
            <p className="text-lg font-semibold mt-0.5">{current.humidity}%</p>
          </div>
        </div>

        <div className="panel p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-water/10 text-water">
            <CloudRain className="size-5" />
          </div>
          <div>
            <p className="label-eyebrow text-[0.6rem]">Rainfall (48h)</p>
            <p className="text-xs font-semibold mt-0.5">{current.rain}</p>
          </div>
        </div>

        <div className="panel p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
            <Wind className="size-5" />
          </div>
          <div>
            <p className="label-eyebrow text-[0.6rem]">Wind Speed</p>
            <p className="text-lg font-semibold mt-0.5">{current.wind} km/h</p>
          </div>
        </div>

        <div className="panel p-4 flex items-center gap-3 col-span-2 md:col-span-1">
          <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
            <Sun className="size-5" />
          </div>
          <div>
            <p className="label-eyebrow text-[0.6rem]">UV Index</p>
            <p className="text-lg font-semibold mt-0.5">{current.uv}/10</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Panel eyebrow="Climate Trends" title="7-Day Microclimate Forecast">
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={weatherSeries}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" />
                <YAxis yAxisId="left" stroke="var(--color-muted-foreground)" unit="°C" />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="var(--color-muted-foreground)"
                  unit="mm"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-foreground)",
                    borderRadius: "var(--radius-md)",
                  }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  yAxisId="right"
                  name="Rainfall (mm)"
                  dataKey="rain"
                  fill="var(--color-water)"
                  fillOpacity={0.6}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Line
                  yAxisId="left"
                  name="Temperature (°C)"
                  type="monotone"
                  dataKey="temp"
                  stroke="var(--color-warning)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  name="Humidity (%)"
                  type="monotone"
                  dataKey="humidity"
                  stroke="var(--color-healthy)"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed text-center">
            Rainfall predictions correspond to the right axis (bars), while temperature and humidity
            curves map to the left axis (lines).
          </p>
        </Panel>

        <div className="space-y-6">
          <Panel eyebrow="Methodology Integration" title="Climate Rule Actuator">
            <div className="space-y-4">
              <div className="rounded-lg border border-critical bg-critical/10 p-4 space-y-2">
                <div className="flex items-center gap-2 text-critical">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span className="font-bold text-xs">Fungal Infection Window Active</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Humidity is currently <strong>91%</strong> with rain in last 48 hours. Rule{" "}
                  <strong>#018</strong> conditions are satisfied, activating blight warnings for
                  susceptible <strong>Tomato</strong> blocks.
                </p>
              </div>

              <div className="rounded-lg border border-warning bg-warning/5 p-4 space-y-2">
                <div className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span className="font-bold text-xs">Postpone Crop Spraying (Rule #052)</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  High rain probability within next 12 hours. Spraying fungicides/fertilizers is
                  suppressed as rainfall causes runoff waste.
                </p>
              </div>

              <div className="rounded-lg border border-healthy/40 bg-healthy/10 p-4 space-y-2">
                <div className="flex items-center gap-2 text-healthy">
                  <ShieldCheck className="size-4 shrink-0" />
                  <span className="font-bold text-xs">Irrigation Recommendation</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Drip run-time in <strong>Zone C1</strong> should be reduced by 15-20 minutes to
                  prevent high-moisture root damping.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
