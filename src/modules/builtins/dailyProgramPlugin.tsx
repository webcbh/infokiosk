import React from "react";
import { ModulePlugin, ModuleContext } from "../types";
import DailyProgramLayout from "../../components/DailyProgramLayout";

export const dailyProgramPlugin: ModulePlugin = {
  manifest: {
    id: "m6",
    name: "Daily Program & Activities",
    subtitle: "Experience Every Day",
    description: "Curated daily itinerary featuring morning yoga, aqua aerobics, live evening music, cocktail workshops, and tours.",
    version: "2.0.0",
    author: "Constantinou Bros Hotels",
    icon: "Music",
    category: "activities",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop",
    permissions: ["inter-module"],
    defaultConfig: {
      autoScrollToCurrentTime: true,
      showActivityHighlights: true,
    },
    configSchema: [
      {
        key: "autoScrollToCurrentTime",
        label: "Auto-Scroll to Next Upcoming Event",
        type: "boolean",
        defaultValue: true,
      },
    ],
  },

  onInit: (ctx: ModuleContext) => {
    ctx.bus.registerQueryHandler("getTodaysEvents", () => {
      const dp = ctx.hotel?.content?.dailyProgram || [];
      return dp[0]?.events || [];
    });
  },

  renderDetail: (context: ModuleContext) => {
    return (
      <DailyProgramLayout
        currentHotel={context.hotel}
        onBack={() => context.navigation.closeModule()}
      />
    );
  },
};
