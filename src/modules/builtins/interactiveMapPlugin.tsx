import React from "react";
import { ModulePlugin, ModuleContext } from "../types";
import InteractiveMapLayout from "../../components/InteractiveMapLayout";

export const interactiveMapPlugin: ModulePlugin = {
  manifest: {
    id: "m12",
    name: "Interactive Resort Map",
    subtitle: "Find Your Way",
    description: "Detailed interactive campus navigation showing pools, cabanas, tennis courts, elevators, reception, and beach access.",
    version: "1.3.0",
    author: "Constantinou Bros Hotels",
    icon: "Map",
    category: "information",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1524813686514-a57563d77d61?q=80&w=2000&auto=format&fit=crop",
    permissions: ["location", "inter-module"],
    defaultConfig: {
      defaultZoom: 16,
      showAmenitiesPin: true,
    },
  },

  renderDetail: (context: ModuleContext, props?: any) => {
    const hotelModules = context.hotel?.content?.modules || [];
    const moduleData =
      props?.module ||
      hotelModules.find((m: any) => m.id === "m12" || m.title?.toLowerCase().includes("map")) || {
        id: "m12",
        title: "Hotel Map",
        subtitle: "Find Your Way",
        icon: "Map",
      };

    return (
      <InteractiveMapLayout
        module={moduleData}
        onBack={() => context.navigation.closeModule()}
        onOpenSubmodule={(sub) => context.navigation.openSubmodule(sub)}
      />
    );
  },
};
