import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Hand, Bus, Bell, Calendar, Utensils, Map, Info, PhoneCall, Wine, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InteractiveMapLayout({ module, onBack, onOpenSubmodule }: { module: any, onBack: () => void, onOpenSubmodule: (sub: any) => void }) {
  const mapImage = module.mapImage || module.image;
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeLocation, setActiveLocation] = useState<number | null>(null);

  const submodules = (module.submodules || []).filter(Boolean);

  const groupedSubmodules = submodules.reduce((acc: any, sub: any, idx: number) => {
    const category = sub.category || 'Locations';
    if (!acc[category]) acc[category] = [];
    acc[category].push({ ...sub, originalIndex: idx });
    return acc;
  }, {});
  
  const categories = ["All", ...Object.keys(groupedSubmodules)];
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const handleLocationClick = (idx: number) => {
    if (activeLocation === idx) {
      setActiveLocation(null);
    } else {
      setActiveLocation(idx);
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Helper for generating deterministic default sub-icons
  const getSubIcon = (title: string, index: number) => {
    const t = (title || "").toLowerCase();
    if (t.includes('pool') || t.includes('swim')) return <div className="w-5 h-5 bg-[#C39B57] rounded-full opacity-80" />;
    if (t.includes('spa') || t.includes('well')) return <div className="w-5 h-5 border-2 border-[#C39B57] rounded-full rotate-45" />;
    if (t.includes('beach') || t.includes('sand')) return <div className="w-5 h-5 bg-[#C39B57] rounded-t-full" />;
    if (t.includes('suite') || t.includes('room')) return <div className="w-5 h-5 border-2 border-[#C39B57]" />;
    if (t.includes('sport') || t.includes('tenni')) return <div className="w-5 h-5 border-2 border-[#C39B57] rounded-full border-dashed" />;
    if (t.includes('rest') || t.includes('din') || t.includes('bar')) return <Utensils size={20} className="text-[#C39B57]" />;
    if (t.includes('wed') || t.includes('event')) return <div className="w-5 h-5 border-[3px] border-[#C39B57] rounded-full" />;
    if (t.includes('park') || t.includes('car')) return <div className="w-6 h-3 bg-[#C39B57] rounded-t-xl" />;
    return <Bell size={20} className="text-[#C39B57]" />;
  };

  return (
    <div className="w-full min-h-screen bg-white font-sans flex flex-col relative pb-20">
      

      {/* Hero Header */}
      <div className="px-6 py-8 flex flex-col md:flex-row items-center md:items-start gap-6 max-w-5xl mx-auto w-full">
        <div className="w-24 h-24 rounded-full bg-[#102442] flex items-center justify-center shrink-0 border-[3px] border-[#C39B57] shadow-lg relative">
          <Map className="text-[#C39B57]" size={40} strokeWidth={1.5} />
          <div className="absolute right-6 top-6">
            <div className="w-3 h-3 bg-[#C39B57] rounded-full border-2 border-[#102442]" />
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-xl md:text-3xl font-bold text-[#102442] mb-3 uppercase tracking-wider break-words">{module.title || "HOTEL MAP"}</h1>
          <div className="w-16 h-[2px] bg-[#C39B57] mb-4 mx-auto md:mx-0"></div>
          <p className="text-neutral-600 text-sm max-w-lg leading-relaxed">
            {module.description || "Explore our resort and discover everything we have to offer. Click on a location to learn more."}
          </p>
        </div>
      </div>

      <div className="w-[74vw] mx-auto">
        {/* Map Image Container */}
        <div className="pb-6">
          <div 
            ref={containerRef} 
            className="relative w-full bg-[#E5E5E5]"
          >
            {mapImage ? (
              <div className="relative w-full">
                <img 
                  src={mapImage} 
                  alt={module.title || "Map"} 
                  className="w-full h-auto object-contain pointer-events-none select-none"
                  draggable={false}
                />
                
                {/* Map Markers */}
                {submodules.map((sub: any, idx: number) => {
                  const x = sub.mapX || (15 + (idx * 27) % 70);
                  const y = sub.mapY || (15 + (idx * 19) % 70);
                  const subCategory = sub.category || 'Locations';
                  
                  if (activeCategory !== "All" && activeCategory !== subCategory) {
                    return null;
                  }
                  
                  return (
                    <button 
                      key={idx}
                      onPointerDown={(e) => e.stopPropagation()} // Prevent dragging when interacting with marker
                      onClick={() => handleLocationClick(idx)}
                      className={`absolute w-10 h-10 -ml-5 -mt-5 group focus:outline-none flex flex-col items-center justify-center z-10 transition-transform ${activeLocation === idx ? 'scale-125 z-30' : 'hover:scale-110'}`}
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      {activeLocation === idx && (
                        <span className="absolute w-14 h-14 rounded-full bg-[#C39B57]/40 animate-ping pointer-events-none" />
                      )}
                      <div className={`relative bg-[#102442] text-white w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center shadow-lg border-2 ${activeLocation === idx ? 'border-white bg-[#C39B57]' : 'border-[#C39B57]'}`}>
                        <span className="font-bold text-xs md:text-sm pointer-events-none">{idx + 1}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="w-full min-h-[50vh] flex flex-col items-center justify-center text-neutral-400 bg-neutral-100">
                <Map size={48} className="mb-4 opacity-50" />
                <p>No map image uploaded.</p>
                <p className="text-xs mt-2 opacity-70">Please upload a Module Cover Image from the Admin Dashboard.</p>
              </div>
            )}
            
            {/* Floating Info Tag or Active Location Card */}
            {activeLocation !== null && submodules[activeLocation] ? (
              <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden z-40 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {submodules[activeLocation].image && (
                  <div className="w-full h-32 bg-neutral-200 relative">
                    <img src={submodules[activeLocation].image} alt={submodules[activeLocation].title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-4 relative">
                  <button onClick={() => setActiveLocation(null)} className="absolute top-2 right-2 w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500 hover:bg-neutral-200">
                    ×
                  </button>
                  <h3 className="font-bold text-[#102442] text-sm uppercase tracking-wide pr-6">{submodules[activeLocation].title}</h3>
                  <p className="text-xs text-neutral-500 mt-1">{submodules[activeLocation].subtitle || "Resort Location"}</p>
                  {submodules[activeLocation].content && (
                    <p className="text-xs text-neutral-600 mt-2 line-clamp-2">{submodules[activeLocation].content}</p>
                  )}
                  <button onClick={() => onOpenSubmodule(submodules[activeLocation])} className="mt-3 w-full py-2 bg-[#102442] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#152e55] transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute bottom-4 left-4 bg-[#102442] text-white px-4 py-2.5 rounded-lg flex items-center gap-3 shadow-lg border border-white/10 backdrop-blur-md">
                <Hand size={24} className="text-[#C39B57]" strokeWidth={1.5} />
                <div className="flex flex-col text-left leading-tight">
                  <span className="font-semibold text-xs tracking-wide">TAP ON A LOCATION</span>
                  <span className="text-[10px] text-white/70">to learn more</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        {categories.length > 1 && (
          <div className="mx-4 mb-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? 'bg-[#102442] text-white'
                      : 'bg-[#FAFAFA] text-[#102442] border border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Legend Grid */}
        <div className="mx-4 mb-6 flex flex-col gap-6">
          {Object.entries(groupedSubmodules).filter(([category]) => activeCategory === "All" || category === activeCategory).map(([category, items]: [string, any]) => (
            <div key={category} className="bg-[#FAFAFA] border border-neutral-200 rounded-2xl p-6 md:p-8">
              <h2 className="text-[#102442] font-bold uppercase tracking-widest mb-6 border-b border-[#C39B57]/30 pb-2 text-sm">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6">
                {items.map((sub: any) => (
                  <button 
                    key={sub.originalIndex}
                    className={`flex items-start gap-4 text-left group transition-all p-2 rounded-xl ${activeLocation === sub.originalIndex ? 'bg-[#102442]/5 scale-105' : 'hover:opacity-70'}`}
                    onClick={() => handleLocationClick(sub.originalIndex)}
                  >
                    <div className="w-7 h-7 rounded-full bg-[#102442] text-white flex items-center justify-center border-2 border-[#C39B57] shrink-0 text-xs font-bold mt-0.5">
                      {sub.originalIndex + 1}
                    </div>
                    <div className="w-8 flex justify-center shrink-0 mt-0.5">
                      {getSubIcon(sub.title, sub.originalIndex)}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#102442] text-[13px] tracking-wide uppercase mb-0.5 leading-tight">{sub.title}</h3>
                      <p className="text-[11px] text-neutral-500 leading-tight">
                        {sub.subtitle || "Resort Location"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

