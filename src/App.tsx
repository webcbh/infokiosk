import { GolfDetailsLayout } from "./components/GolfDetailsLayout";
import { MobileAppView } from "./MobileAppView";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import * as LucideIcons from "lucide-react";
import AwardsLayout from "./components/AwardsLayout";
import GolfLayout from "./components/GolfLayout";
import LoyaltyLayout from "./components/LoyaltyLayout";
import SpaLayout from "./components/SpaLayout";
import WeddingsLayout from "./components/WeddingsLayout";
import DirectoryOfServicesLayout from "./components/DirectoryOfServicesLayout";
import WeatherLayout from "./components/WeatherLayout";
import GeneralInfoLayout from "./components/GeneralInfoLayout";
import BusRoutesLayout from "./components/BusRoutesLayout";
import AirportInfoLayout from "./components/AirportInfoLayout";
import InteractiveMapLayout from "./components/InteractiveMapLayout";
import SuitesGridLayout from "./components/SuitesGridLayout";
import RestaurantsGridLayout from "./components/RestaurantsGridLayout";
import {
  ArrowRight,
  ChevronDown,
  X,
  ChevronRight,
  Calendar,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Utility for precise Tailwind styling concatenation
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useModuleNavigation } from "./hooks/useModuleNavigation";
import { LazyImage } from "./components/LazyImage";
import RestaurantSubmodule from "./components/RestaurantSubmodule";
import QRScannerModal from "./components/QRScannerModal";
import QRCode from "react-qr-code";
import SystemInfoPanel from "./components/SystemInfoPanel";
import DailyProgramLayout from "./components/DailyProgramLayout";
import LocalAttractionsLayout from "./components/LocalAttractionsLayout";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { initializeBuiltinModules } from "./modules/builtins";
import { moduleRegistry } from "./modules/ModuleRegistry";
import { moduleBus } from "./modules/ModuleBus";
import { ModuleRenderer } from "./modules/ModuleRenderer";
import type { ModuleContext } from "./modules/types";

// Initialize all built-in module plugins on startup
initializeBuiltinModules();

// Utility for precise Tailwind styling concatenation
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function DynamicIcon({ name, title, ...props }: { name: string; title?: string; [key: string]: any }) {
  let iconName = name || "";
  const t = (title || "").toLowerCase();

  if (!iconName || iconName === "HelpCircle" || iconName === "Circle" || iconName === "default") {
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

  // Common aliases
  if (iconName.toLowerCase() === "wine") iconName = "Martini";
  if (iconName.toLowerCase() === "spa" || iconName.toLowerCase() === "lotus") iconName = "Flower2";
  if (iconName.toLowerCase() === "bell") iconName = "ConciergeBell";
  if (iconName.toLowerCase() === "beddouble") iconName = "Bed";

  const Icon = (LucideIcons as any)[iconName] || (LucideIcons as any)[name] || LucideIcons.Sparkles;
  return <Icon {...props} />;
}

// Background Image Setup (placeholder)
const MAIN_BG =
  "https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=2940&auto=format&fit=crop";

function getWeatherDescription(code: number) {
  if (code === 0) return "Clear sky";
  if (code >= 1 && code <= 3) return "Partly cloudy";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Cloudy";
}

export default function App() {
  const [config, setConfig] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [overlayLoading, setOverlayLoading] = React.useState(false);
  const [selectedHotelId, setSelectedHotelId] = React.useState<string | null>(null);
  const [activeModule, setActiveModule] = React.useState<any>(null);
  const [showHotelDropdown, setShowHotelDropdown] = React.useState(false);
  const [weather, setWeather] = React.useState<{ temp: number; icon: any; code?: number; description?: string } | null>(null);
  const [showCheckInModal, setShowCheckInModal] = React.useState(false);
  const [currentBanner, setCurrentBanner] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showAdminLogin, setShowAdminLogin] = React.useState(false);
  const [adminPassword, setAdminPassword] = React.useState("");
  const [pwdError, setPwdError] = React.useState("");
  const [secretClicks, setSecretClicks] = React.useState(0);
  const [showSystemInfo, setShowSystemInfo] = React.useState(false);
  const [pairedMessage, setPairedMessage] = React.useState("");
  const [activeGalleryImage, setActiveGalleryImage] = React.useState<string | null>(null);
  const [showQRScanner, setShowQRScanner] = React.useState(false);
  
  // ADDED MISSING STATE
  const [activeSubmodule, setActiveSubmodule] = React.useState<any>(null);
  const [lightboxImage, setLightboxImage] = React.useState<string | null>(null);
  const [appStartTime] = React.useState<number>(Date.now());
  const [lastSyncTime, setLastSyncTime] = React.useState<string>(new Date().toISOString());

  const openSubmodule = (arg1: any, arg2?: any) => {
    if (arg2 !== undefined) {
      setActiveSubmodule({ modId: arg1, subId: arg2 });
    } else {
      setActiveSubmodule(arg1);
    }
  };





  // Manage browser history to allow physical back button to work naturally
  React.useEffect(() => {
    const currentState = window.history.state;
    // Calculate a unique identifier for the current view state
    const viewState = lightboxImage ? 'lightbox' : activeSubmodule ? 'submodule' : activeModule ? 'module' : showCheckInModal ? 'checkin' : 'home';
    
    if (currentState?.view !== viewState) {
       if (viewState === 'home') {
           // We are home, if we came here from a back button, we do nothing.
           // If we came here from a UI button (like X or Home), we could replace state.
       } else {
           window.history.pushState({ view: viewState }, '');
       }
    }
  }, [activeModule, activeSubmodule, showCheckInModal, lightboxImage]);

  React.useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // When back button is pressed, we figure out what to close based on what is currently open.
      if (lightboxImage) {
        setLightboxImage(null);
      } else if (activeSubmodule) {
        setActiveSubmodule(null);
      } else if (activeModule) {
        setActiveModule(null);
      } else if (showCheckInModal) {
        setShowCheckInModal(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeModule, activeSubmodule, showCheckInModal, lightboxImage]);

  const goBack = () => {
    if (activeSubmodule) {
      setActiveSubmodule(null);
    } else {
      setActiveModule(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAdminLogin = (e: React.FormEvent, type: string) => {
    e.preventDefault();
    const pin = adminPassword;
    setShowAdminLogin(false);
    setAdminPassword("");
    setPwdError("");
    if (type === "admin") {
      window.open("/admin", "_blank");
    } else if (type === "sysinfo") {
      setShowSystemInfo(true);
    } else if (type === "unlock") {
      window.location.href = "/";
    }
  };


  const [isMobileDevice, setIsMobileDevice] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get("kiosk") === "true") return false;
    if (params.get("mobile") === "true" || params.get("mode") === "mobile") return true;
    const ua = navigator.userAgent || "";
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTouchAndNarrow = (navigator.maxTouchPoints > 0 || 'ontouchstart' in window) && window.innerWidth < 1024;
    const isSmallScreen = window.innerWidth < 768;
    return isMobileUA || isTouchAndNarrow || isSmallScreen;
  });

  React.useEffect(() => {
    const handleCheckMobile = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("kiosk") === "true") {
        setIsMobileDevice(false);
        return;
      }
      if (params.get("mobile") === "true" || params.get("mode") === "mobile") {
        setIsMobileDevice(true);
        return;
      }
      const ua = navigator.userAgent || "";
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
      const isTouchAndNarrow = (navigator.maxTouchPoints > 0 || 'ontouchstart' in window) && window.innerWidth < 1024;
      const isSmallScreen = window.innerWidth < 768;
      setIsMobileDevice(isMobileUA || isTouchAndNarrow || isSmallScreen);
    };

    window.addEventListener("resize", handleCheckMobile);
    return () => window.removeEventListener("resize", handleCheckMobile);
  }, []);

  const isMobile = isMobileDevice || (config?.isMobileDevice && config?.settings?.enableMobileApp !== false);

  React.useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/admin/data");
        if (res.ok) {
          const data = await res.json();
          setConfig(data);

          // Synchronize module management state
          if (data.modulesConfig) {
            moduleRegistry.syncServerState(data.modulesConfig);
          }
          if (Array.isArray(data.customPlugins)) {
            data.customPlugins.forEach((p: any) => {
              moduleRegistry.register({
                manifest: p,
                renderDetail: () => null,
              });
            });
          }

          if (data.hotels && data.hotels.length > 0) {
            const activeHotels = data.hotels.filter((h: any) => h.active);
            if (activeHotels.length > 0) {
              const params = new URLSearchParams(window.location.search);
              const urlHotelId = params.get("hotelId");
              const mobileSavedId = localStorage.getItem("mobile_selected_hotel_id");
              const assignedHotelId = data.myDevice?.assignedHotelId;
              const savedId = localStorage.getItem("kiosk_hotel_id");

              if (urlHotelId && activeHotels.find((h: any) => h.id === urlHotelId)) {
                setSelectedHotelId(urlHotelId);
              } else if (isMobile && mobileSavedId && activeHotels.find((h: any) => h.id === mobileSavedId)) {
                setSelectedHotelId(mobileSavedId);
              } else if (assignedHotelId && activeHotels.find((h: any) => h.id === assignedHotelId)) {
                setSelectedHotelId(assignedHotelId);
                localStorage.setItem("kiosk_hotel_id", assignedHotelId);
              } else if (savedId && activeHotels.find((h: any) => h.id === savedId)) {
                setSelectedHotelId(savedId);
              } else {
                if (isMobile && !mobileSavedId && params.get("landing") !== "false") {
                  setSelectedHotelId(null);
                } else {
                  setSelectedHotelId(activeHotels[0].id);
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn("Failed to fetch config", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
    const interval = setInterval(fetchConfig, 30000);
    return () => clearInterval(interval);
  }, [isMobile]);

  // Real-time socket sync for module management and config
  React.useEffect(() => {
    const socket = io();
    socket.on("updateModules", (payload: any) => {
      if (payload) {
        if (payload.modulesConfig) {
          moduleRegistry.syncServerState(payload.modulesConfig);
        }
        if (Array.isArray(payload.customPlugins)) {
          payload.customPlugins.forEach((p: any) => {
            moduleRegistry.register({
              manifest: p,
              renderDetail: () => null,
            });
          });
        }
      }
    });
    socket.on("updateConfig", (payload: any) => {
      if (payload?.modulesConfig) {
        moduleRegistry.syncServerState(payload.modulesConfig);
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const currentHotel = config?.hotels?.find((h: any) => h.id === selectedHotelId);

  // Standard ModuleContext bridge provided to all modules and plugins
  const moduleContext: ModuleContext = React.useMemo(() => ({
    hotel: currentHotel,
    platform: isMobile ? "mobile" : "kiosk",
    theme: {
      primaryColor: "#08183A",
      secondaryColor: "#E5A830",
      accentColor: "#D9B673",
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
    bus: moduleBus.createScopedBus(activeModule?.id || "kiosk-shell"),
    navigation: {
      openModule: (id: string, params?: any) => {
        const target = moduleRegistry.get(id);
        if (target) {
          setActiveModule({ id, title: target.manifest.name, ...params });
        } else {
          setActiveModule({ id, ...params });
        }
      },
      closeModule: goBack,
      openSubmodule,
      closeSubmodule: () => setActiveSubmodule(null),
      navigateToHotel: (id: string) => setSelectedHotelId(id),
    },
    weather,
    config: moduleRegistry.getModuleState(activeModule?.id || "").config || {},
    notify: (msg: string, type?: "info" | "success" | "warning" | "error") => {
      setPairedMessage(msg);
      setTimeout(() => setPairedMessage(""), 4000);
    },
  }), [currentHotel, isMobile, activeModule, weather]);
  const banners = currentHotel?.content?.banners?.length > 0 
    ? currentHotel.content.banners 
    : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop"];

  React.useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleBottomLeftClick = () => {
    setSecretClicks(prev => {
      if (prev >= 4) {
        setShowAdminLogin(true);
        return 0;
      }
      return prev + 1;
    });
    window.setTimeout(() => setSecretClicks(0), 3000);
  };

  const goHome = () => {
    setActiveModule(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {isMobile ? (
        <MobileAppView
          config={config}
          currentHotel={currentHotel}
          selectedHotelId={selectedHotelId}
          setSelectedHotelId={setSelectedHotelId}
          weather={weather}
          setWeather={setWeather}
          showCheckInModal={showCheckInModal}
          setShowCheckInModal={setShowCheckInModal}
        />
      ) : (
        <div 
          onClick={() => setShowHotelDropdown(false)}
          className="min-h-screen bg-[#F0F2F5] text-[#0A1024] selection:bg-[#D9B673] selection:text-[#F8F9FA] pb-32 font-sans relative overflow-x-hidden select-none"
        >
          {/* Invisible bottom-left click area to exit fullscreen */}
          <div 
            className="fixed bottom-0 left-0 w-24 h-24 z-[9999] cursor-default"
            onClick={(e) => {
              e.stopPropagation();
              handleBottomLeftClick();
            }}
          />

          <div className="relative w-full max-w-[1428px] mx-auto mb-6 px-4 sm:px-8 pt-4 sm:pt-8">
            <div className="relative w-full flex flex-col lg:flex-row bg-[#08183A] rounded-[1.5rem] overflow-hidden min-h-[500px] lg:min-h-[608px] shadow-xl">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.15 },
                  },
                }}
                className="w-full lg:w-[45%] shrink-0 relative z-20 p-8 lg:p-14 flex flex-col justify-center"
              >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
            className="flex items-center gap-5 mb-14 lg:mb-20"
          >
            <div className="w-14 h-14 bg-transparent border border-[#D9B673] flex items-center justify-center text-[#D9B673] rounded-sm">
              <span className="font-serif text-3xl font-medium tracking-tighter">
                CB
              </span>
            </div>
            <div className="h-12 w-[1px] bg-[#D9B673] opacity-50"></div>
            <div className="text-left font-serif tracking-widest text-white uppercase flex flex-col justify-center relative">
              <button 
                onClick={(e) => {
                  if (config?.settings?.enableHotelSelector !== true) return;
                  e.stopPropagation();
                  setShowHotelDropdown(!showHotelDropdown);
                }}
                className={`flex items-center gap-1.5 text-sm tracking-[0.2em] text-left transition-colors outline-none font-semibold ${config?.settings?.enableHotelSelector === true ? 'hover:text-[#D9B673] cursor-pointer' : 'cursor-default'}`}
              >
                <span>{currentHotel?.name || "Constantinou Bros"}</span>
                {config?.settings?.enableHotelSelector === true && (
                  <LucideIcons.ChevronDown size={14} className={`text-[#D9B673] transition-transform shrink-0 ${showHotelDropdown ? 'rotate-180' : ''}`} />
                )}
              </button>
              <div className="text-sm tracking-[0.2em] mb-1">Hotels</div>
              <div className="text-[9px] tracking-[0.3em] text-white/50">
                Pafos Cyprus
              </div>
              {showHotelDropdown && config?.settings?.enableHotelSelector === true && (
                <div className="absolute top-full left-0 mt-3 bg-[#0B132B]/95 backdrop-blur-md border border-[#B5925A]/30 rounded-lg py-1.5 w-72 shadow-2xl z-50 overflow-hidden">
                  {config?.hotels?.filter((h: any) => h.active).map((h: any) => (
                    <button
                      key={h.id}
                      onClick={() => {
                        setSelectedHotelId(h.id);
                        localStorage.setItem("kiosk_hotel_id", h.id);
                        setShowHotelDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[10px] font-sans font-bold tracking-wider uppercase transition-colors hover:bg-[#B5925A]/15 hover:text-[#D9B673] border-b border-[#B5925A]/5 last:border-0 ${
                        h.id === currentHotel?.id ? "text-[#D9B673] bg-[#B5925A]/10" : "text-white/80"
                      }`}
                    >
                      {h.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          {currentHotel?.content?.heroTexts?.titleTopEnabled !== false && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
              }}
              className={`mb-2 italic tracking-wide ${currentHotel?.content?.heroTexts?.titleTopSize ?? "text-2xl sm:text-3xl"} ${currentHotel?.content?.heroTexts?.titleTopFontFamily ?? "font-serif"}`}
              style={currentHotel?.content?.heroTexts?.titleTopColor ? { color: currentHotel.content.heroTexts.titleTopColor } : { color: "#D9B673" }}
            >
              {currentHotel?.content?.heroTexts?.titleTop ?? "Awarded"}
            </motion.div>
          )}
          {currentHotel?.content?.heroTexts?.titleMiddleEnabled !== false && (
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
              }}
              className={`tracking-widest leading-tight mb-2 ${currentHotel?.content?.heroTexts?.titleMiddleSize ?? "text-3xl sm:text-4xl lg:text-[54px]"} ${currentHotel?.content?.heroTexts?.titleMiddleFontFamily ?? "font-serif"}`}
              style={currentHotel?.content?.heroTexts?.titleMiddleColor ? { color: currentHotel.content.heroTexts.titleMiddleColor } : { color: "white" }}
            >
              {currentHotel?.content?.heroTexts?.titleMiddle ?? "WORLD CLASS"}
            </motion.h1>
          )}
          {currentHotel?.content?.heroTexts?.titleBottomEnabled !== false && (
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
              }}
              className={`tracking-[0.15em] sm:tracking-[0.2em] mb-4 ${currentHotel?.content?.heroTexts?.titleBottomSize ?? "text-2xl sm:text-3xl lg:text-[40px]"} ${currentHotel?.content?.heroTexts?.titleBottomFontFamily ?? "font-serif"}`}
              style={currentHotel?.content?.heroTexts?.titleBottomColor ? { color: currentHotel.content.heroTexts.titleBottomColor } : { color: "#D9B673" }}
            >
              {currentHotel?.content?.heroTexts?.titleBottom ?? "HOSPITALITY"}
            </motion.h2>
          )}
          {currentHotel?.content?.heroTexts?.subtitleEnabled !== false && (
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
              }}
              className={`tracking-widest uppercase mb-12 w-full lg:w-[120%] z-10 relative ${currentHotel?.content?.heroTexts?.subtitleSize ?? "text-xs"} ${currentHotel?.content?.heroTexts?.subtitleFontFamily ?? "font-sans"}`}
              style={currentHotel?.content?.heroTexts?.subtitleColor ? { color: currentHotel.content.heroTexts.subtitleColor } : { color: "rgba(255,255,255,0.6)" }}
            >
              {currentHotel?.content?.heroTexts?.subtitle ?? "Travel Weekly Globe Travel Awards 2025"}
            </motion.p>
          )}
          {currentHotel?.content?.heroTexts?.awardDivEnabled !== false && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: "easeOut" },
                },
              }}
              className="flex flex-col relative z-10"
            >
              <div 
                className={`flex items-center gap-2 mb-1.5 ${currentHotel?.content?.heroTexts?.awardDivSize ?? "text-xl"} ${currentHotel?.content?.heroTexts?.awardDivFontFamily ?? "font-serif"}`}
                style={currentHotel?.content?.heroTexts?.awardDivColor ? { color: currentHotel.content.heroTexts.awardDivColor } : { color: "#D9B673" }}
              >
                <LucideIcons.Award className="w-6 h-6 mr-1" />
                <span className="tracking-wider">WINNER</span>
              </div>
              <div className="font-sans text-sm tracking-wide pl-2 border-l border-[#D9B673]/30">
                <p 
                  style={currentHotel?.content?.heroTexts?.awardCategoryColor ? { color: currentHotel.content.heroTexts.awardCategoryColor } : { color: "white" }}
                  className={`font-medium ${currentHotel?.content?.heroTexts?.awardCategorySize ?? ""} ${currentHotel?.content?.heroTexts?.awardCategoryFontFamily ?? ""}`}
                >
                  {currentHotel?.content?.heroTexts?.awardCategory ?? "Best Hotel Chain"}
                </p>
                <p 
                  style={currentHotel?.content?.heroTexts?.awardWinnerColor ? { color: currentHotel.content.heroTexts.awardWinnerColor } : { color: "rgba(255,255,255,0.7)" }}
                  className={`${currentHotel?.content?.heroTexts?.awardWinnerSize ?? ""} ${currentHotel?.content?.heroTexts?.awardWinnerFontFamily ?? ""}`}
                >
                  {currentHotel?.content?.heroTexts?.awardWinner ?? "Constantinou Bros"}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Hero Image / Curve Mask - Banner */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[70%] isolate py-0">
          <div
            className="absolute inset-0 border-l-[3px] border-[#D9B673] overflow-hidden"
            style={{
              borderTopLeftRadius: "120px 50%",
              borderBottomLeftRadius: "120px 50%",
            }}
          >
            <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none"></div>
            <AnimatePresence>
              <motion.div
                key={currentBanner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <LazyImage
                  src={banners[currentBanner]}
                  alt={`Hotel Banner ${currentBanner}`}
                  className={`w-full h-full object-center ${
                    currentHotel?.content?.bannerObjectFit === "contain"
                      ? "object-contain"
                      : currentHotel?.content?.bannerObjectFit === "fill"
                      ? "object-fill"
                      : "object-cover"
                  }`}
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-[#08183A] via-[#08183A]/30 to-transparent z-10 pointer-events-none"></div>
          </div>
        </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="max-w-[1428px] mx-auto px-4 sm:px-8 relative z-30 mt-6 mb-12">
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 p-4 md:p-6 flex items-center justify-between group animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-[#0A1024] opacity-50 bg-black/10 w-8 h-8 rounded shrink-0"></div>
                    <div>
                      <div className="h-4 w-24 bg-black/10 rounded mb-1.5"></div>
                      <div className="h-2.5 w-16 bg-black/5 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            : (currentHotel?.content?.actions || [])
                .filter((act: any) => act.showOnInfokiosk !== false)
                .filter((act: any) => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return (act.title || "").toLowerCase().includes(q) || (act.subtitle || "").toLowerCase().includes(q);
                })
                .map((act: any) => (
                <motion.div
                  key={act.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                  }}
                >
                  <ActionItem
                    icon={<DynamicIcon name={act.icon} title={act.title} />}
                    title={act.title}
                    subtitle={act.subtitle}
                  pulseGlow={act.title.toLowerCase().includes("check-in")}
                  onClick={() => {
                    if (act.moduleId) {
                      const mod = currentHotel?.content?.modules?.find((m: any) => m.id === act.moduleId);
                      if (mod) {
                        window.history.pushState({ view: 'module' }, "");
                        setActiveModule(mod);
                      }
                    } else if (act.url) {
                      window.open(act.url, "_blank");
                    } else if (act.title.toLowerCase().includes("check-in")) {
                      setShowCheckInModal(true);
                    }
                  }}
                />
                </motion.div>
              ))}
        </motion.div>
      </div>

      {/* Grid Modules */}
      <div id="services-grid" className="max-w-[1428px] mx-auto px-4 sm:px-8 mb-24 relative">
        <div className="mb-10">
          <div className="relative w-full max-w-2xl lg:max-w-3xl mx-auto">
            <div className="relative flex items-center bg-white rounded-full border-2 border-[#E5A830] shadow-[0_4px_25px_rgba(229,168,48,0.18)] hover:shadow-[0_6px_30px_rgba(229,168,48,0.26)] transition-all duration-300">
              <div className="pl-6 sm:pl-7 pr-3 flex items-center pointer-events-none text-[#07172e] shrink-0">
                <Search className="h-6 w-6 sm:h-7 sm:w-7 stroke-[2.4]" />
              </div>
              <input
                type="text"
                placeholder="Search services, activities, or amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent py-3.5 sm:py-4 text-[#07172e] text-base sm:text-lg font-medium focus:outline-none placeholder:text-slate-500/80"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-2 mr-1 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Clear search"
                >
                  <LucideIcons.X className="w-5 h-5 stroke-[2.2]" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("services-grid");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="mr-2 sm:mr-2.5 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#07172e] hover:bg-[#0c2448] active:scale-95 text-white flex items-center justify-center shrink-0 transition-all duration-200 shadow-md cursor-pointer"
                title="Search"
              >
                <ArrowRight className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.4]" />
              </button>
            </div>
          </div>
        </div>

        <motion.div 
          layout
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
          {(() => {
            if (loading) {
              return Array.from({ length: 16 }).map((_, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={`skeleton-${i}`}
                  className="rounded-2xl border-[1.5px] border-[#E5A830]/40 bg-gradient-to-r from-[#06152a] via-[#081a33] to-[#06152a] min-h-[96px] animate-pulse flex items-center px-5 py-4 sm:px-6 sm:py-5 shadow-md gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[#E5A830]/20 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="w-28 h-4 rounded bg-white/20 mb-2" />
                    <div className="w-36 h-3 rounded bg-white/10" />
                  </div>
                  <div className="w-8 h-8 rounded-full border-[1.5px] border-[#E5A830]/30 shrink-0" />
                </motion.div>
              ));
            }

            let allModules = [...(currentHotel?.content?.modules || [])];

            // Ensure 16 standard modules are present matching the exact uploaded design
            if (!allModules.some((m: any) => m.id === "m15" || m.title?.toLowerCase().includes("wedding"))) {
              allModules.push({
                id: "m15",
                icon: "Heart",
                title: "Weddings",
                subtitle: "System Module",
                image: "",
                submodules: []
              });
            }
            if (!allModules.some((m: any) => m.id === "m16" || m.title?.toLowerCase().includes("attraction"))) {
              allModules.push({
                id: "m16",
                icon: "MapPin",
                title: "Local Attractions",
                subtitle: "Discover nearby places",
                image: "",
                submodules: []
              });
            }

            // Append any dynamically active plugins (e.g., Currency Calculator, Guest Survey, or Admin-created Custom Plugins)
            const activeKioskPlugins = moduleRegistry.getActive(currentHotel?.id, "kiosk");
            activeKioskPlugins.forEach((plugin) => {
              const pid = plugin.manifest.id;
              if (pid === "currency-calc" || pid === "guest-survey" || plugin.manifest.isCustom) {
                if (!allModules.some((m: any) => m.id === pid)) {
                  allModules.push({
                    id: pid,
                    icon: plugin.manifest.icon,
                    title: plugin.manifest.name,
                    subtitle: plugin.manifest.subtitle || plugin.manifest.description,
                    image: plugin.manifest.bannerImage || "",
                    isCustom: plugin.manifest.isCustom,
                    submodules: []
                  });
                }
              }
            });

            return allModules
                .filter((mod: any) => mod.showOnInfokiosk !== false)
                .filter((mod: any) => moduleRegistry.isEnabled(mod.id, currentHotel?.id))
                .filter((mod: any) => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return (mod.title || "").toLowerCase().includes(q) || (mod.subtitle || "").toLowerCase().includes(q);
                })
                .map((mod: any, i: number) => {
                  // Normalize subtitles to match the exact uploaded luxury service menu design
                  let displaySubtitle = mod.subtitle;
                  const titleUpper = (mod.title || "").toUpperCase();

                  if (titleUpper.includes("DIRECTORY OF SERVICES") && (!displaySubtitle || displaySubtitle.includes("fingertips"))) {
                    displaySubtitle = "Our services are at your convenience...";
                  } else if (titleUpper === "WEATHER") {
                    displaySubtitle = weather ? `Plan Your Perfect Day · ${Math.round(weather.temp)}°C` : "Plan Your Perfect Day";
                  }

                  let modIcon = mod.icon;
                  if (titleUpper.includes("RESERVATION") && (!modIcon || modIcon === "HelpCircle")) {
                    modIcon = "ConciergeBell";
                  }

                  return (
                    <motion.div
                      layout
                      className="h-full"
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      key={mod.id || `mod-${i}`}
                      variants={{
                        hidden: { opacity: 0, y: 25, scale: 0.96 },
                        show: { 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 320,
                            damping: 26
                          }
                        }
                      }}
                    >
                      <ModuleCard
                        className="h-full"
                        icon={<DynamicIcon name={modIcon} title={mod.title} />}
                        title={mod.title}
                        subtitle={displaySubtitle}
                        image={mod.image}
                        pulseGlow={mod.title.toLowerCase().includes("check-in")}
                        onClick={() => {
                          if (mod.title.toLowerCase().includes("check-in")) {
                            setShowCheckInModal(true);
                          } else {
                            setActiveModule(mod);
                          }
                        }}
                      />
                    </motion.div>
                  );
                });
          })()}
          </AnimatePresence>
        </motion.div>
      </div>
        </div>
      )}

      {/* Submodules Overlay */}
      <AnimatePresence mode="wait">
        {activeModule && (() => {
          let pluginId = activeModule.id;
          if (!moduleRegistry.get(pluginId)) {
            const t = (activeModule.title || "").toLowerCase();
            if (t.includes("loyalty")) pluginId = "m9";
            else if (t.includes("spa") || t.includes("elixir")) pluginId = "m8";
            else if (t.includes("wedding")) pluginId = "m15";
            else if (t.includes("directory")) pluginId = "m1";
            else if (t.includes("weather")) pluginId = "m13";
            else if (t.includes("general info")) pluginId = "m14";
            else if (t.includes("award")) pluginId = "m11";
            else if (t.includes("golf")) pluginId = "m10";
            else if (t.includes("map")) pluginId = "m12";
            else if (t.includes("suite") || t.includes("room")) pluginId = "m2";
            else if (t.includes("daily") || t.includes("program")) pluginId = "m6";
            else if (t.includes("restaurant") || t.includes("dining")) pluginId = "m3";
            else if (t.includes("attraction")) pluginId = "m16";
            else if (t.includes("airport") || t.includes("flight")) pluginId = "airport";
            else if (t.includes("bus")) pluginId = "bus_routes";
          }

          if (moduleRegistry.get(pluginId)) {
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                key={pluginId}
                className="fixed inset-0 z-50 overflow-y-auto w-full h-full bg-[#FAFAFA]"
              >
                <ModuleRenderer
                  moduleId={pluginId}
                  context={moduleContext}
                  moduleData={activeModule}
                  onClose={goBack}
                />
              </motion.div>
            );
          }

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              key="default-module"
              className="fixed inset-0 bg-[#060A18] z-50 overflow-y-auto w-full h-full"
            >
              <div className="sticky top-0 left-0 w-full z-40 bg-gradient-to-b from-black/80 to-transparent p-6 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col gap-2 pointer-events-auto">
                  <div className="text-white/60 text-xs font-sans mt-2 ml-4 flex items-center gap-2 relative z-50">
                    <span
                      className="cursor-pointer hover:text-white transition-colors"
                      onClick={goHome}
                    >
                      Home
                    </span>{" "}
                    <ArrowRight size={10} className="text-[#B5925A]" />{" "}
                    <span className="text-white">{activeModule.title}</span>
                  </div>
                </div>

                <button
                  onClick={goHome}
                  className="w-12 h-12 bg-black/40 border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 backdrop-blur-md transition-all pointer-events-auto relative z-50 shadow-xl cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="relative h-64 md:h-96 w-full mb-8 -mt-24">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060A18] via-transparent to-transparent z-10" />
                <LazyImage
                  src={
                    activeModule.image ||
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop"
                  }
                  alt={activeModule.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />

                <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2 text-[#B5925A]">
                      <DynamicIcon name={activeModule.icon} size={24} />
                      <span className="font-sans uppercase tracking-widest text-xs">
                        {activeModule.subtitle}
                      </span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif text-white break-words hyphens-auto">
                      {activeModule.title}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
                {activeModule.content && (
                  <div
                    className="prose prose-sm md:prose-base lg:prose-lg prose-invert max-w-none text-white/80 font-sans mb-12 leading-relaxed break-words overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: activeModule.content }}
                  />
                )}
                {activeModule.button?.label && (
                  <div className="mb-12 flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeModule.button.url)
                          window.open(activeModule.button.url, "_blank");
                      }}
                      className="px-8 py-3 bg-[#B5925A] text-white font-serif text-lg tracking-wide rounded hover:bg-[#c2a26d] transition-colors shadow-lg"
                    >
                      {activeModule.button.label}
                    </button>
                  </div>
                )}

                {(() => {
                  if (overlayLoading) {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-[#D9B673]/20 bg-white/5 aspect-video animate-pulse flex flex-col justify-end p-6"
                          >
                            <div className="w-1/2 h-6 bg-white/10 rounded mb-2"></div>
                            <div className="w-1/3 h-4 bg-white/5 rounded"></div>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  const template = activeModule.templateId
                    ? config.templates?.find(
                        (t: any) => t.id === activeModule.templateId,
                      )
                    : null;
                  const layout = template?.displayType || "grid";



                  if (activeModule.title?.toLowerCase().includes("attraction")) {
                    return <LocalAttractionsLayout currentHotel={currentHotel} onBack={goBack} />;
                  }

                  if (layout === "list") {
                    return (
                      <div className="flex flex-col gap-4">
                        {(activeModule.submodules || []).map((sub: any) => (
                          <div
                            key={sub.id}
                            onClick={() => openSubmodule(sub, { layout })}
                            className="group relative overflow-hidden rounded-xl border border-white/10 flex flex-col md:flex-row bg-white/5 hover:bg-white/10 transition-all cursor-pointer"
                          >
                            {sub.image && (
                              <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden">
                                <LazyImage
                                  src={sub.image}
                                  alt={sub.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                                />
                              </div>
                            )}
                            <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                              <h3 className="text-2xl font-serif text-white mb-2 group-hover:text-[#B5925A] transition-colors">
                                {sub.title}
                              </h3>
                              <p className="font-sans text-sm text-white/60 mb-4">
                                {sub.subtitle}
                              </p>
                              <div className="uppercase tracking-widest text-xs text-[#B5925A] flex items-center gap-1 font-semibold group-hover:gap-2 transition-all">
                                Explore <ArrowRight size={14} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  if (layout === "hero") {
                    return (
                      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 hide-scrollbar">
                        {(activeModule.submodules || []).map((sub: any) => (
                          <div
                            key={sub.id}
                            onClick={() => openSubmodule(sub, { layout })}
                            className="group shrink-0 w-80 md:w-96 relative overflow-hidden rounded-2xl border border-white/10 aspect-[3/4] flex flex-col justify-end p-8 hover:border-[#B5925A]/60 transition-all cursor-pointer snap-start"
                          >
                            <div className="absolute inset-0 bg-neutral-900 z-0">
                              {sub.image && (
                                <LazyImage
                                  src={sub.image}
                                  alt={sub.title}
                                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-1000"
                                />
                              )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                            <div className="relative z-20 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                              <h3 className="text-3xl font-serif text-white mb-2">
                                {sub.title}
                              </h3>
                              <p className="font-sans text-sm text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                {sub.subtitle}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  }

                  // Default Grid
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {(activeModule.submodules || []).map((sub: any) => (
                        <div
                          key={sub.id}
                          onClick={() => openSubmodule(sub, { layout })}
                          className="group relative overflow-hidden rounded-xl border border-white/10 aspect-video flex flex-col justify-end p-6 hover:border-[#B5925A]/50 transition-all cursor-pointer"
                        >
                          <div className="absolute inset-0 bg-neutral-900 z-0">
                            {sub.image && (
                              <LazyImage
                                src={sub.image}
                                alt={sub.title}
                                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                              />
                            )}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                          <div className="relative z-20">
                            <h3 className="text-xl font-serif text-white mb-1">
                              {sub.title}
                            </h3>
                            <p className="font-sans text-xs text-white/50">
                              {sub.subtitle}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Detailed Submodule Overlay */}
      <React.Suspense fallback={<div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#060A18]"><div className="w-12 h-12 border-4 border-[#B5925A] border-t-transparent rounded-full animate-spin"></div></div>}>
      <AnimatePresence mode="wait">
        {activeSubmodule && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            key="submodule-overlay"
            className={`fixed inset-0 z-[60] overflow-y-auto w-full h-full ${activeSubmodule.layout === "suite" || activeSubmodule.layout === "restaurant" ? "bg-[#faf9f6] text-gray-900 font-sans" : "bg-[#060A18] text-white"}`}
          >
            <div
              className={`sticky top-0 left-0 w-full z-40 flex justify-between items-start pointer-events-none ${activeSubmodule.layout === "restaurant" ? "bg-[#1A2E4D] py-4 px-6 text-white" : activeSubmodule.layout === "suite" ? "bg-gradient-to-b from-[#faf9f6]/95 via-[#faf9f6]/70 to-transparent backdrop-blur-[2px] p-6" : "bg-gradient-to-b from-black/80 to-transparent p-6"}`}
            >
              <div className="flex flex-col gap-2 pointer-events-auto">
                <div
                  className={`text-xs font-sans mt-2 ml-4 flex items-center gap-2 relative z-50 ${activeSubmodule.layout === "suite" ? "text-gray-500" : activeSubmodule.layout === "restaurant" ? "hidden" : "text-white/60"}`}
                >
                  <span
                    className={`cursor-pointer transition-colors ${activeSubmodule.layout === "suite" || activeSubmodule.layout === "restaurant" ? "hover:text-gray-900" : "hover:text-white"}`}
                    onClick={goHome}
                  >
                    Home
                  </span>
                  {activeSubmodule.parentModuleTitle &&
                    activeSubmodule.parentModuleTitle !== "Home" && (
                      <>
                        <ArrowRight size={10} className="text-[#B5925A]" />
                        <span
                          className={`cursor-pointer transition-colors ${activeSubmodule.layout === "suite" || activeSubmodule.layout === "restaurant" ? "hover:text-gray-900" : "hover:text-white"}`}
                          onClick={goBack}
                        >
                          {activeSubmodule.parentModuleTitle}
                        </span>
                      </>
                    )}
                  <ArrowRight size={10} className="text-[#B5925A]" />
                  <span
                    className={
                      activeSubmodule.layout === "suite" || activeSubmodule.layout === "restaurant"
                        ? "text-gray-900 font-medium"
                        : "text-white"
                    }
                  >
                    {activeSubmodule.title}
                  </span>
                </div>
              </div>

              <button
                onClick={goBack}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all pointer-events-auto relative z-50 cursor-pointer ${activeSubmodule.layout === "restaurant" ? "text-white hover:bg-white/10" : activeSubmodule.layout === "suite" ? "bg-white/80 border border-gray-200 text-gray-700 hover:text-black hover:bg-gray-100 shadow-xl backdrop-blur-md" : "bg-black/40 border border-white/20 text-white/70 hover:text-white hover:bg-black/60 shadow-xl backdrop-blur-md"}`}
              >
                <X size={24} />
              </button>
            </div>

            {activeSubmodule.layout === "loyalty" || activeSubmodule.title?.toLowerCase().includes("loyalty") ? (
              <LoyaltyLayout module={activeSubmodule} onClose={goBack} />
            ) : activeSubmodule.layout === "spa" || activeSubmodule.title?.toLowerCase().includes("spa") ? (
              <SpaLayout module={activeSubmodule} onClose={goBack} />
            ) : activeSubmodule.layout === "directory" || activeSubmodule.title?.toLowerCase().includes("directory") ? (
              <DirectoryOfServicesLayout module={activeSubmodule} onClose={goBack} />
            ) : activeSubmodule.title?.toLowerCase().includes("weather") ? (
              <WeatherLayout module={activeSubmodule} onClose={goBack} />
            ) : activeSubmodule.layout === "weddings" || activeSubmodule.title?.toLowerCase().includes("wedding") ? (
              <WeddingsLayout module={activeSubmodule} onClose={goBack} />
            ) : activeSubmodule.layout === "busRoutes" || activeSubmodule.title === "BUS ROUTES" ? (
              <BusRoutesLayout module={activeModule || activeSubmodule} onClose={goBack} />
            ) : activeSubmodule.layout === "airportInfo" || activeSubmodule.title === "AIRPORT INFORMATION" || activeSubmodule.title?.toLowerCase().includes("airport") ? (
              <AirportInfoLayout module={activeModule || activeSubmodule} onClose={goBack} />
            ) : activeSubmodule.layout === "general_info" || activeSubmodule.title?.toLowerCase().includes("general info") ? (
              <GeneralInfoLayout module={activeSubmodule} onClose={goBack} onOpenSubmodule={openSubmodule} />
            ) : activeSubmodule.layout === "golfDetails" ? (
              <GolfDetailsLayout module={activeSubmodule} onClose={goBack} />
            ) : activeSubmodule.layout === "restaurant" ? (
              <RestaurantSubmodule submodule={activeSubmodule} onClose={goBack} />
            ) : activeSubmodule.layout === "map" || activeSubmodule.title?.toLowerCase().includes("map") ? (
              <InteractiveMapLayout module={activeSubmodule} onBack={goBack} onOpenSubmodule={(sub: any) => {}} />
            ) : activeSubmodule.layout === "suite" ? (
              <div className="w-full pb-32">
                {/* Full Width Header */}
                <div className="relative w-full h-[40vh] md:h-[50vh] min-h-[350px] flex items-center bg-[#faf9f6] overflow-hidden mb-12">
                  <div className="max-w-6xl mx-auto w-full px-6 relative z-20 pt-16">
                    <span className="inline-flex px-4 py-1.5 bg-[#F6F1EA] text-[#B08955] uppercase tracking-[0.1em] text-[11px] font-bold rounded-full w-max mb-6 shadow-sm border border-[#B08955]/20">
                      {(activeSubmodule.parentModuleTitle || "").toLowerCase().includes("restaurant") ? "Dining" : (activeSubmodule.parentModuleTitle || "").toLowerCase().includes("suite") || (activeSubmodule.parentModuleTitle || "").toLowerCase().includes("room") ? "Room Type" : "Details"}
                    </span>
                    <h2 className="text-[52px] md:text-[64px] font-serif text-[#0F203C] mb-4 leading-tight">
                      {activeSubmodule.title}
                    </h2>
                    {activeSubmodule.subtitle && (
                      <p className="text-[#C58940] font-bold text-xl md:text-[22px] max-w-2xl">
                        {activeSubmodule.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Background Image */}
                  {(activeGalleryImage ||
                    activeSubmodule.image ||
                    (activeSubmodule.gallery &&
                      activeSubmodule.gallery[0])) && (
                    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-10">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f6] via-[#faf9f6]/80 to-transparent z-10 w-full md:w-3/4"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f6] to-transparent z-10 h-32 top-auto bottom-0"></div>
                      <LazyImage
                        src={
                          activeGalleryImage ||
                          activeSubmodule.image ||
                          activeSubmodule.gallery[0]
                        }
                        alt={activeSubmodule.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  )}
                </div>

                <div className="max-w-6xl mx-auto px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="lg:col-span-7 flex flex-col"
                    >
                      <div className="w-16 h-1 bg-[#C58940] mb-8"></div>

                      {activeSubmodule.content && (
                        <div
                          className="text-[#3A4E6B] leading-relaxed text-[17px] space-y-4 font-medium prose prose-sm md:prose-base prose-p:text-[#3A4E6B] max-w-none w-full break-words"
                          dangerouslySetInnerHTML={{
                            __html: activeSubmodule.content,
                          }}
                        />
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: 0.2,
                      }}
                      className="lg:col-span-5"
                    >
                      {activeSubmodule.features &&
                        activeSubmodule.features.length > 0 && (
                          <div className="bg-white rounded-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-neutral-100/50 flex flex-col justify-center h-full p-2 md:p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 text-center">
                              {activeSubmodule.features.map(
                                (f: any, i: number) => (
                                  <div
                                    key={i}
                                    className={`flex flex-col items-center justify-center gap-3 p-6 
                                           border-neutral-100
                                           ${i % 2 === 0 ? "border-r sm:border-r-0" : ""} 
                                           ${i % 3 !== 2 ? "sm:border-r" : ""} 
                                           ${i < activeSubmodule.features.length - 2 ? "border-b sm:border-b-0" : ""}
                                           ${i < activeSubmodule.features.length - 3 ? "sm:border-b" : ""}
                                        `}
                                  >
                                    <DynamicIcon
                                      name={f.icon}
                                      className="text-[#C58940]"
                                      size={32}
                                      strokeWidth={1.5}
                                    />
                                    <span className="text-[13px] font-bold text-[#0F203C] leading-snug">
                                      {f.label}
                                    </span>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                  >
                    {(activeGalleryImage ||
                      activeSubmodule.image ||
                      (activeSubmodule.gallery &&
                        activeSubmodule.gallery.length > 0)) && (
                      <div
                        className="w-full aspect-[4/3] md:aspect-[21/9] rounded-[24px] md:rounded-[32px] overflow-hidden mb-6 md:mb-8 shadow-sm bg-neutral-100 cursor-zoom-in group relative"
                        onClick={() =>
                          setLightboxImage(
                            activeGalleryImage ||
                              activeSubmodule.image ||
                              activeSubmodule.gallery[0],
                          )
                        }
                      >
                        <LazyImage
                          src={
                            activeGalleryImage ||
                            activeSubmodule.image ||
                            activeSubmodule.gallery[0]
                          }
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100 duration-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-gray-800"
                            >
                              <circle cx="11" cy="11" r="8" />
                              <path d="m21 21-4.3-4.3" />
                              <path d="M8 11h6" />
                              <path d="M11 8v6" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}

                    {((activeSubmodule.gallery &&
                      activeSubmodule.gallery.length > 0) ||
                      activeSubmodule.image) && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-6 relative">
                        {activeSubmodule.image && (
                          <div
                            onClick={() =>
                              setActiveGalleryImage(activeSubmodule.image)
                            }
                            className={`w-full aspect-square rounded-[16px] md:rounded-[20px] overflow-hidden shadow-sm border-[3px] cursor-pointer transition-all duration-300 ${!activeGalleryImage || activeGalleryImage === activeSubmodule.image ? "border-[#B08955] opacity-100 scale-100" : "border-transparent opacity-70 hover:opacity-100 bg-neutral-100"}`}
                          >
                            <LazyImage
                              src={activeSubmodule.image}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {activeSubmodule.gallery?.map(
                          (img: string, i: number) => (
                            <div
                              key={i}
                              onClick={() => setActiveGalleryImage(img)}
                              className={`w-full aspect-square rounded-[16px] md:rounded-[20px] overflow-hidden shadow-sm border-[3px] cursor-pointer transition-all duration-300 ${activeGalleryImage === img || (!activeGalleryImage && !activeSubmodule.image && i === 0) ? "border-[#B08955] opacity-100 scale-100" : "border-transparent opacity-70 hover:opacity-100 bg-neutral-100"}`}
                            >
                              <LazyImage
                                src={img}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ),
                        )}
                      </div>
                    )}

                    {activeSubmodule.button?.label && (
                      <div className="flex justify-center mt-12 md:mt-16 w-full max-w-xl mx-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeSubmodule.button.url)
                              window.open(activeSubmodule.button.url, "_blank");
                          }}
                          className="w-full bg-[#B08955] hover:bg-[#997648] text-white py-4 md:py-[18px] px-8 rounded-[12px] flex items-center justify-center gap-3 font-medium text-[17px] transition-colors shadow-[0_8px_24px_rgba(176,137,85,0.3)]"
                        >
                          <Calendar size={20} strokeWidth={1.5} />
                          {activeSubmodule.button.label}
                        </button>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            ) : (
              <>
                <div className="relative h-64 md:h-[40vh] w-full mb-12 -mt-24">
                  <div className="absolute inset-0 bg-black/40 z-10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060A18] via-transparent to-transparent z-10" />
                  <LazyImage
                    src={
                      activeSubmodule.image ||
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop"
                    }
                    alt={activeSubmodule.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />

                  <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full">
                    <div className="max-w-4xl mx-auto w-full">
                      {activeSubmodule.subtitle && (
                        <span className="font-sans uppercase tracking-widest text-[#B5925A] text-xs block mb-3">
                          {activeSubmodule.subtitle}
                        </span>
                      )}
                      <h2 className="text-3xl md:text-6xl font-serif text-white mb-6 break-words hyphens-auto">
                        {activeSubmodule.title}
                      </h2>
                      {activeSubmodule.button?.label && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (activeSubmodule.button.url)
                              window.open(activeSubmodule.button.url, "_blank");
                          }}
                          className="px-8 py-3 bg-[#B5925A] text-white font-serif text-lg tracking-wide rounded hover:bg-[#c2a26d] transition-colors shadow-lg"
                        >
                          {activeSubmodule.button.label}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-24">

                  {activeSubmodule.content && (
                    <div
                      className="prose prose-sm md:prose-base lg:prose-lg prose-invert max-w-none text-white/80 font-sans mb-16 leading-relaxed break-words overflow-hidden"
                      dangerouslySetInnerHTML={{
                        __html: activeSubmodule.content,
                      }}
                    />
                  )}

                  {activeSubmodule.gallery &&
                    activeSubmodule.gallery.length > 0 && (
                      <div>
                        <h3 className="text-2xl font-serif text-[#B5925A] mb-8 border-b border-white/10 pb-4">
                          Gallery
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {activeSubmodule.gallery.map(
                            (img: string, i: number) => (
                              <div
                                key={i}
                                className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5"
                              >
                                {img && (
                                  <LazyImage
                                    src={img}
                                    alt={`Gallery ${i}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  />
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll To Explore */}
      <div className="flex flex-col items-center justify-center text-[#0A1024]/60 text-xs lowercase font-sans mb-10 tracking-widest gap-2">
        <div className="w-[1px] h-10 bg-gradient-to-b from-[#0A1024]/30 to-transparent"></div>
        SCROLL TO EXPLORE
        <ChevronDown size={14} className="mt-1" />
      </div>

      {/* Bottom Bar */}
      <div 
        onClick={() => setSecretClicks(c => c + 1)}
        className="fixed bottom-0 left-0 right-0 h-16 bg-[#0B132B]/95 backdrop-blur-md border-t border-[#B5925A]/20 z-40 flex items-center justify-between px-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-[#B5925A] rounded flex items-center justify-center">
            <div className="w-4 h-4 border border-[#B5925A] rounded-sm transform rotate-45"></div>
          </div>
          <div className="font-serif text-sm tracking-widest text-[#B5925A] uppercase">
            CBH
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-sm font-sans tracking-wider">
            <button className="text-[#B5925A] font-medium outline-none">
              EN
            </button>
            <span className="text-white/20">|</span>
            <button className="text-white/50 hover:text-[#B5925A] transition-colors outline-none cursor-pointer">
              DE
            </button>
          </div>

          {secretClicks >= 4 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAdminLogin(true);
                setSecretClicks(0);
              }}
              className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded cursor-pointer"
            >
              Admin
            </button>
          )}
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B132B] border border-[#B5925A]/30 p-8 rounded-xl max-w-sm w-full relative">
            <button
              onClick={() => {
                setShowAdminLogin(false);
                setAdminPassword("");
                setPwdError("");
              }}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center mb-6">
              <div className="w-12 h-12 border border-[#B5925A] rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 border border-[#B5925A] transform rotate-45"></div>
              </div>
              <h2 className="text-xl font-serif text-[#B5925A]">
                Admin Access
              </h2>
              <p className="text-xs text-white/50 mt-1 uppercase tracking-widest">
                Enter authentication pin
              </p>
            </div>

            <form onSubmit={(e) => handleAdminLogin(e, 'admin')}>
              <input
                type="password"
                autoFocus
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setPwdError("");
                }}
                className={cn(
                  "w-full bg-[#060A18] border rounded py-3 px-4 text-center tracking-[0.5em] font-mono text-white mb-4 outline-none focus:border-[#B5925A] transition-colors",
                  pwdError ? "border-red-500/50" : "border-[#B5925A]/30",
                )}
                placeholder="•••••••••"
              />
              {pwdError && (
                <p className="text-red-400 text-xs text-center mb-4">
                  Incorrect password
                </p>
              )}
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full bg-[#B5925A] text-[#060A18] font-medium py-3 rounded tracking-wider uppercase text-sm hover:bg-[#EAD0A3] transition-colors"
                >
                  Admin Panel
                </button>
                <button
                  type="button"
                  onClick={(e) => handleAdminLogin(e, 'sysinfo')}
                  className="w-full border border-[#B5925A]/30 text-[#D9B673] font-medium py-3 rounded tracking-wider uppercase text-sm hover:bg-[#B5925A]/10 transition-colors"
                >
                  System Info
                </button>
                <a
                  href="/?mobile=true"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full border border-[#B5925A]/30 text-[#D9B673] font-medium py-3 rounded tracking-wider uppercase text-sm hover:bg-[#B5925A]/10 transition-colors flex items-center justify-center gap-2"
                >
                  <LucideIcons.Smartphone size={16} />
                  <span>Preview Mobile App</span>
                </a>
                <button
                  type="button"
                  onClick={(e) => handleAdminLogin(e, 'unlock')}
                  className="w-full border border-[#B5925A]/30 text-[#D9B673] font-medium py-3 rounded tracking-wider uppercase text-sm hover:bg-[#B5925A]/10 transition-colors"
                >
                  Exit Kiosk Mode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check-In Modal */}
      <AnimatePresence>
        {showCheckInModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#0B132B] border border-[#B5925A]/30 p-10 rounded-2xl max-w-md w-full relative flex flex-col items-center text-center overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setShowCheckInModal(false)}
                className="absolute top-5 right-5 text-white/50 hover:text-[#B5925A] transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="w-16 h-16 border border-[#B5925A]/30 bg-[#060A18] text-[#B5925A] rounded-full flex items-center justify-center mb-6 relative z-10">
                <LucideIcons.Smartphone size={28} strokeWidth={1.5} />
              </div>

              <h2 className="text-3xl font-serif text-white mb-2 relative z-10">
                Online Check-in
              </h2>
              <p className="text-white/60 font-sans text-sm mb-8 leading-relaxed relative z-10 px-4">
                Scan the QR code below with your smartphone camera to quickly
                complete your registration process securely from your device.
              </p>

              <div className="bg-white p-4 rounded-xl shadow-[0_0_40px_rgba(217,182,115,0.1)] mb-8 relative group cursor-pointer hover:scale-105 transition-transform duration-500 z-10">
                <QRCode
                  value={window.location.origin + "/check-in"}
                  size={200}
                  className="relative z-10"
                />
              </div>

              <p className="text-[#B5925A] font-sans text-[10px] tracking-[0.2em] uppercase font-medium relative z-10">
                Ready when you are
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      </React.Suspense>
      {/* Full Screen Image Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex flex-col pt-10"
          >
            <div className="flex justify-end p-6 absolute top-0 right-0 z-10 w-full bg-gradient-to-b from-black/80 to-transparent">
              <button
                onClick={() => setLightboxImage(null)}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md border border-white/10 group cursor-zoom-out"
              >
                <X
                  size={24}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </button>
            </div>

            <div
              className="flex-1 w-full h-full flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
              onClick={() => setLightboxImage(null)}
            >
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  duration: 0.3,
                }}
                src={lightboxImage}
                className="max-w-[95vw] max-h-[85vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQRScanner && (
          <QRScannerModal
            onClose={() => setShowQRScanner(false)}
            onScan={(result) => {
              console.log("Scanned QR Result:", result);
              setShowQRScanner(false);
              setPairedMessage("Device successfully paired with booking!");
              setTimeout(() => setPairedMessage(null), 5000);
            }}
          />
        )}
      </AnimatePresence>


      {/* Universal Go Back Button */}
      <AnimatePresence>
        {(activeModule || activeSubmodule) && !lightboxImage && !showAdminLogin && !showQRScanner && !showCheckInModal && (
          <motion.button
            key="universal-back-btn"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goBack();
            }}
            className="fixed bottom-20 left-6 md:bottom-24 md:left-10 z-[99999] flex items-center gap-2.5 px-5 py-3.5 bg-[#0B132B]/95 text-[#D9B673] hover:text-white border-2 border-[#D9B673]/60 hover:border-[#D9B673] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 font-sans text-xs tracking-widest uppercase font-semibold cursor-pointer"
          >
            <LucideIcons.ChevronLeft size={16} strokeWidth={2.5} />
            <span>Go Back</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* System Info Panel */}
      <AnimatePresence>
        {showSystemInfo && (
          <SystemInfoPanel
            onClose={() => setShowSystemInfo(false)}
            appStartTime={appStartTime}
            lastSyncTime={lastSyncTime}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ActionItem({
  icon,
  title,
  subtitle,
  pulseGlow,
  ...props
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  pulseGlow?: boolean;
  [key: string]: any;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      animate={
        pulseGlow
          ? {
              boxShadow: [
                "0px 0px 0px rgba(229,168,48,0)",
                "0px 0px 24px rgba(229,168,48,0.5)",
                "0px 0px 0px rgba(229,168,48,0)",
              ],
            }
          : {}
      }
      transition={
        pulseGlow
          ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
          : { type: "spring", stiffness: 400, damping: 25 }
      }
      {...props}
      className={`w-full bg-gradient-to-r from-[#06152a] via-[#081a33] to-[#06152a] rounded-2xl px-5 py-4 sm:px-6 sm:py-4.5 min-h-[96px] flex items-center justify-between border-[1.5px] border-[#E5A830] hover:border-[#F5BC45] transition-all duration-300 group shadow-md shadow-black/30 hover:shadow-xl hover:shadow-[#E5A830]/15 relative overflow-hidden text-left cursor-pointer ${
        pulseGlow ? "border-2 border-[#F5BC45]" : ""
      }`}
    >
      {pulseGlow && (
        <div className="absolute inset-0 bg-[#E5A830]/10 animate-pulse z-0 pointer-events-none" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E5A830]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-center gap-4 text-white relative z-10 flex-1 min-w-0 pr-2">
        <div className="text-[#E5A830] group-hover:text-[#F5BC45] shrink-0 group-hover:scale-105 transition-all">
          {
            // @ts-ignore
            React.isValidElement(icon)
              ? React.cloneElement(icon as any, {
                  size: 38,
                  strokeWidth: 1.75,
                })
              : icon
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-sans font-bold text-[13.5px] sm:text-[14.5px] tracking-wider uppercase text-white leading-snug truncate drop-shadow-sm">
            {title}
          </div>
          <div className="font-sans text-[12px] sm:text-[12.5px] text-[#A8B6CA] group-hover:text-[#CBD8E8] font-normal leading-snug mt-0.5 line-clamp-1 transition-colors">
            {subtitle}
          </div>
        </div>
      </div>
      <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full border-[1.5px] border-[#E5A830] group-hover:border-[#F5BC45] group-hover:bg-[#E5A830]/15 flex items-center justify-center text-[#E5A830] group-hover:text-[#F5BC45] transition-all duration-300 shadow-sm relative z-10">
        <ArrowRight size={16} strokeWidth={2.2} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </motion.button>
  );
}

function ModuleCard({
  icon,
  title,
  subtitle,
  image,
  className,
  pulseGlow,
  children,
  ...props
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  image?: string;
  className?: string;
  pulseGlow?: boolean;
  children?: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      animate={
        pulseGlow
          ? {
              boxShadow: [
                "0px 0px 0px rgba(229,168,48,0)",
                "0px 0px 24px rgba(229,168,48,0.5)",
                "0px 0px 0px rgba(229,168,48,0)",
              ],
            }
          : {}
      }
      transition={
        pulseGlow
          ? { repeat: Infinity, duration: 2, ease: "easeInOut" }
          : { type: "spring", stiffness: 400, damping: 25 }
      }
      {...props}
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-300 bg-gradient-to-r from-[#06152a] via-[#081a33] to-[#06152a] border-[1.5px] border-[#E5A830] hover:border-[#F5BC45] shadow-md shadow-black/30 hover:shadow-xl hover:shadow-[#E5A830]/15 flex items-center px-5 py-4 sm:px-6 sm:py-4.5 min-h-[96px] text-left w-full cursor-pointer group",
        pulseGlow && "border-2 border-[#F5BC45]",
        className,
      )}
    >
      {pulseGlow && (
        <div className="absolute inset-0 bg-[#E5A830]/10 animate-pulse z-20 pointer-events-none" />
      )}
      
      {/* Subtle hover sheen */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E5A830]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {image && (
        <div className="absolute inset-y-0 right-0 w-1/3 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06152a] to-transparent pointer-events-none" />
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between w-full gap-4">
        {/* Left: Gold Outlined Icon */}
        <div className="text-[#E5A830] group-hover:text-[#F5BC45] shrink-0 transition-all duration-300 group-hover:scale-105">
          {
            // @ts-ignore
            React.isValidElement(icon)
              ? React.cloneElement(icon as any, {
                  size: 38,
                  strokeWidth: 1.75,
                })
              : icon
          }
        </div>

        {/* Middle: Uppercase White Title & Subtitle */}
        <div className="flex-1 min-w-0 pr-1">
          <h3 className="font-sans font-bold text-[13.5px] sm:text-[14.5px] tracking-wider text-white uppercase leading-snug truncate drop-shadow-sm">
            {title}
          </h3>
          <p className="font-sans text-[12px] sm:text-[12.5px] text-[#A8B6CA] group-hover:text-[#CBD8E8] font-normal leading-snug mt-0.5 line-clamp-1 transition-colors">
            {subtitle}
          </p>
        </div>

        {/* Right: Gold Outlined Circle with Gold Right Arrow */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full border-[1.5px] border-[#E5A830] group-hover:border-[#F5BC45] group-hover:bg-[#E5A830]/15 flex items-center justify-center transition-all duration-300 shadow-sm">
          <ArrowRight
            size={16}
            strokeWidth={2.2}
            className="text-[#E5A830] group-hover:text-[#F5BC45] transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </div>
      </div>
      {children}
    </motion.button>
  );
}
