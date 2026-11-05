import React from "react";
import { ModulePlugin, ModuleContext } from "../types";
import GolfLayout from "../../components/GolfLayout";

export const golfPlugin: ModulePlugin = {
  manifest: {
    id: "m10",
    name: "Golf Holidays & Tee Times",
    subtitle: "Tee Off in Paradise",
    description: "Championship 18-hole golf courses nearby in Paphos: Minthis, Elea Estate, Secret Valley, and Aphrodite Hills with complimentary shuttle services.",
    version: "1.2.0",
    author: "Constantinou Bros Hotels",
    icon: "Flag",
    category: "activities",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=2000&auto=format&fit=crop",
    permissions: ["network"],
    defaultConfig: {
      enableConciergeBooking: true,
    },
  },

  renderDetail: (context: ModuleContext, props?: any) => {
    const hotelModules = context.hotel?.content?.modules || [];
    const moduleData =
      props?.module ||
      hotelModules.find((m: any) => m.id === "m10" || m.title?.toLowerCase().includes("golf")) || {
        id: "m10",
        title: "Golf Holidays",
        subtitle: "Tee Off in Paradise",
        icon: "Flag",
      };

    return (
      <GolfLayout
        module={moduleData}
        onBack={() => context.navigation.closeModule()}
        onOpenSubmodule={(sub) => context.navigation.openSubmodule(sub)}
      />
    );
  },
};
