import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from "lucide-react";

const CYPRUS_CITIES = [
  { name: "Nicosia", lat: 35.1856, lon: 33.3823 },
  { name: "Limassol", lat: 34.6786, lon: 33.042 },
  { name: "Larnaca", lat: 34.9157, lon: 33.6292 },
  { name: "Paphos", lat: 34.7725, lon: 32.4245 },
  { name: "Famagusta", lat: 35.1149, lon: 33.9396 },
  { name: "Kyrenia", lat: 35.335, lon: 33.315 },
];

function getWeatherIcon(code: number, size: number = 24, color: string = "#d9a05b") {
  if (code === 0) return <LucideIcons.Sun color={color} size={size} strokeWidth={1.5} />;
  if (code >= 1 && code <= 3) return <LucideIcons.CloudSun color={color} size={size} strokeWidth={1.5} />;
  if (code >= 45 && code <= 48) return <LucideIcons.CloudFog color={color} size={size} strokeWidth={1.5} />;
  if (code >= 51 && code <= 67) return <LucideIcons.CloudRain color={color} size={size} strokeWidth={1.5} />;
  if (code >= 71 && code <= 77) return <LucideIcons.CloudSnow color={color} size={size} strokeWidth={1.5} />;
  if (code >= 80 && code <= 82) return <LucideIcons.CloudRain color={color} size={size} strokeWidth={1.5} />;
  if (code >= 95 && code <= 99) return <LucideIcons.CloudLightning color={color} size={size} strokeWidth={1.5} />;
  return <LucideIcons.Cloud color={color} size={size} strokeWidth={1.5} />;
}

function getWeatherDescription(code: number) {
  if (code === 0) return "Clear sky";
  if (code >= 1 && code <= 3) return "Partly cloudy";
  if (code >= 45 && code <= 48) return "Fog";
  if (code >= 51 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Cloudy";
}

export default function WeatherLayout({ module, onClose }: { module: any, onClose: () => void }) {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const brandBlue = "#0b2545";
  const brandGold = "#d9a05b";
  const bgLight = "#fcfcfc";

  useEffect(() => {
    async function fetchWeather() {
      try {
        const promises = CYPRUS_CITIES.map(async (city) => {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=3`,
          );
          if (!res.ok) throw new Error("Weather API failed");
          const data = await res.json();
          return { ...city, current: data.current_weather, daily: data.daily };
        });
        const results = await Promise.all(promises);
        setWeatherData(results);
      } catch (err: any) {
        console.warn("Failed to fetch weather", err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col overflow-y-auto"
      style={{ backgroundColor: bgLight, fontFamily: 'Inter, sans-serif' }}
    >
      {/* Top Nav Bar */}
      <div className="flex items-center px-4 py-4 sticky top-0 z-20 shadow-sm" style={{ backgroundColor: brandBlue }}>
        <button onClick={onClose} className="flex items-center text-white hover:opacity-80 transition-opacity font-semibold">
          <LucideIcons.ChevronLeft size={24} className="mr-2" />
          <span className="tracking-wide uppercase text-sm md:text-base">{module?.title || "WEATHER"}</span>
        </button>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-1 mb-6" style={{ backgroundColor: brandGold }}
          />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-4" 
            style={{ color: brandBlue }}
          >
            {module?.title || "WEATHER FORECAST"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl max-w-2xl text-neutral-600 leading-relaxed"
          >
            {module?.subtitle || "Current weather and 3-day forecast for all major cities in Cyprus."}
          </motion.p>
        </div>

        {loading ? (
           <div className="flex items-center justify-center py-24">
             <LucideIcons.Loader2 className="animate-spin" size={48} style={{ color: brandGold }} />
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12">
            {weatherData.map((city, idx) => (
              <div 
                key={idx} 
                className="flex flex-col bg-white border border-gray-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] transition-shadow"
              >
                {/* City Current Weather */}
                <div className="p-6 md:p-8 flex items-center justify-between" style={{ backgroundColor: brandBlue }}>
                   <div>
                       <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-1">{city.name}</h3>
                       <p className="text-white/80 text-sm md:text-base capitalize">{getWeatherDescription(city.current.weathercode)}</p>
                   </div>
                   <div className="flex items-center gap-4 text-white">
                      {getWeatherIcon(city.current.weathercode, 40, brandGold)}
                      <div className="text-4xl md:text-5xl font-bold font-serif">{Math.round(city.current.temperature)}°</div>
                   </div>
                </div>

                {/* City 3-Day Forecast */}
                <div className="p-6 md:p-8 grid grid-cols-3 divide-x divide-gray-100">
                    {city.daily.time.slice(0, 3).map((dateStr: string, i: number) => {
                       const date = new Date(dateStr + "T12:00:00Z");
                       const isToday = i === 0;
                       const dayName = isToday ? "Today" : date.toLocaleDateString('en-US', { weekday: 'short' });
                       
                       return (
                         <div key={i} className="flex flex-col items-center justify-center text-center gap-3 px-2">
                             <div className="text-xs md:text-sm uppercase tracking-wider font-bold" style={{ color: brandBlue }}>
                                 {dayName}
                             </div>
                             {getWeatherIcon(city.daily.weathercode[i], 28, brandBlue)}
                             <div className="flex items-center gap-2 text-sm md:text-base font-bold">
                                <span style={{ color: brandGold }}>{Math.round(city.daily.temperature_2m_max[i])}°</span>
                                <span className="opacity-60" style={{ color: brandBlue }}>{Math.round(city.daily.temperature_2m_min[i])}°</span>
                             </div>
                         </div>
                       )
                    })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
