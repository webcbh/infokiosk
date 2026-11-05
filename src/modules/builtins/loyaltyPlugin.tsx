import React from "react";
import { ModulePlugin, ModuleContext } from "../types";
import LoyaltyLayout from "../../components/LoyaltyLayout";

export const loyaltyPlugin: ModulePlugin = {
  manifest: {
    id: "m9",
    name: "Guests Loyalty Club",
    subtitle: "Exclusive Privileges",
    description: "Discover tiers, points multiplier, exclusive complimentary upgrades, airport transfers, and loyalty perks.",
    version: "1.1.0",
    author: "Constantinou Bros Hotels",
    icon: "Gift",
    category: "guest-services",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2000&auto=format&fit=crop",
    permissions: ["network", "inter-module"],
    defaultConfig: {
      tierName: "Diamond Guest",
      pointsPerEuro: 10,
    },
  },

  onInit: (ctx: ModuleContext) => {
    ctx.bus.on("dining:reservation-confirmed", () => {
      ctx.notify("100 Loyalty Points credited for dining reservation!", "success");
    });
  },

  renderDetail: (context: ModuleContext, props?: any) => {
    const hotelModules = context.hotel?.content?.modules || [];
    const moduleData =
      props?.module ||
      hotelModules.find((m: any) => m.id === "m9" || m.title?.toLowerCase().includes("loyalty")) || {
        id: "m9",
        title: "Guests Loyalty Club",
        subtitle: "Exclusive Privileges",
        icon: "Gift",
      };

    return <LoyaltyLayout module={moduleData} onClose={() => context.navigation.closeModule()} />;
  },
};
