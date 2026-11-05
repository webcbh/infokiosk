import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import QRCode from "react-qr-code";
import { LazyImage } from "./components/LazyImage";
import DailyProgramLayout from "./components/DailyProgramLayout";
import RestaurantsGridLayout from "./components/RestaurantsGridLayout";
import RestaurantSubmodule from "./components/RestaurantSubmodule";
import SpaLayout from "./components/SpaLayout";
import LoyaltyLayout from "./components/LoyaltyLayout";
import SuitesGridLayout from "./components/SuitesGridLayout";
import DirectoryOfServicesLayout from "./components/DirectoryOfServicesLayout";
import WeatherLayout from "./components/WeatherLayout";
import LocalAttractionsLayout from "./components/LocalAttractionsLayout";
import WeddingsLayout from "./components/WeddingsLayout";
import AwardsLayout from "./components/AwardsLayout";
import GeneralInfoLayout from "./components/GeneralInfoLayout";
import BusRoutesLayout from "./components/BusRoutesLayout";
import AirportInfoLayout from "./components/AirportInfoLayout";
import InteractiveMapLayout from "./components/InteractiveMapLayout";
import GolfLayout from "./components/GolfLayout";
import { GolfDetailsLayout } from "./components/GolfDetailsLayout";
import { moduleRegistry } from "./modules/ModuleRegistry";
import { moduleBus } from "./modules/ModuleBus";
import { ModuleRenderer } from "./modules/ModuleRenderer";
import type { ModuleContext } from "./modules/types";

// High-fidelity resort images for hotel cards on the landing page
const DEFAULT_HOTEL_IMAGES: Record<string, string> = {
  h1: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop", // Asimina Suites
  h2: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop", // Athena Beach
  h3: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1600&auto=format&fit=crop", // Athena Royal
  h4: "https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1600&auto=format&fit=crop", // Pioneer Beach
};

const HOTEL_DESCRIPTIONS: Record<string, { tag: string; stars: string; highlight: string }> = {
  h1: { tag: "Adult-Focused Luxury Suites", stars: "5-Star Deluxe", highlight: "Exclusive beachfront suites with private pools & tranquil gardens in Kato Paphos" },
  h2: { tag: "Beachfront Resort & Spa", stars: "4-Star Superior", highlight: "Renowned beachfront location with exquisite dining, wellness & Mediterranean views" },
  h3: { tag: "Adults-Only Waterfront Haven", stars: "4-Star Superior", highlight: "Designed for couples & adults seeking tranquility, refined culinary choices & spa" },
  h4: { tag: "Adults-Only Beach Retreat", stars: "4-Star Deluxe", highlight: "Peaceful beachside setting with serene gardens, exceptional service & leisure" },
};

export function DynamicMobileIcon({ name, title, size = 32, strokeWidth = 1.75, className = "text-[#E5A830]" }: { name?: string; title?: string; size?: number; strokeWidth?: number; className?: string }) {
  let iconName = name || "";
  const t = (title || "").toLowerCase();

  if (!iconName || iconName === "HelpCircle" || iconName === "Circle" || iconName === "default" || iconName === "Sparkles") {
    if (t.includes("directory") || t.includes("service")) iconName = "ConciergeBell";
    else if (t.includes("suite") || t.includes("room") || t.includes("bed")) iconName = "Bed";
    else if (t.includes("reservation")) iconName = "ConciergeBell";
    else if (t.includes("restaurant") || t.includes("dining")) iconName = "Utensils";
    else if (t.includes("bar") || t.includes("cocktail") || t.includes("drink")) iconName = "Martini";
    else if (t.includes("program") || t.includes("daily") || t.includes("music")) iconName = "Music";
    else if (t.includes("tour") || t.includes("excursion") || t.includes("camera")) iconName = "Camera";
    else if (t.includes("spa") || t.includes("wellness") || t.includes("elixir")) iconName = "Flower2";
    else if (t.includes("loyalty") || t.includes("club") || t.includes("gift")) iconName = "Gift";
    else if (t.includes("golf")) iconName = "Flag";
    else if (t.includes("award") || t.includes("achievement")) iconName = "Trophy";
    else if (t.includes("map")) iconName = "Map";
    else if (t.includes("weather")) iconName = "Sun";
    else if (t.includes("info") || t.includes("general")) iconName = "Info";
    else if (t.includes("wedding")) iconName = "Heart";
    else if (t.includes("attraction") || t.includes("nearby") || t.includes("place")) iconName = "MapPin";
    else if (t.includes("check-in")) iconName = "ConciergeBell";
  }

  if (iconName.toLowerCase() === "wine") iconName = "Martini";
  if (iconName.toLowerCase() === "spa" || iconName.toLowerCase() === "lotus") iconName = "Flower2";
  if (iconName.toLowerCase() === "bell") iconName = "ConciergeBell";
  if (iconName.toLowerCase() === "beddouble") iconName = "Bed";

  const IconComp = (LucideIcons as any)[iconName] || (LucideIcons as any)[name || ""] || LucideIcons.Sparkles;
  return <IconComp size={size} strokeWidth={strokeWidth} className={className} />;
}

export function MobileAppView({
  config,
  currentHotel,
  selectedHotelId,
  setSelectedHotelId,
  weather,
  setWeather,
  showCheckInModal,
  setShowCheckInModal,
}: {
  config: any;
  currentHotel: any;
  selectedHotelId: string | null;
  setSelectedHotelId: (id: string) => void;
  weather: any;
  setWeather: any;
  showCheckInModal: boolean;
  setShowCheckInModal: (show: boolean) => void;
}) {
  // If user selected a hotel before, check if they explicitly want the landing page or hotel services
  const [viewMode, setViewMode] = useState<"landing" | "services">(() => {
    // If no hotel is selected or user passed ?landing=true, start at landing
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("landing") === "true") return "landing";
      const saved = localStorage.getItem("mobile_selected_hotel_id");
      if (saved && selectedHotelId) return "services";
    }
    return selectedHotelId ? "services" : "landing";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [activeMobileModule, setActiveMobileModule] = useState<any>(null);
  const [activeMobileSubmodule, setActiveMobileSubmodule] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"home" | "program" | "hotels" | "checkin">("home");

  // Keep viewMode synced if hotel selection changes
  useEffect(() => {
    if (!selectedHotelId) {
      setViewMode("landing");
    }
  }, [selectedHotelId]);

  // Weather fallback if not provided
  useEffect(() => {
    if (!weather) {
      async function fetchWeather() {
        try {
          const res = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=34.7667&longitude=32.4167&current=temperature_2m,weather_code&timezone=auto"
          );
          if (res.ok) {
            const data = await res.json();
            const temp = Math.round(data.current?.temperature_2m || 24);
            const code = data.current?.weather_code || 0;
            setWeather({ temp, code, description: code === 0 ? "Clear sky" : "Sunny & Warm" });
          }
        } catch (e) {
          setWeather({ temp: 24, code: 0, description: "Sunny & Warm" });
        }
      }
      fetchWeather();
    }
  }, [weather, setWeather]);

  const activeHotels = (config?.hotels || []).filter((h: any) => h.active !== false);

  const handleSelectHotel = (hotelId: string) => {
    setSelectedHotelId(hotelId);
    if (typeof window !== "undefined") {
      localStorage.setItem("mobile_selected_hotel_id", hotelId);
      localStorage.setItem("kiosk_hotel_id", hotelId);
    }
    setViewMode("services");
    setActiveTab("home");
    setActiveMobileModule(null);
    setActiveMobileSubmodule(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToLanding = () => {
    setActiveMobileModule(null);
    setActiveMobileSubmodule(null);
    setViewMode("landing");
    setActiveTab("hotels");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Dynamic mobile plugins from ModuleRegistry
  let rawMobileModules = [...(currentHotel?.content?.modules || [])];

  const activeMobilePlugins = moduleRegistry.getActive(currentHotel?.id, "mobile");
  activeMobilePlugins.forEach((p) => {
    const pid = p.manifest.id;
    if (pid === "currency-calc" || pid === "guest-survey" || p.manifest.isCustom) {
      if (!rawMobileModules.some((m: any) => m.id === pid)) {
        rawMobileModules.push({
          id: pid,
          icon: p.manifest.icon,
          title: p.manifest.name,
          subtitle: p.manifest.subtitle || p.manifest.description,
          image: p.manifest.bannerImage || "",
          isCustom: p.manifest.isCustom,
          submodules: []
        });
      }
    }
  });

  // Mobile data filtering: ONLY show items where showOnMobile !== false and isEnabled in ModuleRegistry
  const mobileModules = rawMobileModules
    .filter((m: any) => m.showOnMobile !== false)
    .filter((m: any) => moduleRegistry.isEnabled(m.id, currentHotel?.id));

  const mobileActions = (currentHotel?.content?.actions || []).filter(
    (a: any) => a.showOnMobile !== false
  );

  // Standard ModuleContext bridge provided to all modules and plugins on Mobile
  const mobileContext: ModuleContext = React.useMemo(() => ({
    hotel: currentHotel,
    platform: "mobile",
    theme: {
      primaryColor: "#06152a",
      secondaryColor: "#E5A830",
      accentColor: "#F5BC45",
      backgroundColor: "#040d1a",
      isDark: true,
    },
    storage: {
      get: (k: string, def?: any) => {
        try {
          const val = localStorage.getItem(`mod_${k}`);
          return val ? JSON.parse(val) : def;
        } catch {
          return def;
        }
      },
      set: (k: string, v: any) => {
        try {
          localStorage.setItem(`mod_${k}`, JSON.stringify(v));
        } catch {}
      },
      remove: (k: string) => localStorage.removeItem(`mod_${k}`),
      clear: () => {},
    },
    bus: moduleBus.createScopedBus(activeMobileModule?.id || "mobile-shell"),
    navigation: {
      openModule: (id: string, params?: any) => {
        const target = moduleRegistry.get(id);
        if (target) {
          setActiveMobileModule({ id, title: target.manifest.name, ...params });
        } else {
          setActiveMobileModule({ id, ...params });
        }
      },
      closeModule: () => setActiveMobileModule(null),
      openSubmodule: (sub: any) => setActiveMobileSubmodule(sub),
      closeSubmodule: () => setActiveMobileSubmodule(null),
      navigateToHotel: (id: string) => handleSelectHotel(id),
    },
    weather,
    config: moduleRegistry.getModuleState(activeMobileModule?.id || "").config || {},
    notify: () => {},
  }), [currentHotel, activeMobileModule, weather]);

  // Search filter
  const filteredModules = mobileModules.filter((m: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (m.title || "").toLowerCase().includes(q) ||
      (m.subtitle || "").toLowerCase().includes(q)
    );
  });

  const filteredActions = mobileActions.filter((a: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (a.title || "").toLowerCase().includes(q) ||
      (a.subtitle || "").toLowerCase().includes(q)
    );
  });

  // Action Click Handler
  const handleActionClick = (act: any) => {
    if (act.title?.toLowerCase().includes("check-in") || act.title?.toLowerCase().includes("check in")) {
      setShowCheckInModal(true);
      return;
    }
    if (act.moduleId) {
      const targetMod = (currentHotel?.content?.modules || []).find((m: any) => m.id === act.moduleId);
      if (targetMod) {
        setActiveMobileModule(targetMod);
        return;
      }
    }
    if (act.url) {
      window.open(act.url, "_blank");
      return;
    }
    if (act.title?.toLowerCase().includes("book") || act.title?.toLowerCase().includes("reserve")) {
      const diningMod = (currentHotel?.content?.modules || []).find((m: any) =>
        (m.title || "").toLowerCase().includes("restaurant")
      );
      if (diningMod) {
        setActiveMobileModule(diningMod);
        return;
      }
    }
    setShowCheckInModal(true);
  };

  // Open submodule from module views
  const handleOpenSubmodule = (sub: any, options?: any) => {
    setActiveMobileSubmodule(sub);
  };

  // ==========================================
  // RENDER: MODULE & SUBMODULE OVERLAY
  // ==========================================
  if (activeMobileSubmodule) {
    return (
      <div className="min-h-screen bg-[#040d1a] text-white font-sans pb-20 selection:bg-[#E5A830]">
        {/* Sticky Mobile Header */}
        <div className="sticky top-0 z-50 bg-[#06152a]/95 backdrop-blur-md border-b border-[#E5A830]/40 px-4 py-3.5 flex items-center justify-between shadow-lg">
          <button
            onClick={() => setActiveMobileSubmodule(null)}
            className="flex items-center gap-1.5 text-[#E5A830] font-semibold text-xs uppercase tracking-wider active:scale-95 transition-transform"
          >
            <LucideIcons.ChevronLeft size={18} strokeWidth={2.5} />
            <span>{activeMobileModule?.title || "Back"}</span>
          </button>
          <div className="text-right">
            <span className="text-[10px] text-[#A8B6CA] uppercase tracking-widest block font-sans">
              {currentHotel?.name ? currentHotel.name.replace("Constantinou Bros ", "") : "CB Hotels"}
            </span>
            <span className="text-xs font-serif text-[#E5A830] tracking-wide truncate max-w-[150px] inline-block font-semibold">
              {activeMobileSubmodule.title}
            </span>
          </div>
        </div>

        {/* Submodule Content */}
        <div className="p-4">
          {activeMobileSubmodule.layout === "restaurant" ? (
            <RestaurantSubmodule submodule={activeMobileSubmodule} onClose={() => setActiveMobileSubmodule(null)} />
          ) : activeMobileSubmodule.layout === "golfDetails" ? (
            <GolfDetailsLayout module={activeMobileSubmodule} onClose={() => setActiveMobileSubmodule(null)} />
          ) : (
            <div className="bg-gradient-to-b from-[#06152a] to-[#040d1a] rounded-2xl border border-[#E5A830]/40 p-5 shadow-xl">
              {activeMobileSubmodule.image && (
                <div className="w-full h-52 rounded-xl overflow-hidden mb-5 border border-[#E5A830]/30 shadow-md">
                  <LazyImage src={activeMobileSubmodule.image} alt={activeMobileSubmodule.title} className="w-full h-full object-cover" />
                </div>
              )}
              <h2 className="text-2xl font-serif text-[#E5A830] mb-2">{activeMobileSubmodule.title}</h2>
              {activeMobileSubmodule.subtitle && (
                <p className="text-sm text-[#A8B6CA] font-medium mb-4">{activeMobileSubmodule.subtitle}</p>
              )}
              {activeMobileSubmodule.content && (
                <div
                  className="prose prose-invert prose-sm text-slate-200 leading-relaxed font-sans mb-6"
                  dangerouslySetInnerHTML={{ __html: activeMobileSubmodule.content }}
                />
              )}
              {activeMobileSubmodule.button?.label && (
                <button
                  onClick={() => {
                    if (activeMobileSubmodule.button.url) window.open(activeMobileSubmodule.button.url, "_blank");
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#E5A830] to-[#F5BC45] text-[#06152a] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <LucideIcons.Calendar size={16} />
                  <span>{activeMobileSubmodule.button.label}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeMobileModule) {
    let pluginId = activeMobileModule.id;
    if (!moduleRegistry.get(pluginId)) {
      const t = (activeMobileModule.title || "").toLowerCase();
      if (t.includes("daily program")) pluginId = "m6";
      else if (t.includes("restaurant") || t.includes("dining")) pluginId = "m3";
      else if (t.includes("spa") || t.includes("elixir")) pluginId = "m8";
      else if (t.includes("loyalty")) pluginId = "m9";
      else if (t.includes("suite") || t.includes("room")) pluginId = "m2";
      else if (t.includes("directory")) pluginId = "m1";
      else if (t.includes("weather")) pluginId = "m13";
      else if (t.includes("wedding")) pluginId = "m15";
      else if (t.includes("award")) pluginId = "m11";
      else if (t.includes("general info")) pluginId = "m14";
      else if (t.includes("attraction")) pluginId = "m16";
      else if (t.includes("golf")) pluginId = "m10";
      else if (t.includes("map")) pluginId = "m12";
      else if (t.includes("airport") || t.includes("flight")) pluginId = "airport";
      else if (t.includes("bus")) pluginId = "bus_routes";
    }

    if (moduleRegistry.get(pluginId)) {
      return (
        <div className="min-h-screen bg-[#040d1a] text-white font-sans pb-24 selection:bg-[#E5A830]">
          <ModuleRenderer
            moduleId={pluginId}
            context={mobileContext}
            moduleData={activeMobileModule}
            onClose={() => setActiveMobileModule(null)}
          />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#040d1a] text-white font-sans pb-24 selection:bg-[#E5A830]">
        {/* Sticky Mobile Module Header */}
        <div className="sticky top-0 z-50 bg-[#06152a]/95 backdrop-blur-md border-b border-[#E5A830]/40 px-4 py-3 flex items-center justify-between shadow-lg">
          <button
            onClick={() => setActiveMobileModule(null)}
            className="flex items-center gap-1.5 text-[#E5A830] font-semibold text-xs uppercase tracking-wider active:scale-95 transition-transform"
          >
            <LucideIcons.ChevronLeft size={18} strokeWidth={2.5} />
            <span>Services</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-serif text-xs font-semibold text-white uppercase tracking-wider truncate max-w-[180px]">
              {activeMobileModule.title}
            </span>
          </div>
          <button
            onClick={() => setActiveMobileModule(null)}
            className="w-7 h-7 rounded-full bg-[#081a33] border border-[#E5A830]/50 flex items-center justify-center text-[#E5A830] active:scale-90"
          >
            <LucideIcons.X size={14} />
          </button>
        </div>

        <div className="w-full">
            <div className="p-4 space-y-4">
              <div className="bg-gradient-to-r from-[#06152a] via-[#081a33] to-[#06152a] p-5 rounded-2xl border-[1.5px] border-[#E5A830] shadow-xl">
                {activeMobileModule.image && (
                  <div className="w-full h-48 rounded-xl overflow-hidden mb-4 border border-[#E5A830]/30">
                    <LazyImage src={activeMobileModule.image} alt={activeMobileModule.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h1 className="text-xl font-serif text-white font-bold mb-1">{activeMobileModule.title}</h1>
                {activeMobileModule.subtitle && (
                  <p className="text-xs text-[#A8B6CA] mb-3">{activeMobileModule.subtitle}</p>
                )}
                {activeMobileModule.content && (
                  <div
                    className="prose prose-invert prose-sm text-slate-200 leading-relaxed font-sans"
                    dangerouslySetInnerHTML={{ __html: activeMobileModule.content }}
                  />
                )}
              </div>

              {/* Submodules list if present */}
              {activeMobileModule.submodules && activeMobileModule.submodules.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-[#E5A830] px-1">
                    Featured Items
                  </h3>
                  {activeMobileModule.submodules.map((sub: any) => (
                    <button
                      key={sub.id}
                      onClick={() => handleOpenSubmodule(sub)}
                      className="w-full bg-gradient-to-r from-[#06152a] via-[#081a33] to-[#06152a] p-3.5 rounded-2xl border-[1.5px] border-[#E5A830] flex items-center gap-3 text-left active:scale-95 transition-all shadow-md"
                    >
                      {sub.image ? (
                        <img src={sub.image} alt={sub.title} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E5A830]/30" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-[#E5A830]/10 flex items-center justify-center text-[#E5A830] shrink-0">
                          <LucideIcons.Sparkles size={20} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs uppercase text-white truncate">{sub.title}</h4>
                        <p className="text-[11px] text-[#A8B6CA] truncate">{sub.subtitle || "View details"}</p>
                      </div>
                      <div className="w-7 h-7 rounded-full border-[1.5px] border-[#E5A830] flex items-center justify-center text-[#E5A830] shrink-0">
                        <LucideIcons.ChevronRight size={14} strokeWidth={2.2} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW MODE 1: HOTEL SELECTION LANDING PAGE
  // ==========================================
  if (viewMode === "landing" || !currentHotel) {
    return (
      <div className="min-h-screen bg-[#040d1a] text-white font-sans pb-28 selection:bg-[#E5A830] relative overflow-x-hidden">
        {/* Luxury Atmospheric Background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#14325a]/40 to-transparent blur-3xl opacity-60" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#E5A830]/5 blur-3xl" />
        </div>

        {/* Landing Header */}
        <div className="relative z-10 pt-10 pb-6 px-5 text-center flex flex-col items-center">
          {/* CB Emblem */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 rounded-xl border-2 border-[#E5A830] flex items-center justify-center text-[#E5A830] shadow-[0_0_30px_rgba(229,168,48,0.25)] mb-4 bg-gradient-to-b from-[#081a33] to-[#040d1a]"
          >
            <span className="font-serif text-2xl font-bold tracking-tight">CB</span>
          </motion.div>

          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="font-serif tracking-[0.25em] text-[#E5A830] text-xs uppercase mb-1 font-semibold">
              Constantinou Bros Hotels
            </div>
            <div className="text-[10px] tracking-[0.35em] text-[#A8B6CA] uppercase mb-4">
              Pafos • Cyprus
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-wide leading-tight mb-2">
              Select Your Resort
            </h1>
            <p className="text-xs sm:text-sm text-[#A8B6CA] max-w-sm mx-auto leading-relaxed font-sans">
              Choose your hotel to unlock tailored guest services, gourmet dining menus, daily programs, and luxury spa reservations.
            </p>
          </motion.div>

          {/* Weather & Location Pill */}
          {weather && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-4 inline-flex items-center gap-2 bg-[#081a33]/80 border border-[#E5A830]/40 rounded-full px-4 py-1.5 shadow-sm text-xs text-white"
            >
              <LucideIcons.Sun className="text-[#E5A830] w-4 h-4 animate-spin-slow" />
              <span className="font-semibold text-[#E5A830]">{weather.temp}°C</span>
              <span className="text-white/40">|</span>
              <span className="text-slate-300">Paphos, Cyprus</span>
            </motion.div>
          )}
        </div>

        {/* Hotel Cards List */}
        <div className="relative z-10 px-4 max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#E5A830]">
              Available Resorts ({activeHotels.length})
            </span>
            <span className="text-[10px] text-[#A8B6CA] uppercase tracking-wider">
              Tap to enter
            </span>
          </div>

          {activeHotels.map((hotel: any, idx: number) => {
            const isCurrentlySelected = hotel.id === selectedHotelId;
            const hotelMeta = HOTEL_DESCRIPTIONS[hotel.id] || {
              tag: "Luxury Beachfront Resort",
              stars: "5-Star Luxury",
              highlight: "Exceptional Mediterranean hospitality, exquisite dining, and world-class leisure amenities.",
            };
            const hotelImg =
              (hotel.content?.banners && hotel.content.banners[0]) ||
              DEFAULT_HOTEL_IMAGES[hotel.id] ||
              "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600&auto=format&fit=crop";

            const enabledModulesCount = (hotel.content?.modules || []).filter(
              (m: any) => m.showOnMobile !== false
            ).length;

            return (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + idx * 0.1 }}
                onClick={() => handleSelectHotel(hotel.id)}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#06152a] via-[#081a33] to-[#06152a] border-[1.5px] ${
                  isCurrentlySelected ? "border-[#F5BC45] shadow-[0_0_24px_rgba(229,168,48,0.3)] ring-1 ring-[#F5BC45]" : "border-[#E5A830] hover:border-[#F5BC45]"
                } shadow-xl active:scale-[0.98] transition-all cursor-pointer`}
              >
                {/* Hotel Image Banner */}
                <div className="relative h-36 w-full overflow-hidden">
                  <img
                    src={hotelImg}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06152a] via-[#06152a]/50 to-transparent" />
                  
                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-[#06152a]/90 backdrop-blur-md border border-[#E5A830] text-[#E5A830] font-sans text-[10px] font-bold tracking-wider uppercase">
                      {hotelMeta.stars}
                    </span>
                    {isCurrentlySelected && (
                      <span className="px-2.5 py-1 rounded-full bg-[#E5A830] text-[#06152a] font-sans text-[10px] font-black tracking-wider uppercase flex items-center gap-1 shadow-sm">
                        <LucideIcons.Check size={11} strokeWidth={3} /> Active
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#081a33]/80 border border-white/20 text-white/90 text-[10px] font-medium backdrop-blur-sm">
                      {enabledModulesCount} Mobile Services
                    </span>
                  </div>
                </div>

                {/* Hotel Content Details */}
                <div className="p-4">
                  <div className="text-[10px] font-serif tracking-[0.2em] text-[#E5A830] uppercase mb-1">
                    {hotelMeta.tag}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white tracking-wide leading-snug mb-1.5 group-hover:text-[#F5BC45] transition-colors">
                    {hotel.name}
                  </h3>
                  <p className="text-[11.5px] text-[#A8B6CA] line-clamp-2 leading-relaxed mb-3">
                    {hotelMeta.highlight}
                  </p>

                  {/* Card Action Footer */}
                  <div className="pt-2 border-t border-[#E5A830]/20 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#E5A830] uppercase tracking-wider flex items-center gap-1.5">
                      Explore Hotel Services
                    </span>
                    <div className="w-8 h-8 rounded-full border-[1.5px] border-[#E5A830] group-hover:bg-[#E5A830]/20 flex items-center justify-center text-[#E5A830] transition-colors shadow-sm">
                      <LucideIcons.ArrowRight size={14} strokeWidth={2.4} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Subtle Footer Switch to Kiosk Option */}
        <div className="relative z-10 text-center mt-10 mb-6">
          <a
            href="/?kiosk=true"
            className="inline-flex items-center gap-1.5 text-xs text-[#A8B6CA]/70 hover:text-[#E5A830] transition-colors uppercase tracking-widest font-mono"
          >
            <LucideIcons.Monitor size={14} />
            <span>Switch to Kiosk Display Mode</span>
          </a>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW MODE 2: SELECTED HOTEL SERVICES VIEW
  // ==========================================
  return (
    <div className="min-h-screen bg-[#040d1a] text-white font-sans pb-28 selection:bg-[#E5A830] relative overflow-x-hidden">
      {/* Luxury Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[360px] bg-gradient-to-b from-[#14325a]/30 to-transparent blur-3xl opacity-50" />
      </div>

      {/* Top Luxury Mobile Header */}
      <div className="relative z-20 bg-gradient-to-b from-[#06152a] via-[#081a33] to-[#06152a] border-b border-[#E5A830]/30 shadow-2xl pt-10 pb-6 px-4 rounded-b-[2rem]">
        <div className="max-w-md mx-auto">
          {/* Top Row: Hotel Brand & Switch Button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-lg border-[1.5px] border-[#E5A830] flex items-center justify-center text-[#E5A830] bg-[#040d1a] shrink-0 shadow-[0_0_15px_rgba(229,168,48,0.2)]">
                <span className="font-serif text-lg font-bold tracking-tighter">CB</span>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] tracking-[0.2em] font-serif text-[#E5A830] uppercase">
                  Constantinou Bros
                </div>
                <h1 className="text-sm sm:text-base font-serif font-bold text-white tracking-wide truncate">
                  {currentHotel?.name ? currentHotel.name.replace("Constantinou Bros ", "") : "Resort"}
                </h1>
              </div>
            </div>

            {/* Change Hotel Affordance */}
            <button
              onClick={handleBackToLanding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#040d1a] border border-[#E5A830]/60 text-[#E5A830] hover:border-[#E5A830] hover:text-white transition-all text-[11px] font-semibold uppercase tracking-wider shrink-0 shadow-sm active:scale-95 cursor-pointer"
            >
              <LucideIcons.Hotel size={13} />
              <span>Switch</span>
            </button>
          </div>

          {/* Welcoming Tagline & Weather */}
          <div className="flex items-center justify-between text-xs text-[#A8B6CA] mb-4 px-1">
            <span className="font-serif italic text-[#E5A830]">
              {currentHotel?.content?.heroTexts?.titleTop || "Awarded Mediterranean Hospitality"}
            </span>
            {weather && (
              <span className="flex items-center gap-1 text-[11px] text-white/80 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                <LucideIcons.Sun size={12} className="text-[#E5A830]" />
                {weather.temp}°C
              </span>
            )}
          </div>

          {/* Signature Gold-Border Search Engine (Exact Match to User Attached Design) */}
          <div className="relative flex items-center bg-white rounded-full border-2 border-[#E5A830] shadow-[0_4px_24px_rgba(229,168,48,0.25)]">
            <LucideIcons.Search className="ml-4 mr-2 text-[#07172e] w-5 h-5 shrink-0 stroke-[2.4]" />
            <input
              type="text"
              placeholder="Search services, activities, or amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent py-2.5 text-[#07172e] placeholder:text-slate-500/85 text-xs sm:text-sm font-medium focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1.5 mr-1 text-slate-400 hover:text-slate-700"
              >
                <LucideIcons.X className="w-4 h-4" />
              </button>
            )}
            <div className="mr-1.5 w-8 h-8 rounded-full bg-[#07172e] text-white flex items-center justify-center shrink-0 shadow-sm">
              <LucideIcons.ArrowRight className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-md mx-auto px-4 mt-6 space-y-6">
        {/* Quick Actions (Only Mobile-Enabled Data) */}
        {filteredActions.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-1 mb-2.5">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#E5A830]">
                Quick Services
              </span>
              <span className="text-[10px] text-[#A8B6CA] uppercase">
                {filteredActions.length} Actions
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {filteredActions.map((act: any) => {
                const isCheckIn = (act.title || "").toLowerCase().includes("check-in");
                return (
                  <motion.button
                    key={act.id}
                    whileTap={{ scale: 0.96 }}
                    animate={
                      isCheckIn
                        ? {
                            boxShadow: [
                              "0px 0px 0px rgba(229,168,48,0)",
                              "0px 0px 18px rgba(229,168,48,0.45)",
                              "0px 0px 0px rgba(229,168,48,0)",
                            ],
                          }
                        : {}
                    }
                    transition={
                      isCheckIn
                        ? { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
                        : {}
                    }
                    onClick={() => handleActionClick(act)}
                    className={`bg-gradient-to-r from-[#06152a] via-[#081a33] to-[#06152a] p-3.5 rounded-2xl shadow-lg border-[1.5px] border-[#E5A830] flex flex-col items-center text-center gap-2 active:scale-95 transition-all text-left group ${
                      isCheckIn ? "border-2 border-[#F5BC45]" : ""
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-[#E5A830]/10 border border-[#E5A830]/30 flex items-center justify-center text-[#E5A830] group-hover:scale-105 transition-transform">
                      <DynamicMobileIcon name={act.icon} title={act.title} size={24} strokeWidth={1.75} />
                    </div>
                    <div className="font-bold text-[11.5px] tracking-wider uppercase text-white leading-tight">
                      {act.title}
                    </div>
                    {act.subtitle && (
                      <span className="text-[10px] text-[#A8B6CA] line-clamp-1">
                        {act.subtitle}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Services & Amenities Modules (Only Mobile-Enabled Data) */}
        <div>
          <div className="flex items-center justify-between px-1 mb-3">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#E5A830]">
              Guest Directory & Amenities
            </span>
            <span className="text-[10px] text-[#A8B6CA] uppercase">
              {filteredModules.length} Available
            </span>
          </div>

          {filteredModules.length === 0 ? (
            <div className="bg-[#06152a] border border-[#E5A830]/30 rounded-2xl p-6 text-center">
              <LucideIcons.Search className="w-8 h-8 text-[#E5A830]/50 mx-auto mb-2" />
              <p className="text-xs text-white font-semibold">No services matched "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 px-3 py-1.5 rounded-full bg-[#E5A830] text-[#06152a] text-xs font-bold uppercase tracking-wider"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredModules.map((mod: any) => {
                const isCheckIn = (mod.title || "").toLowerCase().includes("check-in");
                return (
                  <motion.button
                    key={mod.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (isCheckIn) {
                        setShowCheckInModal(true);
                      } else {
                        setActiveMobileModule(mod);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={`w-full bg-gradient-to-r from-[#06152a] via-[#081a33] to-[#06152a] p-3.5 sm:p-4 rounded-2xl shadow-lg border-[1.5px] border-[#E5A830] hover:border-[#F5BC45] flex items-center gap-3.5 active:scale-95 transition-all text-left group ${
                      isCheckIn ? "border-2 border-[#F5BC45]" : ""
                    }`}
                  >
                    {/* Left Icon (Gold Outlined) */}
                    <div className="w-12 h-12 rounded-xl bg-transparent flex shrink-0 items-center justify-center text-[#E5A830] group-hover:scale-105 transition-transform">
                      <DynamicMobileIcon name={mod.icon} title={mod.title} size={32} strokeWidth={1.75} />
                    </div>

                    {/* Middle: Title & Subtitle */}
                    <div className="flex-1 min-w-0 pr-1">
                      <h3 className="font-bold text-xs sm:text-[13px] tracking-wider uppercase text-white truncate drop-shadow-sm">
                        {mod.title}
                      </h3>
                      <p className="text-[11px] text-[#A8B6CA] group-hover:text-white/90 mt-0.5 line-clamp-1 transition-colors">
                        {mod.subtitle || "Tap to explore services"}
                      </p>
                    </div>

                    {/* Right: Gold Circular Arrow Badge */}
                    <div className="w-8 h-8 shrink-0 rounded-full border-[1.5px] border-[#E5A830] group-hover:bg-[#E5A830]/20 flex items-center justify-center text-[#E5A830] transition-all shadow-sm">
                      <LucideIcons.ArrowRight size={14} strokeWidth={2.2} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Online Check-in Modal */}
      <AnimatePresence>
        {showCheckInModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-[#081a33] to-[#06152a] border border-[#E5A830] p-6 rounded-3xl max-w-sm w-full relative flex flex-col items-center text-center shadow-2xl"
            >
              <button
                onClick={() => setShowCheckInModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white"
              >
                <LucideIcons.X size={20} />
              </button>

              <div className="w-14 h-14 rounded-full border border-[#E5A830] bg-[#040d1a] text-[#E5A830] flex items-center justify-center mb-4">
                <LucideIcons.Smartphone size={24} />
              </div>

              <h2 className="text-xl font-serif text-white font-bold mb-1">
                Mobile Check-in
              </h2>
              <p className="text-xs text-[#A8B6CA] mb-5">
                Complete your guest registration securely right from your device.
              </p>

              <div className="bg-white p-3 rounded-2xl shadow-[0_0_30px_rgba(229,168,48,0.2)] mb-5">
                <QRCode
                  value={typeof window !== "undefined" ? window.location.origin + "/check-in?hotelId=" + currentHotel?.id : "https://cbh-checkin.com"}
                  size={170}
                />
              </div>

              <button
                onClick={() => setShowCheckInModal(false)}
                className="w-full py-2.5 bg-[#E5A830] text-[#06152a] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Luxury Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-[#06152a]/95 backdrop-blur-md border-t border-[#E5A830]/40 py-2.5 px-6 pb-safe flex justify-around items-center z-40 shadow-2xl">
        <button
          onClick={() => {
            setActiveTab("home");
            setActiveMobileModule(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center transition-colors ${activeTab === "home" ? "text-[#E5A830]" : "text-[#A8B6CA] hover:text-white"}`}
        >
          <LucideIcons.Home size={20} strokeWidth={activeTab === "home" ? 2.2 : 1.75} />
          <span className="text-[10px] font-semibold mt-1 uppercase tracking-wider">Services</span>
        </button>

        <button
          onClick={() => {
            const progMod = (currentHotel?.content?.modules || []).find(
              (m: any) =>
                m.id === "m6" || (m.title || "").toLowerCase().includes("daily program")
            );
            if (progMod) {
              setActiveMobileModule(progMod);
              setActiveTab("program");
            }
          }}
          className={`flex flex-col items-center transition-colors ${activeTab === "program" ? "text-[#E5A830]" : "text-[#A8B6CA] hover:text-white"}`}
        >
          <LucideIcons.Calendar size={20} strokeWidth={activeTab === "program" ? 2.2 : 1.75} />
          <span className="text-[10px] font-semibold mt-1 uppercase tracking-wider">Program</span>
        </button>

        <button
          onClick={handleBackToLanding}
          className="flex flex-col items-center text-[#A8B6CA] hover:text-[#E5A830] transition-colors"
        >
          <LucideIcons.Hotel size={20} strokeWidth={1.75} />
          <span className="text-[10px] font-semibold mt-1 uppercase tracking-wider">Hotels</span>
        </button>

        <button
          onClick={() => setShowCheckInModal(true)}
          className="flex flex-col items-center text-[#A8B6CA] hover:text-[#E5A830] transition-colors"
        >
          <LucideIcons.CheckSquare size={20} strokeWidth={1.75} />
          <span className="text-[10px] font-semibold mt-1 uppercase tracking-wider">Check-in</span>
        </button>
      </div>
    </div>
  );
}
