import React from "react";
import { ModulePlugin, ModuleContext } from "../types";
import RestaurantsGridLayout from "../../components/RestaurantsGridLayout";

export const diningPlugin: ModulePlugin = {
  manifest: {
    id: "m3",
    name: "Restaurants & Fine Dining",
    subtitle: "A World of Flavors",
    description: "Explore exquisite à la carte restaurants, buffets, wine pairings, and reserve tables directly.",
    version: "2.1.0",
    author: "Constantinou Bros Hotels",
    icon: "Utensils",
    category: "guest-services",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=2000&auto=format&fit=crop",
    permissions: ["network", "inter-module"],
    defaultConfig: {
      enableOnlineReservation: true,
      reservationNoticeHours: 2,
      displayDressCode: true,
    },
    configSchema: [
      {
        key: "enableOnlineReservation",
        label: "Enable Instant Table Reservations",
        type: "boolean",
        defaultValue: true,
      },
      {
        key: "reservationNoticeHours",
        label: "Minimum Notice Required (Hours)",
        type: "number",
        defaultValue: 2,
      },
      {
        key: "displayDressCode",
        label: "Display Evening Dress Code Guidelines",
        type: "boolean",
        defaultValue: true,
      },
    ],
  },

  onInit: (ctx: ModuleContext) => {
    // Register RPC handler so other modules (like currency converter or concierge) can query dining options
    ctx.bus.registerQueryHandler("getRestaurants", () => {
      const hotelModules = ctx.hotel?.content?.modules || [];
      const restModule = hotelModules.find((m: any) => m.id === "m3" || m.title?.toLowerCase().includes("restaurant"));
      return restModule?.submodules || [];
    });
  },

  renderDetail: (context: ModuleContext, props?: any) => {
    const hotelModules = context.hotel?.content?.modules || [];
    const moduleData =
      props?.module ||
      hotelModules.find((m: any) => m.id === "m3" || m.title?.toLowerCase().includes("restaurant")) || {
        id: "m3",
        title: "Restaurants & Dining",
        subtitle: "A World of Flavors",
        icon: "Utensils",
        submodules: [],
      };

    return (
      <RestaurantsGridLayout
        module={moduleData}
        onBack={() => context.navigation.closeModule()}
        onOpenSubmodule={(sub) => context.navigation.openSubmodule(sub)}
      />
    );
  },
};
