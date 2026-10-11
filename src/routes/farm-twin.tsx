import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { toast } from "sonner";
import { Edit, Save, Sprout, MapPin, Minimize2, Calendar, Droplet, Clipboard } from "lucide-react";
import { PageHeader, Panel, Stat, Chip, Disclaimer } from "@/components/agri/primitives";
import { FieldMap } from "@/components/agri/field-map";
import { farm as initialFarm } from "@/lib/agri-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { tr } from "@/lib/i18n";

// Leaflet touches `window` at import time, so the mapping tools load only in the browser.
const BoundaryMapping = lazy(() =>
  import("@/components/agri/boundary-mapping").then((m) => ({ default: m.BoundaryMapping })),
);

export const Route = createFileRoute("/farm-twin")({
  head: () => ({
    meta: [
      { title: "Farm Digital Twin — Cropify" },
      {
        name: "description",
        content: "Interactive living digital twin of the research farm block.",
      },
    ],
  }),
  component: FarmTwin,
});

function FarmTwin() {
  const [farmData, setFarmData] = useState(initialFarm);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(initialFarm);
  const [activePageTab, setActivePageTab] = useState<"overview" | "mapping">("overview");

  const handleStartEdit = () => {
    setTempData(farmData);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFarmData(tempData);
    setIsEditing(false);
    toast.success(tr("Farm Digital Twin profile updated successfully!"), {
      description: tr("Changes propagated to neural classification & reasoning logic."),
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={tr("Observe & Digitise")}
        title={tr("Farm Digital Twin")}
        subtitle={tr(
          "A living digital representation of your farm plot. Zones are mapped with real-time 7-in-1 soil telemetry, crop conditions, and localized agronomic risk scores.",
        )}
        actions={
          <Button
            variant={isEditing ? "outline" : "default"}
            size="sm"
            onClick={isEditing ? handleCancelEdit : handleStartEdit}
            className="gap-2"
          >
            {isEditing ? (
              <>
                <Minimize2 className="size-4" /> {tr("Cancel")}
              </>
            ) : (
              <>
                <Edit className="size-4" /> {tr("Edit Farm Profile")}
              </>
            )}
          </Button>
        }
      />

      {/* Page Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActivePageTab("overview")}
          className={cn(
            "px-6 py-3 font-display text-sm font-semibold border-b-2 -mb-px transition-colors duration-200 cursor-pointer",
            activePageTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tr("Twin Overview")}
        </button>
        <button
          onClick={() => setActivePageTab("mapping")}
          className={cn(
            "px-6 py-3 font-display text-sm font-semibold border-b-2 -mb-px transition-colors duration-200 cursor-pointer",
            activePageTab === "mapping"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {tr("Boundary Mapping Tools")}
        </button>
      </div>

      {activePageTab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 animate-rise">
            <Stat
              label={tr("Mapped area")}
              value={farmData.sizeAcres}
              unit={tr("Acres")}
              tone="healthy"
              hint={tr("North Block boundary")}
            />
            <Stat
              label={tr("Current crop")}
              value={farmData.crop}
              unit={tr(farmData.variety)}
              tone="symbolic"
              hint={tr("Atharva-8021 hybrid")}
            />
            <Stat
              label={tr("Estimated yield")}
              value={farmData.estimatedYield}
              unit={tr("t/acre")}
              tone="water"
              hint={tr("Model confidence 87%")}
            />
            <Stat
              label={tr("Active health score")}
              value={farmData.healthScore}
              unit="/100"
              tone="healthy"
              hint={tr("Composite health index")}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] animate-rise">
            <div className="space-y-6">
              <Panel
                title={tr("Interactive Field Map")}
                eyebrow={tr("Spatial Telemetry")}
                aside={<Chip tone="healthy">{tr("Online")}</Chip>}
              >
                <div className="mb-4">
                  <FieldMap compact />
                </div>
                <Disclaimer />
              </Panel>
            </div>

            <div>
              {isEditing ? (
                <Panel title={tr("Edit Farm Profile")} eyebrow={tr("Update Context")}>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="farmerName">{tr("Farmer Profile Name")}</Label>
                      <Input
                        id="farmerName"
                        value={tempData.farmer}
                        onChange={(e) => setTempData({ ...tempData, farmer: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">{tr("Location")}</Label>
                      <Input
                        id="location"
                        value={tempData.location}
                        onChange={(e) => setTempData({ ...tempData, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="size">{tr("Size (Acres)")}</Label>
                        <Input
                          id="size"
                          type="number"
                          step="0.1"
                          value={tempData.sizeAcres}
                          onChange={(e) =>
                            setTempData({ ...tempData, sizeAcres: parseFloat(e.target.value) || 0 })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sowingDate">{tr("Sowing Date")}</Label>
                        <Input
                          id="sowingDate"
                          type="date"
                          value={tempData.sowingDate}
                          onChange={(e) => setTempData({ ...tempData, sowingDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="crop">{tr("Crop Type")}</Label>
                        <Input
                          id="crop"
                          value={tempData.crop}
                          onChange={(e) => setTempData({ ...tempData, crop: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="variety">{tr("Variety")}</Label>
                        <Input
                          id="variety"
                          value={tempData.variety}
                          onChange={(e) => setTempData({ ...tempData, variety: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stage">{tr("Growth Stage")}</Label>
                      <select
                        id="stage"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus:bg-background"
                        value={tempData.growthStage}
                        onChange={(e) => setTempData({ ...tempData, growthStage: e.target.value })}
                      >
                        <option value="Sowing">{tr("Sowing")}</option>
                        <option value="Vegetative">{tr("Vegetative")}</option>
                        <option value="Flowering">{tr("Flowering")}</option>
                        <option value="Fruiting">{tr("Fruiting")}</option>
                        <option value="Harvesting">{tr("Harvesting")}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="soil">{tr("Soil Condition Description")}</Label>
                      <Input
                        id="soil"
                        value={tempData.soil}
                        onChange={(e) => setTempData({ ...tempData, soil: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="irrigation">{tr("Irrigation Method")}</Label>
                      <Input
                        id="irrigation"
                        value={tempData.irrigation}
                        onChange={(e) => setTempData({ ...tempData, irrigation: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fertilizer">{tr("Fertilizer Practices")}</Label>
                      <Input
                        id="fertilizer"
                        value={tempData.fertilizer}
                        onChange={(e) => setTempData({ ...tempData, fertilizer: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="w-full gap-2">
                        <Save className="size-4" /> {tr("Save Twin Data")}
                      </Button>
                    </div>
                  </form>
                </Panel>
              ) : (
                <Panel title={tr("Active Farm Profile")} eyebrow={tr("Configuration Metadata")}>
                  <div className="space-y-6 animate-rise">
                    <div className="flex items-start gap-3">
                      <MapPin className="size-5 shrink-0 text-primary mt-0.5" />
                      <div>
                        <p className="label-eyebrow">{tr("Location & Coordinates")}</p>
                        <p className="text-sm font-medium mt-1">{tr(farmData.location)}</p>
                        <p className="font-mono text-xs text-muted-foreground mt-0.5">
                          {tr(farmData.coordinates)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Sprout className="size-5 shrink-0 text-symbolic mt-0.5" />
                      <div>
                        <p className="label-eyebrow">{tr("Crop & Cultivar")}</p>
                        <p className="text-sm font-medium mt-1">
                          {tr(farmData.crop)} ({tr(farmData.variety)})
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {tr("Stage:")}{" "}
                          <span className="text-primary font-medium">
                            {tr(farmData.growthStage)}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="size-5 shrink-0 text-warning mt-0.5" />
                      <div>
                        <p className="label-eyebrow">{tr("Sowing & Cycle Details")}</p>
                        <p className="text-sm font-medium mt-1">
                          {tr("Transplanted on")} {tr(farmData.sowingDate)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {tr("Previous crop:")} {tr(farmData.previousCrop)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Droplet className="size-5 shrink-0 text-water mt-0.5" />
                      <div>
                        <p className="label-eyebrow">{tr("Soil & Irrigation")}</p>
                        <p className="text-sm font-medium mt-1">{tr(farmData.soil)}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {tr("Irrigation setup:")} {tr(farmData.irrigation)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clipboard className="size-5 shrink-0 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="label-eyebrow">{tr("Management & Observation")}</p>
                        <p className="text-sm font-medium mt-1">{tr(farmData.fertilizer)}</p>
                        <p className="text-xs text-warning mt-1 italic">
                          {tr("Last event:")} {tr(farmData.lastObservation)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Panel>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="panel p-6 animate-rise">
          <div className="mb-6">
            <h2 className="text-xl font-medium">{tr("Boundary Mapping Dashboard")}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {tr(
                "Select one of the mapping tools below to plot, record, or edit the boundaries of the farm block.",
              )}
            </p>
          </div>
          <Suspense
            fallback={
              <p className="py-16 text-center text-sm text-muted-foreground">
                {tr("Loading map…")}
              </p>
            }
          >
            <BoundaryMapping
              initialArea={farmData.sizeAcres}
              initialCoordinates={farmData.coordinates}
              onSave={(newArea, newCoords) => {
                setFarmData((prev) => ({
                  ...prev,
                  sizeAcres: newArea,
                  coordinates: newCoords,
                }));
                setTempData((prev) => ({
                  ...prev,
                  sizeAcres: newArea,
                  coordinates: newCoords,
                }));
              }}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
