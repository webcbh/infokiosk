import React from "react";
import { ModulePlugin, ModuleContext } from "../types";
import WeatherLayout from "../../components/WeatherLayout";

export const weatherPlugin: ModulePlugin = {
  manifest: {
    id: "m13",
    name: "Weather & Mediterranean Forecast",
    subtitle: "Plan Your Perfect Day",
    description: "Real-time meteorological conditions, UV index, sea water temperature, wind speed, and 7-day Paphos forecast.",
    version: "2.0.0",
    author: "Constantinou Bros Hotels",
    icon: "Sun",
    category: "utilities",
    targetSurfaces: "both",
    bannerImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2000&auto=format&fit=crop",
    permissions: ["network", "inter-module"],
    defaultConfig: {
      units: "metric",
      refreshIntervalMinutes: 30,
    },
    configSchema: [
      {
        key: "units",
        label: "Temperature Scale",
        type: "select",
        options: [
          { label: "Celsius (°C)", value: "metric" },
          { label: "Fahrenheit (°F)", value: "imperial" },
        ],
        defaultValue: "metric",
      },
    ],
  },

  onInit: (ctx: ModuleContext) => {
    ctx.bus.registerQueryHandler("getCurrentWeather", () => {
      return ctx.weather || { temp: 24, description: "Sunny & Mild" };
    });
  },

  renderDetail: (context: ModuleContext, props?: any) => {
    const hotelModules = context.hotel?.content?.modules || [];
    const moduleData =
      props?.module ||
      hotelModules.find((m: any) => m.id === "m13" || m.title?.toLowerCase().includes("weather")) || {
        id: "m13",
        title: "Weather",
        subtitle: "Plan Your Perfect Day",
        icon: "Sun",
      };

    return <WeatherLayout module={moduleData} onClose={() => context.navigation.closeModule()} />;
  },
};
