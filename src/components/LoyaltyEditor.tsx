import React, { useState } from 'react';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';

export default function LoyaltyEditor({ 
  module, 
  editingHotel, 
  editingMainModuleIdx, 
  saveHotelContent 
}: { 
  module: any, 
  editingHotel: any, 
  editingMainModuleIdx: number, 
  saveHotelContent: any 
}) {
  const [expandedTier, setExpandedTier] = useState<number | null>(null);

  const updateModule = (key: string, value: any) => {
    const newModules = [...editingHotel.content.modules];
    newModules[editingMainModuleIdx][key] = value;
    saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
  };

  const defaultTiers = [
    {
      id: "blue", name: "BLUE MEMBER", stays: "2-10 STAYS", description: "Become a Blue member after staying just once at any one of our hotels and receive the following benefits on your second visit:", color: "#0f274c",
      benefits: [
        { icon: "tag", title: "15% DISCOUNT", subtitle: "on the accommodation rate.", description: "The reward will be valid from the 2nd stay onwards. Only for repeat customers of the hotels." },
        { icon: "utensils", title: "15% DISCOUNT", subtitle: "on all extra food and beverages taken in any of the hotel restaurants and bars during your stay *" },
        { icon: "scissors", title: "15% DISCOUNT", subtitle: "in the hotel hairdressing salon *" },
        { icon: "sparkles", title: "15% DISCOUNT", subtitle: "in the hotel's Elixir Spa *" },
        { icon: "apple", title: "FRUIT", subtitle: "on arrival" },
        { icon: "wine", title: "WINE", subtitle: "on arrival" },
        { icon: "gift", title: "SPECIAL GIFT", subtitle: "on departure" },
        { icon: "door", title: "COMPLIMENTARY COURTESY ROOM", subtitle: "after check out for a couple of hours (subject to availability)" }
      ]
    },
    {
      id: "silver", name: "SILVER MEMBER", stays: "11+ STAYS", description: "Become a Silver member from your 11th visit to any one of our hotels and receive the following benefits:", color: "#6c7a89",
      benefits: [
        { icon: "tag", title: "15% DISCOUNT", subtitle: "on the accommodation rate.", description: "The reward will be valid from the 2nd stay onwards. Only for repeat customers of the hotels." },
        { icon: "utensils", title: "20% DISCOUNT", subtitle: "on all extra food and beverages taken in any of the hotel restaurants and bars during your stay *" },
        { icon: "scissors", title: "20% DISCOUNT", subtitle: "in the hotel hairdressing salon *" },
        { icon: "sparkles", title: "20% DISCOUNT", subtitle: "in the hotel's Elixir Spa *" },
        { icon: "apple", title: "FRUIT", subtitle: "on arrival" },
        { icon: "wine", title: "WINE", subtitle: "on arrival" },
        { icon: "gift", title: "SPECIAL GIFT", subtitle: "on departure" },
        { icon: "door", title: "COMPLIMENTARY COURTESY ROOM", subtitle: "after check out until departure time (subject to availability)" }
      ]
    }
  ];

  const defaultLinks = [
    { icon: "user", title: "VIEW MY LOYALTY STATUS", url: "#" },
    { icon: "calendar", title: "MY BOOKINGS", url: "#" },
    { icon: "info", title: "LOYALTY PROGRAM TERMS & CONDITIONS", url: "#" }
  ];

  const tiers = module.loyaltyTiers || defaultTiers;
  const links = module.loyaltyLinks || defaultLinks;

  const updateTier = (tierIdx: number, field: string, value: any) => {
    const newTiers = [...tiers];
    newTiers[tierIdx][field] = value;
    updateModule('loyaltyTiers', newTiers);
  };

  const updateBenefit = (tierIdx: number, benefitIdx: number, field: string, value: string) => {
    const newTiers = [...tiers];
    newTiers[tierIdx].benefits[benefitIdx][field] = value;
    updateModule('loyaltyTiers', newTiers);
  };

  const addBenefit = (tierIdx: number) => {
    const newTiers = [...tiers];
    newTiers[tierIdx].benefits.push({ icon: "star", title: "New Benefit", subtitle: "", description: "" });
    updateModule('loyaltyTiers', newTiers);
  };

  const removeBenefit = (tierIdx: number, benefitIdx: number) => {
    const newTiers = [...tiers];
    newTiers[tierIdx].benefits.splice(benefitIdx, 1);
    updateModule('loyaltyTiers', newTiers);
  };

  const addTier = () => {
    const newTiers = [...tiers];
    newTiers.push({ id: `tier_${Date.now()}`, name: "NEW TIER", stays: "0 STAYS", description: "", color: "#000000", benefits: [] });
    updateModule('loyaltyTiers', newTiers);
    setExpandedTier(newTiers.length - 1);
  };

  const removeTier = (tierIdx: number) => {
    if (confirm("Are you sure you want to remove this tier?")) {
      const newTiers = [...tiers];
      newTiers.splice(tierIdx, 1);
      updateModule('loyaltyTiers', newTiers);
      setExpandedTier(null);
    }
  };

  const updateLink = (linkIdx: number, field: string, value: string) => {
    const newLinks = [...links];
    newLinks[linkIdx][field] = value;
    updateModule('loyaltyLinks', newLinks);
  };

  const addLink = () => {
    const newLinks = [...links];
    newLinks.push({ icon: "info", title: "New Link", url: "#" });
    updateModule('loyaltyLinks', newLinks);
  };

  const removeLink = (linkIdx: number) => {
    const newLinks = [...links];
    newLinks.splice(linkIdx, 1);
    updateModule('loyaltyLinks', newLinks);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-neutral-100 mb-8">
      <div className="col-span-1 md:col-span-2">
        <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-4 text-left">
          Loyalty Club Configuration
        </label>
      </div>
      <div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Top Bar Title</label>
            <input type="text" value={module.loyaltyTopBarTitle || "GUESTS LOYALTY CLUB"} onChange={(e) => updateModule('loyaltyTopBarTitle', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Header Title</label>
            <input type="text" value={module.loyaltyHeaderTitle || "GUESTS LOYALTY CLUB"} onChange={(e) => updateModule('loyaltyHeaderTitle', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Header Subtitle</label>
            <textarea value={module.loyaltyHeaderSubtitle || "The more you stay, the more you enjoy.\nJoin our loyalty club and unlock exclusive benefits on every stay."} onChange={(e) => updateModule('loyaltyHeaderSubtitle', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm min-h-[80px]" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 bg-neutral-50 p-2 rounded border border-neutral-200">
          <label className="block text-xs text-neutral-600 font-medium">Background Color</label>
          <input type="color" value={module.loyaltyBgColor || "#f4f6f8"} onChange={(e) => updateModule('loyaltyBgColor', e.target.value)} className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
        </div>
        <div className="flex items-center justify-between gap-4 bg-neutral-50 p-2 rounded border border-neutral-200">
          <label className="block text-xs text-neutral-600 font-medium">Primary Color (Cards, Top Bar)</label>
          <input type="color" value={module.loyaltyPrimaryColor || "#0f274c"} onChange={(e) => updateModule('loyaltyPrimaryColor', e.target.value)} className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
        </div>
        <div className="flex items-center justify-between gap-4 bg-neutral-50 p-2 rounded border border-neutral-200">
          <label className="block text-xs text-neutral-600 font-medium">Accent Color (Gold details)</label>
          <input type="color" value={module.loyaltyAccentColor || "#d4af37"} onChange={(e) => updateModule('loyaltyAccentColor', e.target.value)} className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Font Family</label>
             <select value={module.loyaltyFontFamily || "sans"} onChange={(e) => updateModule('loyaltyFontFamily', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm">
                <option value="sans">Sans Serif</option>
                <option value="serif">Serif</option>
             </select>
          </div>
          <div>
             <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Base Text Size</label>
             <select value={module.loyaltyTextSize || "base"} onChange={(e) => updateModule('loyaltyTextSize', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm">
                <option value="sm">Small</option>
                <option value="base">Medium</option>
                <option value="lg">Large</option>
             </select>
          </div>
        </div>
      </div>
      
      <div className="col-span-1 md:col-span-2 mt-4 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
           <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide">Tiers Configuration</label>
           <button onClick={addTier} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800">
             <Plus size={14} /> Add Tier
           </button>
        </div>
        <div className="space-y-4">
          {tiers.map((tier: any, tierIdx: number) => (
             <div key={tierIdx} className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
                <div 
                  className="flex items-center justify-between p-3 bg-neutral-50 cursor-pointer hover:bg-neutral-100"
                  onClick={() => setExpandedTier(expandedTier === tierIdx ? null : tierIdx)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-neutral-300" style={{ backgroundColor: tier.color }}></div>
                    <span className="text-sm font-bold text-neutral-700">{tier.name || 'Unnamed Tier'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={(e) => { e.stopPropagation(); removeTier(tierIdx); }} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                    {expandedTier === tierIdx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>

                {expandedTier === tierIdx && (
                  <div className="p-4 border-t border-neutral-200 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       <div className="col-span-2">
                          <label className="block text-[10px] text-neutral-500 mb-1 uppercase">Tier Name</label>
                          <input type="text" value={tier.name} onChange={(e) => updateTier(tierIdx, 'name', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
                       </div>
                       <div className="col-span-1">
                          <label className="block text-[10px] text-neutral-500 mb-1 uppercase">Stays Label</label>
                          <input type="text" value={tier.stays} onChange={(e) => updateTier(tierIdx, 'stays', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
                       </div>
                       <div className="col-span-1">
                          <label className="block text-[10px] text-neutral-500 mb-1 uppercase">Sidebar Color</label>
                          <input type="color" value={tier.color || "#000000"} onChange={(e) => updateTier(tierIdx, 'color', e.target.value)} className="w-full h-8 p-0 border-0 rounded cursor-pointer" />
                       </div>
                       <div className="col-span-2 md:col-span-4">
                          <label className="block text-[10px] text-neutral-500 mb-1 uppercase">Description</label>
                          <textarea value={tier.description} onChange={(e) => updateTier(tierIdx, 'description', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm min-h-[60px]" />
                       </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                         <h4 className="text-xs font-bold text-neutral-600 uppercase">Benefits</h4>
                         <button onClick={() => addBenefit(tierIdx)} className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded">
                           <Plus size={12} /> Add Benefit
                         </button>
                      </div>
                      <div className="space-y-3">
                        {tier.benefits.map((benefit: any, benefitIdx: number) => (
                          <div key={benefitIdx} className="flex flex-col md:flex-row gap-3 items-start p-3 bg-neutral-50 rounded border border-neutral-200">
                             <div className="w-full md:w-auto shrink-0 flex gap-2 items-center">
                               <select value={benefit.icon} onChange={(e) => updateBenefit(tierIdx, benefitIdx, 'icon', e.target.value)} className="border border-neutral-300 rounded px-2 py-1.5 text-xs w-28">
                                  <option value="tag">Tag</option>
                                  <option value="utensils">Utensils</option>
                                  <option value="scissors">Scissors</option>
                                  <option value="sparkles">Sparkles</option>
                                  <option value="apple">Apple</option>
                                  <option value="wine">Wine</option>
                                  <option value="gift">Gift</option>
                                  <option value="door">Door</option>
                                  <option value="star">Star</option>
                               </select>
                             </div>
                             <div className="flex-1 space-y-2 w-full">
                               <div className="grid grid-cols-2 gap-2">
                                 <input type="text" placeholder="Title" value={benefit.title} onChange={(e) => updateBenefit(tierIdx, benefitIdx, 'title', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-xs font-bold" />
                                 <input type="text" placeholder="Subtitle" value={benefit.subtitle} onChange={(e) => updateBenefit(tierIdx, benefitIdx, 'subtitle', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-xs" />
                               </div>
                               <input type="text" placeholder="Optional description..." value={benefit.description || ""} onChange={(e) => updateBenefit(tierIdx, benefitIdx, 'description', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-xs text-neutral-500" />
                             </div>
                             <button onClick={() => removeBenefit(tierIdx, benefitIdx)} className="mt-1 md:mt-0 p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50">
                               <Trash2 size={14} />
                             </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
             </div>
          ))}
        </div>
        
        <div className="mt-8">
          <div className="flex items-center justify-between border-b pb-2 mb-4">
             <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide">Bottom Links</label>
             <button onClick={addLink} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800">
               <Plus size={14} /> Add Link
             </button>
          </div>
          <div className="space-y-3">
             {links.map((link: any, linkIdx: number) => (
                <div key={linkIdx} className="flex flex-col md:flex-row items-center gap-3 p-3 bg-neutral-50 rounded border border-neutral-200">
                   <select value={link.icon} onChange={(e) => updateLink(linkIdx, 'icon', e.target.value)} className="w-full md:w-32 border border-neutral-300 rounded px-2 py-1.5 text-xs">
                      <option value="user">User</option>
                      <option value="calendar">Calendar</option>
                      <option value="info">Info</option>
                      <option value="star">Star</option>
                   </select>
                   <input type="text" placeholder="Title" value={link.title} onChange={(e) => updateLink(linkIdx, 'title', e.target.value)} className="flex-1 w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
                   <input type="text" placeholder="URL" value={link.url} onChange={(e) => updateLink(linkIdx, 'url', e.target.value)} className="flex-1 w-full border border-neutral-300 rounded px-2 py-1.5 text-sm font-mono text-blue-600" />
                   <button onClick={() => removeLink(linkIdx)} className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50">
                     <Trash2 size={16} />
                   </button>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
