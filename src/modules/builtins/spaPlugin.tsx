import React from "react";
import { ModulePlugin, ModuleContext } from "../types";
import SpaLayout from "../../components/SpaLayout";

export const spaPlugin: ModulePlugin = {
  manifest: {
    id: "m8",
    name: "Elixir Spa & Wellness",
    subtitle: "Relax & Rejuvenate",
    description: "Holistic wellness therapies, signature massages, thalassotherapy, sauna, steam baths, and couple packages.",
    version: "1.4.0",
    author: "Constantinou Bros Hotels",
    icon: "Flower2",
    category: "amenities",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop",
    permissions: ["network", "inter-module"],
    defaultConfig: {
      enableDirectInquiry: true,
      showSignatureTreatments: true,
    },
    configSchema: [
      {
        key: "enableDirectInquiry",
        label: "Allow Instant Spa Treatment Inquiries",
        type: "boolean",
        defaultValue: true,
      },
    ],
  },

  onInit: (ctx: ModuleContext) => {
    // Listen for booking requests from other modules
    ctx.bus.on("spa:book-treatment", (payload) => {
      ctx.notify(`Spa treatment booking requested for ${payload?.name || "Guest"}.`, "success");
    });
  },

  renderDetail: (context: ModuleContext, props?: any) => {
    const hotelModules = context.hotel?.content?.modules || [];
    const moduleData =
      props?.module ||
      hotelModules.find((m: any) => m.id === "m8" || m.title?.toLowerCase().includes("spa") || m.title?.toLowerCase().includes("elixir")) || {
        id: "m8",
        title: "Elixir Spa",
        subtitle: "Relax & Rejuvenate",
        icon: "Flower2",
      };

    return <SpaLayout module={moduleData} onClose={() => context.navigation.closeModule()} />;
  },
};
