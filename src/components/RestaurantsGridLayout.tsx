import React, { useState } from 'react';
import { ChevronLeft, Utensils, Wine, Coffee, ChefHat, Info, ChevronRight, Calendar, Star, MapPin } from 'lucide-react';

export default function RestaurantsGridLayout({ module, onOpenSubmodule, onBack }: { module: any, onOpenSubmodule: (sub: any) => void, onBack: () => void }) {
  const submodules = module.submodules || [];
  
  const [activeTab, setActiveTab] = useState('ALL');

  const allCategories = Array.from(new Set(submodules.flatMap((s: any) => s.categories || []))).filter(Boolean) as string[];

  const getTabIcon = (cat: string) => {
    const t = cat.toLowerCase();
    if (t.includes('bar')) return <Wine size={24} strokeWidth={1} className="text-[#C09F64]" />;
    if (t.includes('cafe') || t.includes('coffee')) return <Coffee size={24} strokeWidth={1} className="text-[#C09F64]" />;
    return <Utensils size={24} strokeWidth={1} className="text-[#C09F64]" />;
  };

  const tabs = [
    { name: 'ALL', icon: <ChefHat size={24} strokeWidth={1} className="text-[#C09F64]" /> },
    ...allCategories.map(cat => ({
      name: cat.toUpperCase(),
      icon: getTabIcon(cat)
    }))
  ];

  if (tabs.length === 1) {
    tabs.push(
      { name: 'RESTAURANTS', icon: <Utensils size={24} strokeWidth={1} className="text-[#C09F64]" /> },
      { name: 'BARS', icon: <Wine size={24} strokeWidth={1} className="text-[#C09F64]" /> }
    );
  }

  const filteredSubmodules = activeTab === 'ALL' 
    ? submodules 
    : submodules.filter((s: any) => 
        (s.categories && s.categories.some((c: string) => c.toUpperCase() === activeTab)) ||
        (!s.categories && activeTab === 'RESTAURANTS' && (s.title || "").toLowerCase().includes("restaurant")) ||
        (!s.categories && activeTab === 'BARS' && (s.title || "").toLowerCase().includes("bar"))
      );

  const displayBars = filteredSubmodules.filter((s: any) => (s.title || "").toLowerCase().includes("bar") || (s.categories && s.categories.some((c: string) => c.toLowerCase().includes("bar"))));
  const displayRestaurants = filteredSubmodules.filter((s: any) => !((s.title || "").toLowerCase().includes("bar") || (s.categories && s.categories.some((c: string) => c.toLowerCase().includes("bar")))));

  const getListIcon = (title: string, categories: string[]) => {
    const t = title.toLowerCase();
    const c = categories.join(' ').toLowerCase();
    if (t.includes('bar') || c.includes('bar')) return <Wine size={36} strokeWidth={1} className="text-[#C09F64]"/>;
    if (t.includes('cafe') || c.includes('cafe')) return <Coffee size={36} strokeWidth={1} className="text-[#C09F64]"/>;
    return <Utensils size={36} strokeWidth={1} className="text-[#C09F64]"/>;
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen font-sans pb-24">
      {/* Header Area */}
      <div className="relative w-full h-96 md:h-[448px] flex items-center bg-[#FAF9F6] overflow-hidden border-b border-neutral-200">
         <div className="max-w-[1122px] mx-auto w-full px-6 lg:px-8 relative z-10 flex justify-between items-center h-full">
            <div className="flex items-center gap-6 z-20">
               <div>
                  <h1 className="text-3xl sm:text-4xl md:text-[44px] break-words font-serif text-[#0F203C] mb-1 tracking-wide">{module.title || "Restaurants & Bars"}</h1>
                  <p className="text-neutral-600 font-sans text-sm md:text-base">{module.subtitle || "Culinary Excellence"}</p>
               </div>
            </div>
         </div>
         {/* Right Image Background */}
         <div className="absolute right-0 top-0 h-full w-2/3 md:w-1/2 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/80 to-transparent z-10"></div>
            <img src={module.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} alt={module.title || "Dining"} className="w-full h-full object-cover object-center" />
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
        <div className={`grid grid-cols-1 ${displayRestaurants.length > 0 && displayBars.length > 0 ? 'md:grid-cols-2' : ''} gap-8 md:gap-12 bg-white rounded-xl shadow-sm p-6 md:p-10 border border-neutral-100`}>
          
          {displayRestaurants.length === 0 && displayBars.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-12">
               <p className="text-neutral-400 text-sm italic">No dining options available for this category.</p>
            </div>
          )}

          {/* RESTAURANTS COLUMN */}
          {displayRestaurants.length > 0 && (
          <div>
            <div className="flex items-center gap-4 border-b border-neutral-200 pb-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-[#0F203C] flex justify-center items-center shadow-inner relative">
                <Utensils className="text-[#C09F64]" size={28} strokeWidth={1.5}/>
                <div className="absolute inset-1 border border-[#C09F64]/30 rounded-full pointer-events-none"></div>
              </div>
              <h2 className="text-[#0F203C] font-serif text-2xl uppercase tracking-wide">RESTAURANTS</h2>
            </div>
            <div className="space-y-8">
              {displayRestaurants.map((sub: any) => (
                <div key={sub.id} onClick={() => onOpenSubmodule(sub)} className="flex items-start justify-between gap-5 cursor-pointer group">
                  <div className="flex items-start gap-5 flex-1 pr-4">
                    <div className="pt-1 group-hover:scale-110 transition-transform duration-300 shrink-0">
                       {getListIcon(sub.title || "", sub.categories || [])}
                    </div>
                    <div>
                      <h3 className="text-[#0F203C] font-sans font-bold tracking-wide mb-1.5 uppercase text-sm group-hover:text-[#C09F64] transition-colors">{sub.title}</h3>
                      <p className="text-[#718096] text-sm leading-relaxed line-clamp-2">
                        {sub.subtitle || (sub.content ? sub.content.replace(/<[^>]*>?/gm, '').substring(0, 80) + '...' : "Experience exquisite flavors and impeccable service.")}
                      </p>
                    </div>
                  </div>
                  {sub.image && (
                    <div className="w-20 h-16 md:w-24 md:h-20 shrink-0 rounded overflow-hidden shadow-sm border border-black/5">
                      <img src={sub.image} alt={sub.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          )}

          {/* BARS COLUMN */}
          {displayBars.length > 0 && (
          <div>
            <div className="flex items-center gap-4 border-b border-neutral-200 pb-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-[#0F203C] flex justify-center items-center shadow-inner relative">
                <Wine className="text-[#C09F64]" size={28} strokeWidth={1.5}/>
                <div className="absolute inset-1 border border-[#C09F64]/30 rounded-full pointer-events-none"></div>
              </div>
              <h2 className="text-[#0F203C] font-serif text-2xl uppercase tracking-wide">BARS</h2>
            </div>
            <div className="space-y-8">
              {displayBars.map((sub: any) => (
                <div key={sub.id} onClick={() => onOpenSubmodule(sub)} className="flex items-start justify-between gap-5 cursor-pointer group">
                  <div className="flex items-start gap-5 flex-1 pr-4">
                    <div className="pt-1 group-hover:scale-110 transition-transform duration-300 shrink-0">
                       {getListIcon(sub.title || "", sub.categories || [])}
                    </div>
                    <div>
                      <h3 className="text-[#0F203C] font-sans font-bold tracking-wide mb-1.5 uppercase text-sm group-hover:text-[#C09F64] transition-colors">{sub.title}</h3>
                      <p className="text-[#718096] text-sm leading-relaxed line-clamp-2">
                        {sub.subtitle || (sub.content ? sub.content.replace(/<[^>]*>?/gm, '').substring(0, 80) + '...' : "Experience exquisite flavors and impeccable service.")}
                      </p>
                    </div>
                  </div>
                  {sub.image && (
                    <div className="w-20 h-16 md:w-24 md:h-20 shrink-0 rounded overflow-hidden shadow-sm border border-black/5">
                      <img src={sub.image} alt={sub.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          )}

        </div>

                {/* Dynamic Action Button */}
        {module.button?.label && (
          <div className="mt-8">
            <div 
              className="bg-[#0F203C] rounded-lg p-5 flex justify-between items-center text-white cursor-pointer hover:bg-[#1a365d] transition-colors shadow-md"
              onClick={() => {
                if (module.button.moduleId) {
                   // how to link to a module? we don't have openModule here. we might need to use a custom event or window location.
                   // Actually we can dispatch a custom event.
                   window.dispatchEvent(new CustomEvent('openModule', { detail: module.button.moduleId }));
                } else if (module.button.url) {
                   window.open(module.button.url, '_blank');
                }
              }}
            >
               <div className="flex items-center gap-4">
                 <span className="font-sans font-bold text-sm tracking-wider uppercase">{module.button.label}</span>
               </div>
               <ChevronRight size={20} className="text-[#C09F64]"/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

