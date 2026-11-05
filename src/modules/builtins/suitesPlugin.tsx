import React from "react";
import { ModulePlugin, ModuleContext } from "../types";
import SuitesGridLayout from "../../components/SuitesGridLayout";

export const suitesPlugin: ModulePlugin = {
  manifest: {
    id: "m2",
    name: "Suites & Accommodations",
    subtitle: "Elegance & Comfort",
    description: "Browse luxury suites, private pool villas, penthouse suites, amenities floorplans, and request in-suite service.",
    version: "1.5.0",
    author: "Constantinou Bros Hotels",
    icon: "Bed",
    category: "guest-services",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop",
    permissions: [],
  },

  renderDetail: (context: ModuleContext, props?: any) => {
    const hotelModules = context.hotel?.content?.modules || [];
    const moduleData =
      props?.module ||
      hotelModules.find((m: any) => m.id === "m2" || m.title?.toLowerCase().includes("suite") || m.title?.toLowerCase().includes("room")) || {
        id: "m2",
        title: "Suites",
        subtitle: "Elegance & Comfort",
        icon: "Bed",
      };

    return (
      <SuitesGridLayout
        module={moduleData}
        onBack={() => context.navigation.closeModule()}
        onOpenSubmodule={(sub) => context.navigation.openSubmodule(sub)}
      />
    );
  },
};
