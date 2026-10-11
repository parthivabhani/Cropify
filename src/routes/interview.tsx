import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ClipboardList, Award, Users, BookOpen, Save, RefreshCw } from "lucide-react";
import { PageHeader, Panel, Chip, Disclaimer } from "@/components/agri/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      { title: "Farmer Interview — Cropify" },
      {
        name: "description",
        content: "Capture qualitative farm knowledge directly from farmer field visits.",
      },
    ],
  }),
  component: InterviewRoute,
});

function InterviewRoute() {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    crop: "Tomato",
    size: "2.5",
    variety: "Atharva-8021",
    varietyReason: "Disease resistance and high market price in Nashik mandi.",
    irrigation: "Drip irrigation twice a week, 2 hours per block.",
    fertilizer: "Basal DAP + weekly 19:19:19 fertigation.",
    biggestProblem: "Early blight disease during humid weather and whitefly pest infestations.",
    diseaseHistory: "Yes, early blight reported in lower canopy.",
    earlySymptom: "Small circular brown spots with concentric ring margins on lower leaves.",
    weatherEffect: "Rain followed by warm sunny days makes the disease spread within 2-3 days.",
    sprayDecision: "If spots are seen on more than 5-6 plants in one row, we prepare for spraying.",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Farmer interview uploaded successfully!", {
        description:
          "Agronomic observation log updated. 3 heuristics compiled into symbolic constraints.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Data Collection"
        title="Farmer Interview"
        subtitle="Capture qualitative domain knowledge directly from farmers in Hinglish. These structured statements are parsed to build descriptive rules for the decision layer."
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Panel eyebrow="Data Entry Portal" title="Interview Record Form">
          <form onSubmit={handleSubmit} className="mt-4">
            <Tabs defaultValue="practice" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted rounded-lg mb-6">
                <TabsTrigger value="practice" className="text-xs">
                  1. Farm & Practice
                </TabsTrigger>
                <TabsTrigger value="disease" className="text-xs">
                  2. Disease & Heuristics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="practice" className="space-y-4 focus-visible:outline-none">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Aap abhi kaunsi crop uga rahe ho?
                    </Label>
                    <Input
                      value={formData.crop}
                      onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Tomato kitni zameen mein lagaya hai? (acres)
                    </Label>
                    <Input
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Kaunsi variety use kar rahe ho?
                    </Label>
                    <Input
                      value={formData.variety}
                      onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Ye variety kyun choose ki?
                    </Label>
                    <Input
                      value={formData.varietyReason}
                      onChange={(e) => setFormData({ ...formData, varietyReason: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Aap irrigation kaise karte ho?
                  </Label>
                  <Textarea
                    value={formData.irrigation}
                    onChange={(e) => setFormData({ ...formData, irrigation: e.target.value })}
                    className="h-16 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Aapko sabse badi problem kya lagti hai?
                  </Label>
                  <Textarea
                    value={formData.biggestProblem}
                    onChange={(e) => setFormData({ ...formData, biggestProblem: e.target.value })}
                    className="h-16 resize-none"
                  />
                </div>
              </TabsContent>

              <TabsContent value="disease" className="space-y-4 focus-visible:outline-none">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Is season mein koi disease problem hui thi?
                  </Label>
                  <Input
                    value={formData.diseaseHistory}
                    onChange={(e) => setFormData({ ...formData, diseaseHistory: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Aapko kaise pata chalta hai ki disease shuru ho gayi hai?
                  </Label>
                  <Textarea
                    value={formData.earlySymptom}
                    onChange={(e) => setFormData({ ...formData, earlySymptom: e.target.value })}
                    className="h-16 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Mausam ka disease pe kya effect padta hai?
                  </Label>
                  <Textarea
                    value={formData.weatherEffect}
                    onChange={(e) => setFormData({ ...formData, weatherEffect: e.target.value })}
                    className="h-16 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Spray karne ka decision kaise lete ho?
                  </Label>
                  <Textarea
                    value={formData.sprayDecision}
                    onChange={(e) => setFormData({ ...formData, sprayDecision: e.target.value })}
                    className="h-16 resize-none"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-6 border-t border-border/40 mt-6">
              <Button type="submit" className="w-full gap-2" disabled={submitting}>
                {submitting ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" /> Compiling rules...
                  </>
                ) : (
                  <>
                    <Save className="size-4" /> Save Interview Record
                  </>
                )}
              </Button>
            </div>
          </form>
        </Panel>

        <div className="space-y-6">
          <Panel eyebrow="Methodological Role" title="Qualitative Science">
            <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
              <p className="flex items-start gap-2">
                <Users className="size-5 text-primary shrink-0" />
                <span>
                  <strong>Ethno-agronomic Knowledge:</strong> Captures farmer observation indices.
                  Farmers have centuries of cumulative heuristic knowledge about crop disease
                  triggers which are not captured in microclimate sensors.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Award className="size-5 text-symbolic shrink-0" />
                <span>
                  <strong>Symbolic Translation:</strong> Natural language processing (NLP) models
                  convert these Hinglish interviews into structured constraints that prevent
                  standard neural black-box decision conflicts.
                </span>
              </p>
              <p className="flex items-start gap-2">
                <BookOpen className="size-5 text-water shrink-0" />
                <span>
                  <strong>Unverified Tagging:</strong> Extracted guidelines are marked as
                  &quot;farmer observation&quot; to maintain scientific accuracy in reports.
                </span>
              </p>
            </div>
          </Panel>
        </div>
      </div>
      <Disclaimer />
    </div>
  );
}
