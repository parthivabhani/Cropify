import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  Camera,
  Globe,
  Compass,
  Trash2,
  Play,
  Pause,
  Square,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  PlusCircle,
  RefreshCw,
  Plus,
  Crosshair,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chip } from "./primitives";
import { cn } from "@/lib/utils";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// GPS translation parameters centered on Nashik
const BASE_LAT = 20.011;
const BASE_LNG = 73.7903;

interface Vertex {
  id: string;
  x: number; // percentage styling
  y: number;
  lat: number;
  lng: number;
}

interface Field {
  id: string;
  name: string;
  vertices: Vertex[];
  color: string;
}

interface CapturedPoint {
  id: string;
  label: string;
  lat: number;
  lng: number;
  accuracy: number;
  photoUrl: string;
  timestamp: string;
  detectedObject: string;
}

interface BoundaryMappingProps {
  initialArea: number;
  initialCoordinates: string;
  onSave: (area: number, coords: string) => void;
}

// Custom Leaflet DivIcons matching the theme.
// Prevents missing asset 404 logs from bundlers.
const customMarkerHtml = `<div style="
  width: 24px;
  height: 24px;
  background-color: oklch(0.82 0.2 130 / 0.35);
  border: 2px solid oklch(0.82 0.2 130);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
"><div style="width: 8px; height: 8px; background-color: oklch(0.82 0.2 130); border-radius: 50%;"></div></div>`;

const customGpsMarkerHtml = `<div style="
  width: 32px;
  height: 32px;
  background-color: oklch(0.72 0.13 235 / 0.25);
  border: 2px solid oklch(0.72 0.13 235);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
"><div style="width: 10px; height: 10px; background-color: oklch(0.72 0.13 235); border-radius: 50%; animation: pulse 2s infinite alternate;"></div></div>`;

let customMarkerIcon: L.DivIcon;
let customGpsIcon: L.DivIcon;

if (typeof window !== "undefined") {
  customMarkerIcon = L.divIcon({
    className: "custom-leaflet-marker",
    html: customMarkerHtml,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  customGpsIcon = L.divIcon({
    className: "custom-leaflet-gps-marker",
    html: customGpsMarkerHtml,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

// Spherical geodesic area calculator returning Acres (Earth R = 6378137m)
function calculateGeodesicArea(coords: { lat: number; lng: number }[]): number {
  if (coords.length < 3) return 0;
  let areaSum = 0;
  const R = 6378137;

  for (let i = 0; i < coords.length; i++) {
    const p1 = coords[i]!;
    const p2 = coords[(i + 1) % coords.length]!;

    const lat1 = (p1.lat * Math.PI) / 180;
    const lat2 = (p2.lat * Math.PI) / 180;
    const lng1 = (p1.lng * Math.PI) / 180;
    const lng2 = (p2.lng * Math.PI) / 180;

    areaSum += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  const sqMeters = Math.abs((areaSum * R * R) / 2);
  const acres = sqMeters / 4046.86;
  return parseFloat(acres.toFixed(2));
}

// Center point GPS string representation
function getCenterCoordsString(coords: { lat: number; lng: number }[]): string {
  if (coords.length === 0) return `${BASE_LAT.toFixed(4)}° N, ${BASE_LNG.toFixed(4)}° E`;
  const sumLat = coords.reduce((sum, v) => sum + v.lat, 0);
  const sumLng = coords.reduce((sum, v) => sum + v.lng, 0);
  const avgLat = sumLat / coords.length;
  const avgLng = sumLng / coords.length;
  return `${avgLat.toFixed(4)}° N, ${avgLng.toFixed(4)}° E`;
}

// Initial demo fields to layout Nashik blocks
const initialFieldsList: Field[] = [
  {
    id: "f1",
    name: "Tomato Plot - North Block",
    color: "oklch(0.82 0.2 130)", // electric green
    vertices: [
      { id: "v1_1", x: 30, y: 30, lat: 20.01124, lng: 73.78985 },
      { id: "v1_2", x: 70, y: 25, lat: 20.01135, lng: 73.79121 },
      { id: "v1_3", x: 75, y: 70, lat: 20.01058, lng: 73.79148 },
      { id: "v1_4", x: 35, y: 75, lat: 20.01064, lng: 73.78998 },
    ],
  },
  {
    id: "f2",
    name: "Tomato Plot - South Block",
    color: "oklch(0.72 0.13 235)", // blue/water
    vertices: [
      { id: "v2_1", x: 30, y: 30, lat: 20.01041, lng: 73.79035 },
      { id: "v2_2", x: 70, y: 25, lat: 20.01052, lng: 73.79095 },
      { id: "v2_3", x: 75, y: 70, lat: 20.00995, lng: 73.79062 },
    ],
  },
];

// Pre-calculated simulated walk path coordinates
const simulatedCoordinatesList = [
  { lat: 20.01124, lng: 73.78985 },
  { lat: 20.01138, lng: 73.79042 },
  { lat: 20.01147, lng: 73.79105 },
  { lat: 20.01135, lng: 73.79121 },
  { lat: 20.01095, lng: 73.79135 },
  { lat: 20.01058, lng: 73.79148 },
  { lat: 20.01041, lng: 73.7911 },
  { lat: 20.01052, lng: 73.79055 },
  { lat: 20.01064, lng: 73.78998 },
  { lat: 20.01091, lng: 73.78972 },
];

export function BoundaryMapping({ initialArea, initialCoordinates, onSave }: BoundaryMappingProps) {
  const [activeTab, setActiveTab] = useState<"camera" | "satellite" | "gps">("satellite");

  // ----------------------------------------------------
  // MULTI-FIELD STATE
  // ----------------------------------------------------
  const [fields, setFields] = useState<Field[]>(initialFieldsList);
  const [activeFieldId, setActiveFieldId] = useState<string>("f1");

  const [savedArea, setSavedArea] = useState(initialArea);
  const [savedCoords, setSavedCoords] = useState(initialCoordinates);

  const [mapCenter, setMapCenter] = useState<[number, number]>([BASE_LAT, BASE_LNG]);
  const mapRef = useRef<L.Map | null>(null);

  const activeField = (fields.find((f) => f.id === activeFieldId) || fields[0])!;
  const vertices = activeField.vertices;

  const totalCalculatedArea = fields.reduce((sum, f) => sum + calculateGeodesicArea(f.vertices), 0);
  const activeCalculatedArea = calculateGeodesicArea(vertices);

  // Set up center position on mount
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.warn("Using fallback center coordinates", err);
        },
        { timeout: 4000 },
      );
    }
  }, []);

  // ----------------------------------------------------
  // SATELLITE POLYGON MAPPING STATE & MAP
  // ----------------------------------------------------
  const [selectedVertexId, setSelectedVertexId] = useState<string | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const polygonLayersRef = useRef<Map<string, L.Polygon>>(new Map());
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Leaflet Map Initialization
  useEffect(() => {
    if (activeTab !== "satellite") return;

    const container = document.getElementById("leaflet-satellite-map");
    if (!container) return;

    const map = L.map(container, {
      zoomControl: true,
      attributionControl: false,
    }).setView(mapCenter, 17);
    mapRef.current = map;

    // Load satellite tiles
    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 19,
      },
    ).addTo(map);

    // Click drops pin into active field
    map.on("click", (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;
      const newV: Vertex = {
        id: `v_${Date.now()}`,
        x: 50,
        y: 50,
        lat: latlng.lat,
        lng: latlng.lng,
      };

      setFields((prev) =>
        prev.map((f) => (f.id === activeFieldId ? { ...f, vertices: [...f.vertices, newV] } : f)),
      );
      setSelectedVertexId(newV.id);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [activeTab, activeFieldId, mapCenter]);

  // Synchronize fields & vertices state to map polygons & markers
  useEffect(() => {
    if (activeTab !== "satellite" || !mapRef.current) return;
    const map = mapRef.current;

    // 1. Remove obsolete marker handles
    markersRef.current.forEach((marker, id) => {
      if (!vertices.some((v) => v.id === id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    // 2. Remove obsolete field polygons
    polygonLayersRef.current.forEach((poly, id) => {
      if (!fields.some((f) => f.id === id)) {
        poly.remove();
        polygonLayersRef.current.delete(id);
      }
    });

    // 3. Draw Polygons & Markers for all fields
    fields.forEach((f) => {
      const latlngs = f.vertices.map((v) => L.latLng(v.lat, v.lng));
      const isActive = f.id === activeFieldId;

      // Update or create polygon
      let polygon = polygonLayersRef.current.get(f.id);
      if (!polygon) {
        if (latlngs.length >= 3) {
          polygon = L.polygon(latlngs, {
            color: isActive ? "oklch(0.82 0.2 130)" : "oklch(0.65 0 0 / 0.5)",
            fillColor: isActive ? "oklch(0.82 0.2 130)" : "oklch(0.65 0 0 / 0.4)",
            fillOpacity: isActive ? 0.42 : 0.18, // Translucent filled overlays
            weight: isActive ? 3 : 1.5,
          }).addTo(map);
          polygonLayersRef.current.set(f.id, polygon);
        }
      } else {
        polygon.setLatLngs(latlngs);
        polygon.setStyle({
          color: isActive ? "oklch(0.82 0.2 130)" : "oklch(0.65 0 0 / 0.5)",
          fillColor: isActive ? "oklch(0.82 0.2 130)" : "oklch(0.65 0 0 / 0.4)",
          fillOpacity: isActive ? 0.42 : 0.18,
          weight: isActive ? 3 : 1.5,
        });
      }

      // If active field, render/update drag handlers (markers)
      if (isActive) {
        f.vertices.forEach((v) => {
          const latlng = L.latLng(v.lat, v.lng);
          let marker = markersRef.current.get(v.id);

          if (!marker) {
            marker = L.marker(latlng, {
              icon: customMarkerIcon,
              draggable: true,
            }).addTo(map);

            // Drag handler triggers state coordinates recalculations
            marker.on("drag", (e: L.LeafletEvent) => {
              const dragEvent = e as L.LeafletEvent & { target: L.Marker };
              const pos = dragEvent.target.getLatLng();
              setFields((prev) =>
                prev.map((item) => {
                  if (item.id !== activeFieldId) return item;
                  return {
                    ...item,
                    vertices: item.vertices.map((vt) =>
                      vt.id === v.id ? { ...vt, lat: pos.lat, lng: pos.lng } : vt,
                    ),
                  };
                }),
              );
            });

            // Click marker erases/deletes it directly
            marker.on("click", (e: L.LeafletMouseEvent) => {
              L.DomEvent.stopPropagation(e);
              handleVertexMarkerClick(v.id);
            });

            markersRef.current.set(v.id, marker);
          } else {
            const currentLatLng = marker.getLatLng();
            if (
              Math.abs(currentLatLng.lat - v.lat) > 0.000001 ||
              Math.abs(currentLatLng.lng - v.lng) > 0.000001
            ) {
              marker.setLatLng(latlng);
            }
          }
        });
      }
    });

    // Auto zoom fit bounds once on initialization
    if (
      activeField.vertices.length > 0 &&
      map.getZoom() === 17 &&
      map.getCenter().lat === BASE_LAT
    ) {
      try {
        const bounds = L.latLngBounds(activeField.vertices.map((v) => [v.lat, v.lng]));
        map.fitBounds(bounds, { padding: [30, 30] });
      } catch (e) {
        console.warn("Fit bounds failed:", e);
      }
    }
  }, [activeTab, fields, activeFieldId]);

  // Click-to-delete vertex handler
  const handleVertexMarkerClick = (vId: string) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== activeFieldId) return f;
        if (f.vertices.length <= 3) {
          toast.error("Cannot delete corner", {
            description: "A field plot requires at least 3 vertices to outline its shape.",
          });
          return f;
        }
        toast.info("Corner deleted", {
          description: "Removed vertex point from the active field plot.",
        });
        return {
          ...f,
          vertices: f.vertices.filter((v) => v.id !== vId),
        };
      }),
    );
    setSelectedVertexId(null);
  };

  const handleCoordinateChange = (vId: string, field: "lat" | "lng", val: number) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== activeFieldId) return f;
        return {
          ...f,
          vertices: f.vertices.map((v) => (v.id === vId ? { ...v, [field]: val } : v)),
        };
      }),
    );
  };

  const handleAddNewField = () => {
    const newId = `f_${Date.now()}`;
    // Center new field slightly offset from BASE
    const offset = fields.length * 0.0004;
    const newField: Field = {
      id: newId,
      name: `Tomato Plot - Block ${fields.length + 1}`,
      color: "oklch(0.83 0.15 100)",
      vertices: [
        {
          id: `v_${newId}_1`,
          x: 50,
          y: 50,
          lat: BASE_LAT + 0.0003 + offset,
          lng: BASE_LNG - 0.0003,
        },
        {
          id: `v_${newId}_2`,
          x: 50,
          y: 50,
          lat: BASE_LAT + 0.0003 + offset,
          lng: BASE_LNG + 0.0003,
        },
        {
          id: `v_${newId}_3`,
          x: 50,
          y: 50,
          lat: BASE_LAT - 0.0003 + offset,
          lng: BASE_LNG + 0.0003,
        },
      ],
    };
    setFields((prev) => [...prev, newField]);
    setActiveFieldId(newId);
    toast.success("New field polygon added!", {
      description:
        "Click anywhere on the map to add more boundary points, or drag the default pins.",
    });
  };

  const handleDeleteField = (fId: string) => {
    if (fields.length <= 1) {
      toast.error("Cannot delete field", {
        description: "You must retain at least one field plot in the twin.",
      });
      return;
    }
    setFields((prev) => prev.filter((f) => f.id !== fId));
    if (activeFieldId === fId) {
      const remaining = fields.filter((f) => f.id !== fId);
      setActiveFieldId(remaining[0]!.id);
    }
    toast.info("Field plot deleted");
  };

  const handleSaveMultiFieldBoundary = () => {
    const finalArea = parseFloat(totalCalculatedArea.toFixed(2));
    const finalCoords = getCenterCoordsString(activeField.vertices);
    setSavedArea(finalArea);
    setSavedCoords(finalCoords);
    onSave(finalArea, finalCoords);
    toast.success("Multi-field boundaries synced successfully!", {
      description: `Cumulative Area: ${finalArea} Acres across ${fields.length} plots.`,
    });
  };

  const handleViewCurrentLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    toast.loading("Querying current device GPS fix...", { id: "gps-lock" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        toast.dismiss("gps-lock");
        const { latitude, longitude, accuracy } = pos.coords;
        toast.success(`Current location locked (±${Math.round(accuracy)}m)`, {
          description: `${latitude.toFixed(6)}° N, ${longitude.toFixed(6)}° E`,
        });

        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 18, { animate: true });

          // Create or update pulsing GPS marker
          if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const locIcon = L.divIcon({
              className: "custom-user-gps-location",
              html: `<div style="
                width: 32px;
                height: 32px;
                background-color: rgba(14, 165, 233, 0.25);
                border: 2px solid #0284c7;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 16px rgba(14, 165, 233, 0.7);
              "><div style="width: 10px; height: 10px; background-color: #0284c7; border: 2px solid #ffffff; border-radius: 50%; animation: pulse 1.8s infinite;"></div></div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });

            const marker = L.marker([latitude, longitude], { icon: locIcon })
              .addTo(mapRef.current)
              .bindPopup(
                `<div style="font-family: sans-serif; font-size: 12px; padding: 4px;">
                  <strong style="color: #0284c7;">Your Current Location</strong><br/>
                  <span>${latitude.toFixed(6)}° N, ${longitude.toFixed(6)}° E</span><br/>
                  <small style="color: #64748b;">Accuracy: ±${Math.round(accuracy)}m</small>
                </div>`,
              )
              .openPopup();
            userLocationMarkerRef.current = marker;
          }
        }
      },
      (err) => {
        setIsLocating(false);
        toast.dismiss("gps-lock");
        console.warn("GPS lookup error:", err);
        toast.error("Could not obtain device location", {
          description: err.message || "Centering map on Nashik reference agricultural plot.",
        });
        if (mapRef.current) {
          mapRef.current.setView([BASE_LAT, BASE_LNG], 17, { animate: true });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  // ----------------------------------------------------
  // CAMERA AR FEED & CAPTURE LOGIC
  // ----------------------------------------------------
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanStep, setScanStep] = useState<"idle" | "locking" | "analyzing" | "completed">("idle");
  const [targetCorner, setTargetCorner] = useState("South-East Ridge Line");
  const [shutterFlash, setShutterFlash] = useState(false);
  const [compassAngle, setCompassAngle] = useState(42);

  const [capturedPoints, setCapturedPoints] = useState<CapturedPoint[]>([
    {
      id: "cp1",
      label: "North-West Fence Post",
      lat: 20.01124,
      lng: 73.78985,
      accuracy: 1.4,
      photoUrl: "/research/farmland_pasture_landscape.png",
      timestamp: "10:02:14 AM",
      detectedObject: "Fence Post Marker",
    },
  ]);

  // Request rear webcam on tab switch
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (activeTab === "camera") {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        })
        .then((s) => {
          activeStream = s;
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.error("Webcam hardware block:", err);
          toast.error("Camera access failed", {
            description: "Permission denied or hardware is in use by another app.",
          });
        });
    }

    return () => {
      if (activeStream) {
        (activeStream as MediaStream).getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
  }, [activeTab]);

  // Animate mock compass degrees in viewport
  useEffect(() => {
    if (activeTab !== "camera") return;
    const interval = setInterval(() => {
      setCompassAngle((prev) => (prev + (Math.random() - 0.5) * 2 + 360) % 360);
    }, 700);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleCameraCapture = () => {
    if (!videoRef.current || !stream) {
      toast.error("Camera stream not ready");
      return;
    }

    setScanStep("locking");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setScanStep("analyzing");

        const video = videoRef.current!;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg");

          // Play shutter sound
          try {
            const AudioContextClass =
              window.AudioContext ||
              (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (AudioContextClass) {
              const context = new AudioContextClass();
              const osc = context.createOscillator();
              const gain = context.createGain();
              osc.type = "sine";
              osc.frequency.setValueAtTime(800, context.currentTime);
              gain.gain.setValueAtTime(0.1, context.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.15);
              osc.connect(gain);
              gain.connect(context.destination);
              osc.start();
              osc.stop(context.currentTime + 0.15);
            }
          } catch (e) {
            console.warn("Sound playback failed:", e);
          }

          setShutterFlash(true);
          setTimeout(() => setShutterFlash(false), 90);

          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy || 1.0;

          const newPt: CapturedPoint = {
            id: `cp_${Date.now()}`,
            label: targetCorner,
            lat: parseFloat(lat.toFixed(6)),
            lng: parseFloat(lng.toFixed(6)),
            accuracy: parseFloat(accuracy.toFixed(1)),
            photoUrl: dataUrl,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            detectedObject: `Rear Cam capture · ${targetCorner}`,
          };

          setCapturedPoints((prev) => [...prev, newPt]);
          setScanStep("completed");
          toast.success("Landmark registered with actual GPS coordinate!");

          setTimeout(() => {
            setScanStep("idle");
          }, 1200);
        }
      },
      (err) => {
        setScanStep("idle");
        toast.error("GPS lock failed", { description: err.message });
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const handleApplyCameraBoundary = () => {
    if (capturedPoints.length < 3) {
      toast.error("Insufficient points", {
        description: "Must capture at least 3 corner landmarks to close the polygon.",
      });
      return;
    }

    const mappedVertices = capturedPoints.map((cp, idx) => ({
      id: `v_cam_${idx}`,
      x: 50,
      y: 50,
      lat: cp.lat,
      lng: cp.lng,
    }));

    setFields((prev) =>
      prev.map((f) => (f.id === activeFieldId ? { ...f, vertices: mappedVertices } : f)),
    );

    const finalArea = calculateGeodesicArea(mappedVertices);
    const finalCoords = getCenterCoordsString(mappedVertices);

    setSavedArea(finalArea);
    setSavedCoords(finalCoords);
    onSave(finalArea, finalCoords);

    toast.success("Boundary mapped from camera GPS points!", {
      description: `Mapped area: ${finalArea} Acres centered at ${finalCoords}`,
    });
  };

  // ----------------------------------------------------
  // GPS WALKING TELEMETRY & SIMULATOR
  // ----------------------------------------------------
  const [walkActive, setWalkActive] = useState(false);
  const [walkPaused, setWalkPaused] = useState(false);
  const [loggedWalkPoints, setLoggedWalkPoints] = useState<Vertex[]>([]);
  const [gpsTelemetryMode, setGpsTelemetryMode] = useState<"real" | "simulated">("real");

  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsSpeed, setGpsSpeed] = useState<number | null>(null);
  const [gpsAltitude, setGpsAltitude] = useState<number | null>(null);

  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    "RTK Station connected: Local DGPS Base",
    "Telemetry stream initialized. Select mode and click Start Walk...",
  ]);

  const watchIdRef = useRef<number | null>(null);
  const walkPolylineRef = useRef<L.Polyline | null>(null);
  const walkMarkerRef = useRef<L.Marker | null>(null);

  // Simulated tracking refs
  const [walkSimStep, setWalkSimStep] = useState(0);
  const simTimerRef = useRef<NodeJS.Timeout | null>(null);

  const addConsoleLog = (msg: string) => {
    setConsoleLogs((prev) => [
      ...prev.slice(-30),
      `[${new Date().toLocaleTimeString([], { hour12: false })}] ${msg}`,
    ]);
  };

  // Setup Leaflet Map under GPS tab
  useEffect(() => {
    if (activeTab !== "gps") return;

    const container = document.getElementById("leaflet-gps-map");
    if (!container) return;

    const map = L.map(container, {
      zoomControl: true,
      attributionControl: false,
    }).setView(mapCenter, 18);
    mapRef.current = map;

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 19,
      },
    ).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      if (simTimerRef.current) {
        clearInterval(simTimerRef.current);
        simTimerRef.current = null;
      }
      walkPolylineRef.current = null;
      walkMarkerRef.current = null;
    };
  }, [activeTab, mapCenter]);

  const syncGpsPathOnMap = (map: L.Map, latlngs: L.LatLng[]) => {
    if (latlngs.length === 0) return;

    if (walkPolylineRef.current) {
      walkPolylineRef.current.setLatLngs(latlngs);
    } else {
      walkPolylineRef.current = L.polyline(latlngs, {
        color: "oklch(0.72 0.13 235)",
        weight: 4,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);
    }

    const lastLatLng = latlngs[latlngs.length - 1]!;
    if (walkMarkerRef.current) {
      walkMarkerRef.current.setLatLng(lastLatLng);
    } else {
      walkMarkerRef.current = L.marker(lastLatLng, {
        icon: customGpsIcon,
      }).addTo(map);
    }

    map.panTo(lastLatLng);
  };

  const handleStartWalk = () => {
    setWalkActive(true);
    setWalkPaused(false);
    setLoggedWalkPoints([]);
    setWalkSimStep(0);

    addConsoleLog(`Recording started. Mode: ${gpsTelemetryMode.toUpperCase()}`);

    if (gpsTelemetryMode === "real") {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        addConsoleLog("Error: Browser geolocation not supported.");
        toast.error("GPS Watch failed");
        setWalkActive(false);
        return;
      }

      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          if (walkPaused) return;

          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const accuracy = pos.coords.accuracy || 1.0;
          const speed = pos.coords.speed;
          const altitude = pos.coords.altitude;

          setGpsAccuracy(accuracy);
          setGpsSpeed(speed);
          setGpsAltitude(altitude);

          const newPt: Vertex = {
            id: `walk_${Date.now()}`,
            x: 50,
            y: 50,
            lat,
            lng,
          };

          setLoggedWalkPoints((prev) => {
            const next = [...prev, newPt];
            if (mapRef.current) {
              const latlngs = next.map((p) => L.latLng(p.lat, p.lng));
              syncGpsPathOnMap(mapRef.current, latlngs);
            }
            return next;
          });

          addConsoleLog(
            `GPS Fixed: ${lat.toFixed(6)}° N, ${lng.toFixed(6)}° E (H-Acc: ±${accuracy.toFixed(1)}m, Speed: ${speed ? speed.toFixed(1) : 0} m/s)`,
          );
        },
        (err) => {
          addConsoleLog(`GPS Error: ${err.message}`);
          toast.error("GPS Tracking failed", { description: err.message });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );

      watchIdRef.current = watchId;
    } else {
      addConsoleLog("Starting DGPS coordinates playback...");
      simTimerRef.current = setInterval(() => {
        if (walkSimStep >= simulatedCoordinatesList.length) {
          addConsoleLog("Simulation: Completed walk loop.");
          clearInterval(simTimerRef.current!);
          setWalkActive(false);
          toast.success("Walk path completed!");
          return;
        }

        const coords = simulatedCoordinatesList[walkSimStep]!;
        setGpsAccuracy(0.4);
        setGpsSpeed(1.2);
        setGpsAltitude(312.4);

        const newPt: Vertex = {
          id: `sim_walk_${walkSimStep}`,
          x: 50,
          y: 50,
          lat: coords.lat,
          lng: coords.lng,
        };

        setLoggedWalkPoints((prev) => {
          const next = [...prev, newPt];
          if (mapRef.current) {
            const latlngs = next.map((p) => L.latLng(p.lat, p.lng));
            syncGpsPathOnMap(mapRef.current, latlngs);
          }
          return next;
        });

        addConsoleLog(
          `GPS Fixed: ${coords.lat.toFixed(6)}° N, ${coords.lng.toFixed(6)}° E (Sim DGPS Fixed, Accuracy: ±0.4m)`,
        );
        setWalkSimStep((prev) => prev + 1);
      }, 1500);
    }
  };

  const handlePauseResumeWalk = () => {
    setWalkPaused(!walkPaused);
    addConsoleLog(walkPaused ? "Walk tracking resumed." : "Walk tracking paused.");
  };

  const handleLogWalkVertex = () => {
    const corner = loggedWalkPoints[loggedWalkPoints.length - 1];
    if (!corner) return;
    addConsoleLog(`Corner vertex marked at ${corner.lat.toFixed(6)}, ${corner.lng.toFixed(6)}`);
    toast.success("Corner vertex logged", {
      description: `Point ${loggedWalkPoints.length} on the walked perimeter.`,
    });
  };

  const handleCompleteWalk = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (simTimerRef.current) {
      clearInterval(simTimerRef.current);
      simTimerRef.current = null;
    }

    setWalkActive(false);

    if (loggedWalkPoints.length < 3) {
      toast.error("Insufficient walk points", {
        description: "You must track a closed path containing at least 3 points.",
      });
      return;
    }

    setFields((prev) =>
      prev.map((f) => (f.id === activeFieldId ? { ...f, vertices: loggedWalkPoints } : f)),
    );

    const finalArea = calculateGeodesicArea(loggedWalkPoints);
    const finalCoords = getCenterCoordsString(loggedWalkPoints);

    setSavedArea(finalArea);
    setSavedCoords(finalCoords);
    onSave(finalArea, finalCoords);

    toast.success("Walk path compiled to boundary!", {
      description: `Mapped perimeter calculates to ${finalArea} Acres.`,
    });
  };

  return (
    <div className="space-y-6 text-foreground">
      {/* Dynamic Header Metrics */}
      <div className="panel p-4 flex flex-wrap items-center justify-between gap-4 bg-muted/20 border-primary/20">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            <Globe className="size-5 animate-pulse-soft" />
          </div>
          <div>
            <p className="text-xs label-eyebrow">Active Boundary Definition</p>
            <h4 className="text-base font-semibold mt-0.5">{savedArea} Acres Mapped</h4>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <p className="text-[0.65rem] label-eyebrow text-right">Cumulative Mapped Plots</p>
            <p className="font-mono text-xs font-semibold text-primary mt-0.5 text-right">
              {totalCalculatedArea.toFixed(2)} Acres ({fields.length} Fields)
            </p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="hidden sm:block">
            <p className="text-[0.65rem] label-eyebrow text-right">Active Field Center</p>
            <p className="font-mono text-xs font-medium text-muted-foreground mt-0.5 text-right">
              {savedCoords}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Selector — Satellite Map is Default */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab("satellite")}
          className={cn(
            "panel p-3 text-center flex flex-col items-center gap-2 transition-all duration-300 border-border/70 hover:bg-surface-2 cursor-pointer",
            activeTab === "satellite" && "border-primary/55 ring-1 ring-primary/40 bg-surface",
          )}
        >
          <Globe
            className={cn(
              "size-5",
              activeTab === "satellite" ? "text-primary" : "text-muted-foreground",
            )}
          />
          <span className="text-xs font-medium block">1. Satellite Map (Default)</span>
        </button>

        <button
          onClick={() => setActiveTab("camera")}
          className={cn(
            "panel p-3 text-center flex flex-col items-center gap-2 transition-all duration-300 border-border/70 hover:bg-surface-2 cursor-pointer",
            activeTab === "camera" && "border-primary/55 ring-1 ring-primary/40 bg-surface",
          )}
        >
          <Camera
            className={cn(
              "size-5",
              activeTab === "camera" ? "text-primary" : "text-muted-foreground",
            )}
          />
          <span className="text-xs font-medium block">2. Real Camera AR</span>
        </button>

        <button
          onClick={() => setActiveTab("gps")}
          className={cn(
            "panel p-3 text-center flex flex-col items-center gap-2 transition-all duration-300 border-border/70 hover:bg-surface-2 cursor-pointer",
            activeTab === "gps" && "border-primary/55 ring-1 ring-primary/40 bg-surface",
          )}
        >
          <Compass
            className={cn("size-5", activeTab === "gps" ? "text-primary" : "text-muted-foreground")}
          />
          <span className="text-xs font-medium block">3. GPS Walk Mapping</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* CAMERA TAB */}
      {/* ---------------------------------------------------- */}
      {activeTab === "camera" && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] animate-rise">
          {/* Live Camera Viewfinder */}
          <div className="panel p-4 flex flex-col justify-between min-h-[440px] relative overflow-hidden">
            <div className="absolute inset-0 bg-black z-0" />
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 size-full object-cover opacity-80 z-0"
            />

            {/* Shutter flash overlay */}
            {shutterFlash && (
              <div className="absolute inset-0 bg-white z-50 transition-opacity duration-75" />
            )}

            <div className="relative z-10 flex justify-between items-start text-xs font-mono text-primary bg-black/45 p-2 rounded border border-primary/25 backdrop-blur-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
                <span>REAL HARDWARE FEED</span>
              </div>
              <div>COMPASS DIRECTION: {compassAngle.toFixed(0)}°</div>
            </div>

            <div className="relative z-10 mx-auto my-auto size-48 border border-dashed border-primary/40 flex items-center justify-center pointer-events-none">
              <div className="absolute top-0 left-0 size-4 border-t-2 border-l-2 border-primary" />
              <div className="absolute top-0 right-0 size-4 border-t-2 border-r-2 border-primary" />
              <div className="absolute bottom-0 left-0 size-4 border-b-2 border-l-2 border-primary" />
              <div className="absolute bottom-0 right-0 size-4 border-b-2 border-r-2 border-primary" />

              {scanStep === "locking" && (
                <div className="text-center bg-black/80 p-2 rounded border border-warning text-warning animate-pulse text-xs">
                  GEOLOCATION LOCKING...
                </div>
              )}
              {scanStep === "analyzing" && (
                <div className="text-center bg-black/80 p-2 rounded border border-primary text-primary animate-pulse text-xs">
                  CAPTURING FRAME...
                </div>
              )}
              {scanStep === "completed" && (
                <div className="text-center bg-black/80 p-2 rounded border border-healthy text-healthy text-xs flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> LANDMARK CAPTURED
                </div>
              )}
              {scanStep === "idle" && (
                <div className="size-2 rounded-full bg-primary/80 animate-ping" />
              )}
            </div>

            <div className="relative z-10 space-y-3 bg-black/60 p-3 rounded-lg border border-border/45 backdrop-blur-sm mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                <div>
                  <Label htmlFor="cornerSelector" className="text-xs text-muted-foreground">
                    Select Boundary Corner
                  </Label>
                  <select
                    id="cornerSelector"
                    className="flex h-9 w-full rounded-md border border-input bg-background/80 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus:bg-background mt-1 font-sans text-foreground"
                    value={targetCorner}
                    onChange={(e) => setTargetCorner(e.target.value)}
                  >
                    <option value="South-East Ridge Line">South-East Ridge Line</option>
                    <option value="South-West Well Pump corner">South-West Well Pump corner</option>
                    <option value="North-West Fence Post">North-West Fence Post</option>
                    <option value="North-East Border Stone">North-East Border Stone</option>
                    <option value="West Edge Mango Tree">West Edge Mango Tree</option>
                  </select>
                </div>
                <Button
                  onClick={handleCameraCapture}
                  disabled={scanStep !== "idle" || !stream}
                  className="w-full gap-2 cursor-pointer"
                >
                  <Camera className="size-4" />
                  {!stream
                    ? "Awaiting Cam Feed..."
                    : scanStep === "idle"
                      ? "Capture Corner Frame"
                      : "Querying GPS..."}
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar landmark list */}
          <div className="panel p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">Triangulated Landmarks</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Physical photos tagged with actual device coordinate fixes
                </p>
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {capturedPoints.map((cp) => (
                  <div
                    key={cp.id}
                    className="flex gap-3 bg-muted/30 border border-border/70 rounded-lg p-2.5 items-center justify-between"
                  >
                    <div className="flex gap-2.5 items-center min-w-0">
                      <div className="size-12 rounded border border-border bg-slate-950 overflow-hidden relative shrink-0">
                        {cp.photoUrl.startsWith("/") ? (
                          <img
                            src={cp.photoUrl}
                            alt="landmark"
                            className="size-full object-cover opacity-65"
                          />
                        ) : (
                          <img
                            src={cp.photoUrl}
                            alt="landmark data"
                            className="size-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate leading-tight">{cp.label}</p>
                        <p className="font-mono text-[0.65rem] text-muted-foreground mt-0.5 truncate">
                          {cp.lat.toFixed(6)}° N, {cp.lng.toFixed(6)}° E
                        </p>
                        <span className="text-[0.6rem] text-primary/95 font-mono">
                          GPS Acc: ±{cp.accuracy}m · {cp.timestamp}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setCapturedPoints((prev) => prev.filter((item) => item.id !== cp.id))
                      }
                      className="text-muted-foreground hover:text-critical p-1 transition-colors cursor-pointer"
                      title="Remove Point"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}

                {capturedPoints.length === 0 && (
                  <div className="text-center py-8 border border-dashed border-border rounded-lg bg-muted/10">
                    <Camera className="size-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground font-medium">
                      No corner landmarks logged yet.
                    </p>
                    <p className="text-[0.65rem] text-muted-foreground/75 mt-0.5">
                      Snapshot corners to register coordinates.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <Button
                onClick={handleApplyCameraBoundary}
                disabled={capturedPoints.length < 3}
                className="w-full gap-2 cursor-pointer"
                variant="default"
              >
                <CheckCircle2 className="size-4" /> Apply to Field Boundary ({capturedPoints.length}{" "}
                Points)
              </Button>
              {capturedPoints.length < 3 && (
                <p className="text-[0.65rem] text-warning flex items-center gap-1 justify-center mt-2 font-mono">
                  <AlertTriangle className="size-3 shrink-0" /> Minimum 3 GPS points required.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* SATELLITE TAB */}
      {/* ---------------------------------------------------- */}
      {activeTab === "satellite" && (
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] animate-rise">
          <div className="space-y-4">
            {/* Multi-Field Selector HUD */}
            <div className="panel p-3 bg-muted/10 border-border/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground mr-1">ACTIVE PLOT:</span>
                {fields.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFieldId(f.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-semibold border transition-all duration-200 cursor-pointer flex items-center gap-2",
                      activeFieldId === f.id
                        ? "bg-primary border-primary text-primary-foreground shadow-sm"
                        : "bg-surface border-border text-muted-foreground hover:text-foreground hover:bg-surface-2",
                    )}
                  >
                    <span
                      className="size-2 rounded-full border border-black/20"
                      style={{ backgroundColor: f.color }}
                    />
                    {f.name}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={handleViewCurrentLocation}
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 cursor-pointer text-xs font-sans bg-surface hover:bg-surface-2 border-primary/40 text-primary hover:text-primary font-medium shadow-xs"
                  disabled={isLocating}
                  title="Center satellite view on current GPS location"
                >
                  <Crosshair className={cn("size-3.5", isLocating && "animate-spin")} />
                  <span>{isLocating ? "Acquiring GPS..." : "View Current Location"}</span>
                </Button>
                <Button
                  onClick={handleAddNewField}
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 cursor-pointer text-xs font-sans"
                >
                  <Plus className="size-3.5" /> Add Plot
                </Button>
                <Button
                  onClick={() => handleDeleteField(activeFieldId)}
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 cursor-pointer text-xs text-critical hover:text-critical font-sans border-critical/20 hover:bg-critical/10"
                  disabled={fields.length <= 1}
                >
                  <Trash2 className="size-3.5" /> Delete Plot
                </Button>
              </div>
            </div>

            {/* Map Element */}
            <div
              id="leaflet-satellite-map"
              className="panel h-[420px] relative z-10 w-full rounded-xl overflow-hidden shadow-inner border border-border/80"
            />
          </div>

          {/* Coordinate inspection sidebar panel */}
          <div className="panel p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">{activeField.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click map to drop points. Click markers again to erase them.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                {vertices.map((v, idx) => {
                  const selected = v.id === selectedVertexId;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVertexId(v.id)}
                      className={cn(
                        "p-3 rounded-lg border text-sm transition-all duration-200 cursor-pointer bg-muted/15 border-border/80",
                        selected && "border-primary/55 ring-1 ring-primary/40 bg-surface",
                      )}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-mono text-xs font-semibold text-primary">
                          Vertex #{idx + 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVertexMarkerClick(v.id);
                          }}
                          className="text-muted-foreground hover:text-critical p-0.5 transition-colors cursor-pointer"
                          title="Click to erase"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label className="text-[0.65rem] text-muted-foreground font-mono">
                            Latitude (°N)
                          </Label>
                          <Input
                            type="number"
                            step="0.000001"
                            value={v.lat}
                            onChange={(e) =>
                              handleCoordinateChange(v.id, "lat", parseFloat(e.target.value) || 0)
                            }
                            className="h-7 text-xs font-mono px-2 py-0.5"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[0.65rem] text-muted-foreground font-mono">
                            Longitude (°E)
                          </Label>
                          <Input
                            type="number"
                            step="0.000001"
                            value={v.lng}
                            onChange={(e) =>
                              handleCoordinateChange(v.id, "lng", parseFloat(e.target.value) || 0)
                            }
                            className="h-7 text-xs font-mono px-2 py-0.5"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Active Plot Area:</span>
                <span className="font-mono font-semibold text-foreground">
                  {activeCalculatedArea.toFixed(2)} Acres
                </span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-muted-foreground">Cumulative Area (All):</span>
                <span className="font-semibold text-primary">
                  {totalCalculatedArea.toFixed(2)} Acres
                </span>
              </div>
              <Button
                onClick={handleSaveMultiFieldBoundary}
                className="w-full gap-2 cursor-pointer"
                variant="default"
              >
                <CheckCircle2 className="size-4" /> Save Mapped Area & Update Twin
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* GPS WALK TAB */}
      {/* ---------------------------------------------------- */}
      {activeTab === "gps" && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] animate-rise">
          {/* Geolocation tracker map canvas */}
          <div className="space-y-4">
            <div
              id="leaflet-gps-map"
              className="panel h-[420px] w-full rounded-xl overflow-hidden border border-border/80 relative"
            />

            {/* GPS Controls Console Panel */}
            <div className="panel p-4 bg-muted/15 border-border/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex border border-border rounded-md overflow-hidden bg-background">
                  <button
                    onClick={() => {
                      if (walkActive) return;
                      setGpsTelemetryMode("real");
                    }}
                    className={cn(
                      "px-3 py-1.5 text-xs font-mono transition-colors cursor-pointer",
                      gpsTelemetryMode === "real"
                        ? "bg-water text-white"
                        : "text-muted-foreground hover:text-foreground",
                      walkActive && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    GPS (Real Device)
                  </button>
                  <button
                    onClick={() => {
                      if (walkActive) return;
                      setGpsTelemetryMode("simulated");
                    }}
                    className={cn(
                      "px-3 py-1.5 text-xs font-mono transition-colors cursor-pointer",
                      gpsTelemetryMode === "simulated"
                        ? "bg-water text-white"
                        : "text-muted-foreground hover:text-foreground",
                      walkActive && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    Simulate Playback
                  </button>
                </div>

                <div className="flex gap-2">
                  {walkActive ? (
                    <>
                      <Button
                        onClick={handlePauseResumeWalk}
                        variant="outline"
                        className="gap-2 cursor-pointer"
                      >
                        {walkPaused ? (
                          <>
                            <Play className="size-4 text-water" /> Resume
                          </>
                        ) : (
                          <>
                            <Pause className="size-4 text-warning" /> Pause
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleCompleteWalk}
                        className="gap-2 bg-water hover:bg-water/80 text-white animate-pulse cursor-pointer"
                      >
                        <Square className="size-4" /> Stop & Close Loop
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleStartWalk} className="gap-2 cursor-pointer">
                      <Play className="size-4" /> Start Walk recording
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handleLogWalkVertex}
                  disabled={!walkActive || walkPaused || loggedWalkPoints.length === 0}
                  variant="secondary"
                  className="gap-2 cursor-pointer"
                >
                  <PlusCircle className="size-4 text-primary" /> Log Corner Vertex
                </Button>
              </div>
            </div>
          </div>

          {/* Telemetry live log console sidebar */}
          <div className="panel p-5 flex flex-col justify-between h-full min-h-[460px]">
            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              <div>
                <h3 className="text-base font-semibold">RTK Telemetry Output</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time coordinates and DGPS lock status
                </p>
              </div>

              <div className="bg-slate-950/85 border border-border/80 rounded-lg p-3 font-mono text-[0.65rem] text-muted-foreground flex-1 overflow-y-auto space-y-1.5 min-h-[220px]">
                {consoleLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "leading-relaxed select-text",
                      log.includes(">>")
                        ? "text-primary font-semibold"
                        : log.includes("GPS Fixed")
                          ? "text-slate-400"
                          : log.includes("completed") || log.includes("started")
                            ? "text-water animate-pulse"
                            : "",
                    )}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border mt-4 shrink-0">
              <div className="grid grid-cols-3 gap-2 text-xs mb-3 font-mono">
                <div className="bg-muted/30 border border-border p-2 rounded text-center">
                  <span className="block text-[0.55rem] text-muted-foreground uppercase tracking-wider">
                    H-Acc
                  </span>
                  <span className="text-xs font-semibold text-foreground mt-0.5">
                    {gpsAccuracy !== null ? `±${gpsAccuracy.toFixed(1)}m` : "--"}
                  </span>
                </div>
                <div className="bg-muted/30 border border-border p-2 rounded text-center">
                  <span className="block text-[0.55rem] text-muted-foreground uppercase tracking-wider">
                    Altitude
                  </span>
                  <span className="text-xs font-semibold text-foreground mt-0.5">
                    {gpsAltitude !== null ? `${gpsAltitude.toFixed(0)}m` : "--"}
                  </span>
                </div>
                <div className="bg-muted/30 border border-border p-2 rounded text-center">
                  <span className="block text-[0.55rem] text-muted-foreground uppercase tracking-wider">
                    Est Area
                  </span>
                  <span className="text-xs font-semibold text-water mt-0.5">
                    {calculateGeodesicArea(loggedWalkPoints)} Ac
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCompleteWalk}
                disabled={walkActive || loggedWalkPoints.length < 3}
                className="w-full gap-2 cursor-pointer"
                variant="default"
              >
                <CheckCircle2 className="size-4" /> Save Telemetry Boundary
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
