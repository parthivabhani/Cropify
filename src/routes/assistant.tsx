import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Mic,
  Volume2,
  VolumeX,
  Send,
  RefreshCw,
  PlusCircle,
  Network,
  CheckCircle2,
  Settings,
  AlertCircle,
} from "lucide-react";
import { PageHeader, Panel, Chip, Disclaimer } from "@/components/agri/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Voice Assistant — Cropify" },
      {
        name: "description",
        content: "Multilingual farmer voice assistant with symbolic context check.",
      },
    ],
  }),
  component: AssistantRoute,
});

interface ExtractedRule {
  id: string;
  text: string;
  conditions: Array<{ keyword: string; variable: string }>;
  consequent: string;
}

interface ChatMessage {
  sender: "farmer" | "assistant";
  text: string;
  lang: string;
  reasoning?:
    | {
        rules: string[];
        evidence: string;
      }
    | undefined;
}

// Minimal Web Speech API types — TypeScript's DOM lib doesn't ship them yet.
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: ArrayLike<{ isFinal: boolean } & ArrayLike<{ transcript: string }>>;
}
interface SpeechRecognitionErrorEvent {
  error: string;
}
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}
declare const SpeechRecognition: { new (): SpeechRecognition };

function AssistantRoute() {
  const [lang, setLang] = useState("Hinglish");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // Default speak enabled for immersive voice experience
  const [chatText, setChatText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Rule Generator states
  const [farmerStatement, setFarmerStatement] = useState("");
  const [parsingStatement, setParsingStatement] = useState(false);
  const [extractedRule, setExtractedRule] = useState<ExtractedRule | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      sender: "farmer",
      text: "Aaj tomato ko paani dena chahiye kya?",
      lang: "Hinglish",
    },
    {
      sender: "assistant",
      text: "Ji, aaj temperature 27°C hai aur humidity 91% hai. Pichle 48 ghante mein baarish hui hai aur soil moisture pehle se HIGH hai. Rule #027 ke mutabik, root disease ka risk badh sakta hai, isliye aaj evening drip irrigation ko skip karein.",
      lang: "Hinglish",
      reasoning: {
        rules: ["RULE #027 (Saturated soil risk)"],
        evidence: "Humidity 91% + Soil Moisture HIGH + Rain recorded",
      },
    },
  ]);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef("");

  // Speak synthesized response back to farmer
  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Configure voice locales matching speaker dialect
    if (lang === "Hindi" || lang === "Hinglish") {
      utterance.lang = "hi-IN";
    } else if (lang === "Marathi") {
      utterance.lang = "mr-IN";
    } else {
      utterance.lang = "en-US";
    }
    window.speechSynthesis.speak(utterance);
  };

  const submitQueryRef = useRef<((text: string) => void) | null>(null);

  // HTML5 Web Speech Recognition Initialization
  useEffect(() => {
    const SpeechRecognitionClass =
      (window as Window & { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as Window & { webkitSpeechRecognition?: typeof SpeechRecognition })
        .webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      console.warn("Browser does not support Speech Recognition APIs.");
      return;
    }

    const rec = new SpeechRecognitionClass();
    rec.continuous = false;
    rec.interimResults = true; // live character-by-character drafts update

    rec.onstart = () => {
      setIsRecording(true);
      finalTranscriptRef.current = "";
      setChatText("");
      toast.info("Microphone capturing... Speak now.");
    };

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i]!;
        if (result.isFinal) {
          finalTranscript += result[0]!.transcript;
        } else {
          interimTranscript += result[0]!.transcript;
        }
      }

      if (finalTranscript) {
        finalTranscriptRef.current = finalTranscript;
        setChatText(finalTranscript);
      } else if (interimTranscript) {
        setChatText(interimTranscript);
      }
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition capture error:", event.error);
      if (event.error !== "no-speech") {
        toast.error(`Microphone error: ${event.error}`);
      }
      setIsRecording(false);
    };

    rec.onend = () => {
      setIsRecording(false);
      const spokenText = finalTranscriptRef.current;
      if (spokenText && spokenText.trim()) {
        if (submitQueryRef.current) {
          submitQueryRef.current(spokenText.trim());
        }
      }
    };

    recognitionRef.current = rec;
  }, [lang]);

  const handleRecordToggle = () => {
    if (!recognitionRef.current) {
      toast.error("Speech Recognition is not supported by your browser.", {
        description: "Please open this page in Google Chrome or Safari to capture voice commands.",
      });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      let langCode = "hi-IN";
      if (lang === "Marathi") {
        langCode = "mr-IN";
      } else if (lang === "English") {
        langCode = "en-US";
      }
      recognitionRef.current.lang = langCode;
      recognitionRef.current.start();
    }
  };

  // Submit parsed text to response loop
  const submitQuery = (text: string) => {
    const userMsg: ChatMessage = {
      sender: "farmer",
      text,
      lang,
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setChatText("");

    generateAIResponse(text);
  };

  submitQueryRef.current = submitQuery;

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    submitQuery(chatText.trim());
  };

  // Context-aware query solver (Local precision fallback)
  const generateLocalFallback = (text: string): ChatMessage => {
    const q = text.toLowerCase();
    let reply = "";
    let rules: string[] = [];
    let evidence = "";

    if (
      q.includes("paani") ||
      q.includes("water") ||
      q.includes("irrigation") ||
      q.includes("sinchai") ||
      q.includes("pip")
    ) {
      if (lang === "Hinglish") {
        reply =
          "Aaj soil moisture HIGH hai aur pichle 48 hours mein rain hui hai. Rule #027 के अनुसार, root disease se bachne ke liye drip irrigation ko skip karein.";
      } else if (lang === "Hindi") {
        reply =
          "आज मिट्टी की नमी उच्च (HIGH) है और पिछले 48 घंटों में बारिश हुई है। नियम #027 के अनुसार, जड़ सड़न से बचने के लिए आज सिंचाई रोक दें।";
      } else if (lang === "Marathi") {
        reply =
          "आज जमिनीतील ओलावा जास्त (HIGH) आहे आणि गेल्या ४८ तासांत पाऊस झाला आहे. नियम #०२७ नुसार, मुळकुज रोग टाळण्यासाठी आज ड्रिप सिंचन बंद ठेवा.";
      } else {
        reply =
          "Soil moisture is currently HIGH and rainfall was recorded in the last 48 hours. According to Rule #027, skip drip irrigation today to prevent root rot.";
      }
      rules = ["RULE #027 (Saturated soil risk)"];
      evidence = "Soil Moisture HIGH + Rain in last 48h";
    } else if (
      q.includes("disease") ||
      q.includes("blight") ||
      q.includes("bimar") ||
      q.includes("rog") ||
      q.includes("daag") ||
      q.includes("scout")
    ) {
      if (lang === "Hinglish") {
        reply =
          "Humidity 91% hone ke karan tomato plot mein Early Blight risk 74% hai (Rule #018). Zone B1 mein spotting report hui hai, wahan intensive scouting karein.";
      } else if (lang === "Hindi") {
        reply =
          "हवा में नमी 91% होने के कारण टमाटर की फसल में अगेती झुलसा (Early Blight) का जोखिम 74% है (नियम #018)। ज़ोन B1 में सघन निगरानी की आवश्यकता है।";
      } else if (lang === "Marathi") {
        reply =
          "हवेतील दमटपणा ९१% असल्याने टोमॅटो पिकावर अर्ली ब्लाईट रोगाचा धोका ७४% वर पोहोचला आहे (नियम #०१८). झोन B१ मध्ये तातडीने पाहणी करावी.";
      } else {
        reply =
          "Given the 91% relative humidity, Early Blight risk index is at 74% (Rule #018). Increased disease monitoring is advised in Zone B1.";
      }
      rules = ["RULE #018 (Early Blight environmental risk)"];
      evidence = "Humidity 91% + Tomato vegetative stage";
    } else if (
      q.includes("weather") ||
      q.includes("mausam") ||
      q.includes("havaman") ||
      q.includes("temp") ||
      q.includes("rain")
    ) {
      if (lang === "Hinglish") {
        reply =
          "Nashik weather report: Temperature 27°C hai, relative humidity 91% aur pichle 2 din se regular rain chal rahi hai.";
      } else if (lang === "Hindi") {
        reply =
          "नासिक मौसम रिपोर्ट: तापमान 27°C है, सापेक्ष आर्द्रता 91% है और पिछले 2 दिनों से बारिश दर्ज की गई है।";
      } else if (lang === "Marathi") {
        reply =
          "नाशिक हवामान रिपोर्ट: तापमान २७°C आहे, हवेतील दमटपणा ९१% असून गेल्या २ दिवसांत पाऊस झाला आहे.";
      } else {
        reply =
          "Nashik weather update: Temperature is 27°C, relative humidity is 91%, with active rainfall recorded in the last 48 hours.";
      }
      evidence = "Weather API Telemetry";
    } else {
      if (lang === "Hinglish") {
        reply =
          "Aapka query samajh gaya. Crop vegetative phase mein normal grow ho raha hai. Drip irrigation timing ya disease risks ke bare mein poochhein.";
      } else if (lang === "Hindi") {
        reply =
          "टमाटर की फसल वानस्पतिक चरण में स्वस्थ बढ़ रही है। सटीक सिंचाई चक्र या रोग प्रबंधन के बारे में सवाल पूछें।";
      } else if (lang === "Marathi") {
        reply =
          "टोमॅटो पिकाची वाढ समाधानकारक आहे. अचूक पाणी व्यवस्थापन किंवा रोग नियंत्रणाबद्दल प्रश्न विचारावेत.";
      } else {
        reply =
          "The tomato crop is growing normally in its vegetative phase. Ask me about precision drip schedules or fungal risk indexes.";
      }
    }

    return {
      sender: "assistant",
      text: reply,
      lang,
      reasoning: rules.length > 0 ? { rules, evidence } : undefined,
    };
  };

  // Call local precision advisory fallback
  const generateAIResponse = (userQuery: string) => {
    setTimeout(() => {
      setIsTyping(false);
      const reply = generateLocalFallback(userQuery);
      setChatHistory((prev) => [...prev, reply]);
      speakText(reply.text);
    }, 1000);
  };

  const handleParseStatement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerStatement.trim()) return;

    setParsingStatement(true);
    setExtractedRule(null);

    setTimeout(() => {
      setParsingStatement(false);
      setExtractedRule({
        id: "FARMER-RULE-089",
        text: farmerStatement,
        conditions: [
          { keyword: "humidity zyada", variable: "Humidity > 85%" },
          { keyword: "teen din rain", variable: "Rainfall > 3 days" },
          { keyword: "tomato", variable: "Crop = Tomato" },
        ],
        consequent: "Increase Leaf Spot severity probability",
      });
      toast.success("Farmer statement successfully parsed into a symbolic condition rule!");
    }, 2000);
  };

  const handleSaveExtractedRule = () => {
    toast.success("Extracted rule added to the prototype knowledge base!", {
      description: "Labeled: Farmer-derived Knowledge (unverified). Linked to Tomato node.",
    });
    setFarmerStatement("");
    setExtractedRule(null);
  };

  return (
    <div className="space-y-8 text-foreground">
      <PageHeader
        eyebrow="Farmer Interface"
        title="Cropify Voice Assistant"
        subtitle="A voice-first chat engine bridging natural language with exact logical constraints. Farmers can ask questions in Hindi, Hinglish, Marathi, and English."
        actions={
          <div className="flex items-center gap-3">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus:bg-background text-foreground"
            >
              <option value="Hinglish">Hinglish</option>
              <option value="Hindi">Hindi (हिंदी)</option>
              <option value="Marathi">Marathi (मराठी)</option>
              <option value="English">English</option>
            </select>
            <Button
              variant={voiceEnabled ? "default" : "outline"}
              size="icon"
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                toast.info(voiceEnabled ? "Voice synthesis disabled" : "Voice synthesis enabled");
              }}
              title={voiceEnabled ? "Disable TTS output" : "Enable TTS output"}
              className="cursor-pointer animate-rise"
            >
              {voiceEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Panel
            eyebrow="Chat Interface"
            title="Conversational Dialogues"
            className="flex flex-col h-[500px]"
          >
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col max-w-[85%] animate-rise ${
                    msg.sender === "farmer" ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <span className="text-[0.65rem] text-muted-foreground mb-1">
                    {msg.sender === "farmer" ? "Farmer" : "Cropify Assistant"} · {msg.lang}
                  </span>
                  <div
                    className={`rounded-xl px-4 py-2.5 text-sm ${
                      msg.sender === "farmer"
                        ? "bg-primary text-primary-foreground font-medium shadow-sm"
                        : "bg-surface-2 border border-border/80"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.reasoning && (
                    <div className="mt-1.5 w-full bg-background/40 border border-border/40 rounded-lg p-2.5 space-y-1 text-[0.7rem] text-muted-foreground animate-rise">
                      <div className="flex items-center gap-1 font-semibold text-primary">
                        <Network className="size-3" /> Context Verification
                      </div>
                      <p>
                        Active constraints:{" "}
                        <strong className="text-foreground">
                          {msg.reasoning.rules.join(", ")}
                        </strong>
                      </p>
                      <p>Trigger variables: {msg.reasoning.evidence}</p>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 mr-auto text-xs text-muted-foreground p-3 bg-surface-2 rounded-xl border border-border/40 animate-pulse">
                  <RefreshCw className="size-3 animate-spin" /> Cropify is reasoning...
                </div>
              )}
            </div>

            <form onSubmit={handleSendText} className="flex gap-2 pt-4 border-t border-border/40">
              <Input
                placeholder="Ask about water, spray timings, or plant disease..."
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                className="text-xs h-9 bg-background/50 focus:bg-background"
              />
              <Button type="submit" size="sm" className="cursor-pointer">
                <Send className="size-4" />
              </Button>
            </form>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel eyebrow="Speech Telemetry" title="Cropify Voice HUD" className="text-center py-8">
            <div className="flex flex-col items-center gap-6">
              {/* Pulsing microphone layout */}
              <button
                onClick={handleRecordToggle}
                className={cn(
                  "relative p-8 rounded-full border transition-all duration-300 cursor-pointer",
                  isRecording
                    ? "bg-critical/20 border-critical text-critical scale-105"
                    : "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20",
                )}
              >
                {isRecording && (
                  <span className="absolute inset-0 rounded-full bg-critical/25 animate-ping" />
                )}
                <Mic className="size-8" />
              </button>

              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {isRecording ? "Listening to Speech Input..." : "Click to Speak"}
                </p>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Speech-to-text registers Hindi, Marathi, and English voice commands instantly
                </p>
              </div>

              {/* Dynamic waveform simulation */}
              <div className="h-10 flex items-center justify-center gap-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "w-1 rounded-full bg-primary transition-all duration-300",
                      isRecording ? "h-8" : "h-2",
                    )}
                    style={{
                      animation: isRecording
                        ? `pulse-soft 1s ease-in-out ${i * 0.1}s infinite`
                        : undefined,
                    }}
                  />
                ))}
              </div>
            </div>
          </Panel>

          <Panel eyebrow="Knowledge Extraction" title="Conversational Rule Generator">
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Log statements spoken by the farmer to extract informal symbolic heuristics into the
                knowledge base.
              </p>
              <form onSubmit={handleParseStatement} className="space-y-2">
                <Input
                  placeholder="e.g. Tomato me jab humidity zyada ho to daag aate hain"
                  value={farmerStatement}
                  onChange={(e) => setFarmerStatement(e.target.value)}
                  className="text-xs h-9 bg-background/50"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  className="w-full gap-2 cursor-pointer"
                  disabled={parsingStatement}
                >
                  {parsingStatement ? (
                    <>
                      <RefreshCw className="size-3 animate-spin" /> NLP Parsing...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="size-4 text-primary" /> Parse Claim Statement
                    </>
                  )}
                </Button>
              </form>

              {extractedRule && (
                <div className="panel bg-background/40 border border-border/80 p-3 space-y-3 animate-rise">
                  <div className="flex justify-between items-center text-[0.65rem] border-b border-border/30 pb-2">
                    <span className="font-mono text-primary font-semibold">{extractedRule.id}</span>
                    <Chip tone="symbolic">Farmer heuristic</Chip>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-mono text-[0.55rem] text-muted-foreground uppercase block">
                      Extracted conditions:
                    </span>
                    <ul className="space-y-1">
                      {extractedRule.conditions.map((cond, cIdx) => (
                        <li
                          key={cIdx}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                          <span>
                            Matched claim: &quot;{cond.keyword}&quot; →{" "}
                            <strong className="text-foreground">{cond.variable}</strong>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-xs border-t border-border/30 pt-2">
                    <span className="font-mono text-[0.55rem] text-muted-foreground uppercase block">
                      Consequent logic:
                    </span>
                    <p className="text-foreground font-semibold mt-0.5">
                      {extractedRule.consequent}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleSaveExtractedRule}
                    className="w-full cursor-pointer"
                  >
                    Confirm & Save to Graph
                  </Button>
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>
      <Disclaimer />
    </div>
  );
}
