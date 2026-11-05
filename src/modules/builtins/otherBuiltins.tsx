import React from "react";
import { ModulePlugin, ModuleContext } from "../types";
import DirectoryOfServicesLayout from "../../components/DirectoryOfServicesLayout";
import WeddingsLayout from "../../components/WeddingsLayout";
import AwardsLayout from "../../components/AwardsLayout";
import GeneralInfoLayout from "../../components/GeneralInfoLayout";
import LocalAttractionsLayout from "../../components/LocalAttractionsLayout";
import AirportInfoLayout from "../../components/AirportInfoLayout";
import BusRoutesLayout from "../../components/BusRoutesLayout";

export const directoryPlugin: ModulePlugin = {
  manifest: {
    id: "m1",
    name: "Directory Of Services",
    subtitle: "Our services are at your convenience...",
    description: "Complete A-Z directory of hotel front desk, bell staff, dry cleaning, wake-up calls, room dining, and guest relations.",
    version: "1.0.0",
    author: "Constantinou Bros Hotels",
    icon: "ConciergeBell",
    category: "guest-services",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop",
  },
  renderDetail: (context: ModuleContext, props?: any) => {
    const hotelModules = context.hotel?.content?.modules || [];
    const moduleData =
      props?.module ||
      hotelModules.find((m: any) => m.id === "m1" || m.title?.toLowerCase().includes("directory")) || {
        id: "m1",
        title: "Directory Of Services",
        subtitle: "Our services are at your convenience...",
        icon: "ConciergeBell",
      };
    return <DirectoryOfServicesLayout module={moduleData} onClose={() => context.navigation.closeModule()} />;
  },
};

export const weddingsPlugin: ModulePlugin = {
  manifest: {
    id: "m15",
    name: "Weddings & Celebrations",
    subtitle: "Dream Weddings in Cyprus",
    description: "Breathtaking beachfront gazebos, sunset cocktail receptions, bespoke wedding planning, floral styling, and banquet menus.",
    version: "1.2.0",
    author: "Constantinou Bros Hotels",
    icon: "Heart",
    category: "guest-services",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop",
  },
  renderDetail: (context: ModuleContext, props?: any) => {
    const hotelModules = context.hotel?.content?.modules || [];
    const moduleData =
      props?.module ||
      hotelModules.find((m: any) => m.id === "m15" || m.title?.toLowerCase().includes("wedding")) || {
        id: "m15",
        title: "Weddings",
        subtitle: "System Module",
        icon: "Heart",
      };
    return <WeddingsLayout module={moduleData} onClose={() => context.navigation.closeModule()} />;
  },
};

export const awardsPlugin: ModulePlugin = {
  manifest: {
    id: "m11",
    name: "Awards & Recognitions",
    subtitle: "Our Achievements",
    description: "TripAdvisor Travelers' Choice Best of the Best, TUI Global Hotel Awards, World Luxury Hotel Awards, and Green Key certifications.",
    version: "1.0.0",
    author: "Constantinou Bros Hotels",
    icon: "Trophy",
    category: "information",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=2000&auto=format&fit=crop",
  },
  renderDetail: (context: ModuleContext, props?: any) => {
    const hotelModules = context.hotel?.content?.modules || [];
    const moduleData =
      props?.module ||
      hotelModules.find((m: any) => m.id === "m11" || m.title?.toLowerCase().includes("award")) || {
        id: "m11",
        title: "Awards",
        subtitle: "Our Achievements",
        icon: "Trophy",
      };
    return <AwardsLayout module={moduleData} onClose={() => context.navigation.closeModule()} />;
  },
};

export const generalInfoPlugin: ModulePlugin = {
  manifest: {
    id: "m14",
    name: "General Information",
    subtitle: "Need to Know",
    description: "Essential resort guides, pool hours, check-in / check-out times, voltage, currency, emergency contact, and Wi-Fi credentials.",
    version: "1.1.0",
    author: "Constantinou Bros Hotels",
    icon: "Info",
    category: "information",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2000&auto=format&fit=crop",
  },
  renderDetail: (context: ModuleContext, props?: any) => {
    const hotelModules = context.hotel?.content?.modules || [];
    const moduleData =
      props?.module ||
      hotelModules.find((m: any) => m.id === "m14" || m.title?.toLowerCase().includes("general info")) || {
        id: "m14",
        title: "General Information",
        subtitle: "Need to Know",
        icon: "Info",
      };
    return (
      <GeneralInfoLayout
        module={moduleData}
        onClose={() => context.navigation.closeModule()}
        onOpenSubmodule={(sub) => context.navigation.openSubmodule(sub)}
      />
    );
  },
};

export const attractionsPlugin: ModulePlugin = {
  manifest: {
    id: "m16",
    name: "Local Attractions & Excursions",
    subtitle: "Discover Paphos & Cyprus",
    description: "Paphos Archaeological Park, Tombs of the Kings, Aphrodite's Rock (Petra tou Romiou), Akamas Peninsula, and Troodos wine villages.",
    version: "1.2.0",
    author: "Constantinou Bros Hotels",
    icon: "MapPin",
    category: "activities",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop",
  },
  renderDetail: (context: ModuleContext) => {
    return <LocalAttractionsLayout currentHotel={context.hotel} onBack={() => context.navigation.closeModule()} />;
  },
};

export const airportPlugin: ModulePlugin = {
  manifest: {
    id: "airport",
    name: "Airport Flights Live Tracker",
    subtitle: "PFO & LCA Departures/Arrivals",
    description: "Real-time flight arrival and departure board for Paphos International Airport (PFO) and Larnaca International Airport (LCA).",
    version: "2.0.0",
    author: "Constantinou Bros Hotels",
    icon: "Plane",
    category: "utilities",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop",
  },
  renderDetail: (context: ModuleContext, props?: any) => {
    const hotelModules = context.hotel?.content?.modules || [];
    const moduleData =
      props?.module ||
      hotelModules.find((m: any) => m.id === "airport" || m.title?.toLowerCase().includes("flight")) || {
        id: "airport",
        title: "Airport Information",
      };
    return <AirportInfoLayout module={moduleData} onClose={() => context.navigation.closeModule()} />;
  },
};

export const busRoutesPlugin: ModulePlugin = {
  manifest: {
    id: "bus_routes",
    name: "Local Bus Routes & Schedules",
    subtitle: "Public Transit & OSYPA Timetables",
    description: "Bus routes 611, 612, 615 connecting Constantinou Bros Hotels to Paphos Harbour, Old Town, Coral Bay, and the Airport.",
    version: "1.0.0",
    author: "Constantinou Bros Hotels",
    icon: "Bus",
    category: "utilities",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2000&auto=format&fit=crop",
  },
  renderDetail: (context: ModuleContext, props?: any) => {
    const hotelModules = context.hotel?.content?.modules || [];
    const moduleData =
      props?.module ||
      hotelModules.find((m: any) => m.id === "bus_routes" || m.title?.toLowerCase().includes("bus")) || {
        id: "bus_routes",
        title: "Bus Routes",
      };
    return <BusRoutesLayout module={moduleData} onClose={() => context.navigation.closeModule()} />;
  },
};
