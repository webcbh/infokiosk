import React, { useState } from 'react';
import { ChevronLeft, Bed, Armchair, Building, Tv, Snowflake, Refrigerator, Shield, Coffee, Droplets, Star, Info, Utensils, Sparkles, MapPin, ChevronRight, Wifi } from 'lucide-react';

export default function SuitesGridLayout({ module, onOpenSubmodule, onBack }: { module: any, onOpenSubmodule: (sub: any) => void, onBack: () => void }) {
  const submodules = module.submodules || [];
  
  const [activeTab, setActiveTab] = useState('ALL ROOMS');

  const allCategories = Array.from(new Set(submodules.flatMap((s: any) => s.categories || []))).filter(Boolean) as string[];

  const tabs = [
    { name: 'ALL ROOMS', icon: <Building size={24} strokeWidth={1} className="text-[#C09F64]" /> },
    ...allCategories.map(cat => ({
      name: cat.toUpperCase(),
      icon: cat.toLowerCase().includes('suite') ? <Armchair size={24} strokeWidth={1} className="text-[#C09F64]" /> : <Bed size={24} strokeWidth={1} className="text-[#C09F64]" />
    }))
  ];

  // If no categories are defined in the backend, fallback to some defaults so the UI doesn't look empty
  if (tabs.length === 1) {
    tabs.push(
      { name: 'SUITES', icon: <Armchair size={24} strokeWidth={1} className="text-[#C09F64]" /> },
      { name: 'ROOMS', icon: <Bed size={24} strokeWidth={1} className="text-[#C09F64]" /> }
    );
  }

  // Filter submodules based on active tab
  const filteredSubmodules = activeTab === 'ALL ROOMS' 
    ? submodules 
    : submodules.filter((s: any) => 
        (s.categories && s.categories.some((c: string) => c.toUpperCase() === activeTab)) ||
        (!s.categories && activeTab === 'SUITES' && (s.title || "").toLowerCase().includes("suite")) ||
        (!s.categories && activeTab === 'ROOMS' && !(s.title || "").toLowerCase().includes("suite"))
      );

  const displaySuites = filteredSubmodules.filter((s: any) => (s.title || "").toLowerCase().includes("suite") || (s.categories && s.categories.some((c: string) => c.toLowerCase().includes("suite"))));
  const displayRooms = filteredSubmodules.filter((s: any) => !((s.title || "").toLowerCase().includes("suite") || (s.categories && s.categories.some((c: string) => c.toLowerCase().includes("suite")))));

  // Helper to pick an icon based on title
  const getRoomIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('presidential') || t.includes('executive')) return <Tv size={36} strokeWidth={1} className="text-[#C09F64]"/>;
    if (t.includes('suite')) return <Armchair size={36} strokeWidth={1} className="text-[#C09F64]"/>;
    return <Bed size={36} strokeWidth={1} className="text-[#C09F64]"/>;
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen font-sans pb-24">
      {/* Header Area */}
      <div className="relative w-full h-96 md:h-[448px] flex items-center bg-[#FAF9F6] overflow-hidden border-b border-neutral-200">
         <div className="max-w-[1122px] mx-auto w-full px-6 lg:px-8 relative z-10 flex justify-between items-center h-full">
            <div className="flex items-center gap-6 z-20">
               <div>
                  <h1 className="text-3xl sm:text-4xl md:text-[44px] break-words font-serif text-[#0F203C] mb-1 tracking-wide">{module.title || "Suites"}</h1>
                  <p className="text-neutral-600 font-sans text-sm md:text-base">{module.subtitle || "Elegance & Comfort"}</p>
               </div>
            </div>
         </div>
         {/* Right Image Background */}
         <div className="absolute right-0 top-0 h-full w-2/3 md:w-1/2 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/80 to-transparent z-10"></div>
            <img src={module.image || "https://images.unsplash.com/photo-1582719478250-c894e4dc240e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} alt={module.title || "Suites"} className="w-full h-full object-cover object-center" />
         </div>
      </div>

      <div className="max-w-[1122px] mx-auto px-4 lg:px-8 py-8 md:py-12 relative z-10">

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 md:gap-4 mb-8 pb-4">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <div 
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex-shrink-0 px-6 py-4 rounded-lg flex items-center gap-3 cursor-pointer transition-colors relative ${
                  isActive ? "bg-[#0F203C] text-white shadow-md" : "bg-[#FAF7F2] text-[#0F203C] hover:bg-[#F3EDE2]"
                }`}
              >
                {tab.icon}
                <span className="font-bold text-xs md:text-sm tracking-wider uppercase leading-tight whitespace-pre-line">
                  {tab.name.replace(' ', '\n')}
                </span>
                {isActive && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0F203C] rotate-45 shadow-sm"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Two Columns Grid */}
        <div className={`grid grid-cols-1 ${displaySuites.length > 0 && displayRooms.length > 0 ? 'md:grid-cols-2' : ''} gap-8 md:gap-12 bg-white rounded-xl shadow-sm p-6 md:p-10 border border-neutral-100`}>
          
          {displaySuites.length === 0 && displayRooms.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-12">
               <p className="text-neutral-400 text-sm italic">No rooms or suites available for this category.</p>
            </div>
          )}

          {/* SUITES COLUMN */}
          {displaySuites.length > 0 && (
          <div>
            <div className="flex items-center gap-4 border-b border-neutral-200 pb-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-[#0F203C] flex justify-center items-center shadow-inner relative">
                <Bed className="text-[#C09F64]" size={28} strokeWidth={1.5}/>
                <div className="absolute inset-1 border border-[#C09F64]/30 rounded-full pointer-events-none"></div>
              </div>
              <h2 className="text-[#0F203C] font-serif text-2xl uppercase tracking-wide">SUITES</h2>
            </div>
            <div className="space-y-8">
              {displaySuites.map((suite: any) => (
                <div key={suite.id} onClick={() => onOpenSubmodule(suite)} className="flex items-start justify-between gap-5 cursor-pointer group">
                  <div className="flex items-start gap-5 flex-1 pr-4">
                    <div className="pt-1 group-hover:scale-110 transition-transform duration-300 shrink-0">
                       {getRoomIcon(suite.title || "")}
                    </div>
                    <div>
                      <h3 className="text-[#0F203C] font-sans font-bold tracking-wide mb-1.5 uppercase text-sm group-hover:text-[#C09F64] transition-colors">{suite.title}</h3>
                      <p className="text-[#718096] text-sm leading-relaxed line-clamp-2">
                        {suite.subtitle || (suite.content ? suite.content.replace(/<[^>]*>?/gm, '').substring(0, 80) + '...' : "Spacious suite with luxurious amenities and elegant design.")}
                      </p>
                    </div>
                  </div>
                  {suite.image && (
                    <div className="w-20 h-16 md:w-24 md:h-20 shrink-0 rounded overflow-hidden shadow-sm border border-black/5">
                      <img src={suite.image} alt={suite.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          )}

          {/* ROOMS COLUMN */}
          {displayRooms.length > 0 && (
          <div>
            <div className="flex items-center gap-4 border-b border-neutral-200 pb-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-[#0F203C] flex justify-center items-center shadow-inner relative">
                <Bed className="text-[#C09F64]" size={28} strokeWidth={1.5}/>
                <div className="absolute inset-1 border border-[#C09F64]/30 rounded-full pointer-events-none"></div>
              </div>
              <h2 className="text-[#0F203C] font-serif text-2xl uppercase tracking-wide">ROOMS</h2>
            </div>
            <div className="space-y-8">
              {displayRooms.map((room: any) => (
                <div key={room.id} onClick={() => onOpenSubmodule(room)} className="flex items-start justify-between gap-5 cursor-pointer group">
                  <div className="flex items-start gap-5 flex-1 pr-4">
                    <div className="pt-1 group-hover:scale-110 transition-transform duration-300 shrink-0">
                       {getRoomIcon(room.title || "")}
                    </div>
                    <div>
                      <h3 className="text-[#0F203C] font-sans font-bold tracking-wide mb-1.5 uppercase text-sm group-hover:text-[#C09F64] transition-colors">{room.title}</h3>
                      <p className="text-[#718096] text-sm leading-relaxed line-clamp-2">
                         {room.subtitle || (room.content ? room.content.replace(/<[^>]*>?/gm, '').substring(0, 80) + '...' : "Comfortable room with essential modern facilities.")}
                      </p>
                    </div>
                  </div>
                  {room.image && (
                    <div className="w-20 h-16 md:w-24 md:h-20 shrink-0 rounded overflow-hidden shadow-sm border border-black/5">
                      <img src={room.image} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          )}

        </div>

        {/* Room Features */}
        <div className="mt-8 bg-[#FDFDFB] border border-neutral-200 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-8 border-b border-neutral-200 pb-4">
            <div className="w-12 h-12 rounded-full bg-[#0F203C] flex justify-center items-center relative">
              <Star className="text-[#C09F64]" size={24} strokeWidth={1.5}/>
              <div className="absolute inset-[3px] border border-[#C09F64]/30 rounded-full pointer-events-none"></div>
            </div>
            <h3 className="text-[#0F203C] font-sans font-bold tracking-wide uppercase text-[15px]">ROOM FEATURES</h3>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-6 md:gap-4 text-center">
             <div className="flex flex-col items-center gap-3">
               <Wifi className="text-[#C09F64]" size={32} strokeWidth={1.5} />
               <span className="text-[11px] md:text-xs text-[#0F203C] font-bold uppercase tracking-wider">Free Wi-Fi</span>
             </div>
             <div className="flex flex-col items-center gap-3">
               <Tv className="text-[#C09F64]" size={32} strokeWidth={1.5} />
               <span className="text-[11px] md:text-xs text-[#0F203C] font-bold uppercase tracking-wider">Smart TV</span>
             </div>
             <div className="flex flex-col items-center gap-3">
               <Snowflake className="text-[#C09F64]" size={32} strokeWidth={1.5} />
               <span className="text-[11px] md:text-xs text-[#0F203C] font-bold uppercase tracking-wider">Air<br/>Conditioning</span>
             </div>
             <div className="flex flex-col items-center gap-3">
               <Refrigerator className="text-[#C09F64]" size={32} strokeWidth={1.5} />
               <span className="text-[11px] md:text-xs text-[#0F203C] font-bold uppercase tracking-wider">Mini Bar</span>
             </div>
             <div className="flex flex-col items-center gap-3">
               <Shield className="text-[#C09F64]" size={32} strokeWidth={1.5} />
               <span className="text-[11px] md:text-xs text-[#0F203C] font-bold uppercase tracking-wider">In-Room<br/>Safe</span>
             </div>
             <div className="flex flex-col items-center gap-3">
               <Coffee className="text-[#C09F64]" size={32} strokeWidth={1.5} />
               <span className="text-[11px] md:text-xs text-[#0F203C] font-bold uppercase tracking-wider">Coffee<br/>Machine</span>
             </div>
             <div className="flex flex-col items-center gap-3">
               <Droplets className="text-[#C09F64]" size={32} strokeWidth={1.5} />
               <span className="text-[11px] md:text-xs text-[#0F203C] font-bold uppercase tracking-wider">Luxury<br/>Toiletries</span>
             </div>
          </div>
        </div>

        {/* Please Note Box */}
        <div className="mt-4 bg-[#FDFDFB] border border-neutral-200 rounded-xl p-5 md:p-6 flex items-start md:items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full border-[1.5px] border-[#C09F64] text-[#C09F64] flex justify-center items-center shrink-0">
            <Info size={20} strokeWidth={2}/>
          </div>
          <div>
            <h4 className="text-[#0F203C] font-bold text-xs uppercase tracking-wider mb-1">PLEASE NOTE</h4>
            <p className="text-sm text-[#4A5568] leading-relaxed">
              Room availability and features may vary by room type and season. <br className="hidden md:block"/>
              Contact our concierge for special requests and arrangements.
            </p>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-8 space-y-3">
          <div className="bg-[#0F203C] rounded-lg p-5 flex justify-between items-center text-white cursor-pointer hover:bg-[#1a365d] transition-colors shadow-md">
             <div className="flex items-center gap-4">
               <Utensils className="text-[#C09F64]" size={24} strokeWidth={1.5}/>
               <span className="font-sans font-bold text-sm tracking-wider uppercase">DINING & BARS</span>
             </div>
             <ChevronRight size={20} className="text-[#C09F64]"/>
          </div>
          <div className="bg-[#0F203C] rounded-lg p-5 flex justify-between items-center text-white cursor-pointer hover:bg-[#1a365d] transition-colors shadow-md">
             <div className="flex items-center gap-4">
               <Sparkles className="text-[#C09F64]" size={24} strokeWidth={1.5}/>
               <span className="font-sans font-bold text-sm tracking-wider uppercase">WELLNESS & RELAXATION</span>
             </div>
             <ChevronRight size={20} className="text-[#C09F64]"/>
          </div>
          <div className="bg-[#0F203C] rounded-lg p-5 flex justify-between items-center text-white cursor-pointer hover:bg-[#1a365d] transition-colors shadow-md">
             <div className="flex items-center gap-4">
               <MapPin className="text-[#C09F64]" size={24} strokeWidth={1.5}/>
               <span className="font-sans font-bold text-sm tracking-wider uppercase">HOTEL INFORMATION</span>
             </div>
             <ChevronRight size={20} className="text-[#C09F64]"/>
          </div>
        </div>

      </div>
    </div>
  );
}
