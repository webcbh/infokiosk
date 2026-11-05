import React, { useState } from 'react';
import { Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function SpaEditor({ 
  module, 
  editingHotel, 
  editingMainModuleIdx, 
  saveHotelContent,
  ImageUpload
}: { 
  module: any, 
  editingHotel: any, 
  editingMainModuleIdx: number, 
  saveHotelContent: any,
  ImageUpload: any
}) {
  const updateModule = (key: string, value: any) => {
    const newModules = [...editingHotel.content.modules];
    newModules[editingMainModuleIdx][key] = value;
    saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
  };

  const defaultFeatures = [
    { icon: "flower", title: "UNPARALLELED TREATMENTS", description: "Our spa treatments are unparalleled, offering you the luxury of a private space and creating a sense of eternal calm." },
    { icon: "droplet", title: "RELIEVE & REJUVENATE", description: "Pamper yourself to satisfy your senses, relieve your body of any tension, and rejuvenate your mind." },
    { icon: "box", title: "ULTIMATE RELAXATION", description: "With a total area of 800 square meters, the renovated Elixir Spa will offer the ultimate atmosphere and relaxation to all its guests." }
  ];

  const defaultFacilities = [
    { icon: "hand", title: "Relaxing and Therapeutic Massages" },
    { icon: "users", title: "Couples Treatments" },
    { icon: "spray", title: "Body Treatments" },
    { icon: "wind", title: "Aromatherapy" },
    { icon: "waves", title: "Thalassotherapy" },
    { icon: "dumbbell", title: "Sports Massages" },
    { icon: "flower", title: "Elixir Spa Signature Treatments" },
    { icon: "bed", title: "Elixir Couples Suites" },
    { icon: "sparkles", title: "Steam Bath 2 (one of which for nudists)" },
    { icon: "door", title: "Sauna 2 (one of which for nudists)" },
    { icon: "sofa", title: "Relaxation Area" },
    { icon: "gift", title: "Couples Packages" },
    { icon: "heart", title: "Wedding Packages" },
    { icon: "heart", title: "Honeymoon Packages" },
    { icon: "gift", title: "Spa Packages" },
    { icon: "scissors", title: "Unisex Hair Salon" },
    { icon: "dumbbell", title: "Gym Centre with cardio and strength training equipment" },
    { icon: "activity", title: "Wellness Activities" }
  ];

  const defaultStandout = {
    icon: "door",
    title: "A STANDOUT FEATURE",
    description: "With relaxation rooms, including 2 suites for couples, 2 saunas, 2 steam baths, a spacious and modern gym, and an indoor pool, to name just a few, the Elixir Spa will prove to be one of the hotel's standout features."
  };

  const defaultBooking = {
    icon: "phone",
    title: "FOR BOOKINGS",
    description: "Please contact Elixir Spa or Reception.",
    buttonText: "CONTACT NOW",
    buttonUrl: "#"
  };

  const defaultLinks = [
    { icon: "calendar", title: "DAILY PROGRAM & ACTIVITIES", url: "#" },
    { icon: "flower", title: "WELLNESS & FITNESS", url: "#" },
    { icon: "info", title: "IMPORTANT INFORMATION", url: "#" }
  ];

  const features = module.spaFeatures || defaultFeatures;
  const standoutFeature = module.spaStandoutFeature || defaultStandout;
  const booking = module.spaBooking || defaultBooking;
  const spaHeroImages = module.spaHeroImages || [module.spaHeroImage || "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-neutral-100 mb-8">
      <div className="col-span-1 md:col-span-2">
        <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-4 text-left">
          Spa Layout Configuration
        </label>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Top Bar Title</label>
          <input type="text" value={module.spaTopBarTitle || "ELIXIR SPA"} onChange={(e) => updateModule('spaTopBarTitle', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Header Title</label>
          <input type="text" value={module.spaHeaderTitle || "ELIXIR SPA"} onChange={(e) => updateModule('spaHeaderTitle', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Header Subtitle (Rich Text)</label>
          <div className="bg-white rounded border border-neutral-300">
            <ReactQuill theme="snow" value={module.spaHeaderSubtitle || "A sanctuary of relaxation and rejuvenation"} onChange={(val) => updateModule('spaHeaderSubtitle', val)} />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 bg-neutral-50 p-2 rounded border border-neutral-200">
          <label className="block text-xs text-neutral-600 font-medium">Background Color</label>
          <input type="color" value={module.spaBgColor || "#ffffff"} onChange={(e) => updateModule('spaBgColor', e.target.value)} className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
        </div>
        <div className="flex items-center justify-between gap-4 bg-neutral-50 p-2 rounded border border-neutral-200">
          <label className="block text-xs text-neutral-600 font-medium">Primary Color</label>
          <input type="color" value={module.spaPrimaryColor || "#0f274c"} onChange={(e) => updateModule('spaPrimaryColor', e.target.value)} className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
        </div>
        <div className="flex items-center justify-between gap-4 bg-neutral-50 p-2 rounded border border-neutral-200">
          <label className="block text-xs text-neutral-600 font-medium">Accent Color</label>
          <input type="color" value={module.spaAccentColor || "#d4af37"} onChange={(e) => updateModule('spaAccentColor', e.target.value)} className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Font Family</label>
             <select value={module.spaFontFamily || "sans"} onChange={(e) => updateModule('spaFontFamily', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm">
                <option value="sans">Sans Serif</option>
                <option value="serif">Serif</option>
             </select>
          </div>
          <div>
             <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Base Text Size</label>
             <select value={module.spaTextSize || "base"} onChange={(e) => updateModule('spaTextSize', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm">
                <option value="sm">Small</option>
                <option value="base">Medium</option>
                <option value="lg">Large</option>
             </select>
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 mt-4 space-y-4">
        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">Hero Images Gallery</label>
          <div className="space-y-4">
            {spaHeroImages.map((img: string, idx: number) => (
              <div key={idx} className="flex gap-2 items-end bg-neutral-50 p-2 rounded border border-neutral-200">
                <div className="flex-1">
                  <ImageUpload
                    label={`Image ${idx + 1}`}
                    value={img}
                    onChange={(val: string) => {
                      const newImages = [...spaHeroImages];
                      newImages[idx] = val;
                      updateModule('spaHeroImages', newImages);
                    }}
                  />
                </div>
                <button
                  onClick={() => {
                    const newImages = spaHeroImages.filter((_: any, i: number) => i !== idx);
                    updateModule('spaHeroImages', newImages);
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                updateModule('spaHeroImages', [...spaHeroImages, ""]);
              }}
              className="flex items-center gap-2 text-sm text-blue-600 font-semibold py-2"
            >
              <Plus size={16} /> Add Hero Image
            </button>
          </div>
        </div>

        <div className="border border-neutral-200 rounded p-4">
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-4">Features (3 items)</label>
          {features.map((feature: any, idx: number) => (
            <div key={idx} className="mb-6 pb-6 border-b border-neutral-100 last:border-0 last:mb-0 last:pb-0">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Icon Name</label>
                  <input type="text" value={feature.icon} onChange={(e) => {
                    const newFeatures = [...features];
                    newFeatures[idx].icon = e.target.value;
                    updateModule('spaFeatures', newFeatures);
                  }} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Title</label>
                  <input type="text" value={feature.title} onChange={(e) => {
                    const newFeatures = [...features];
                    newFeatures[idx].title = e.target.value;
                    updateModule('spaFeatures', newFeatures);
                  }} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
                </div>
              </div>
              <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Description (Rich Text)</label>
              <div className="bg-white rounded border border-neutral-300">
                <ReactQuill theme="snow" value={feature.description} onChange={(val) => {
                  const newFeatures = [...features];
                  newFeatures[idx].description = val;
                  updateModule('spaFeatures', newFeatures);
                }} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="border border-neutral-200 rounded p-4">
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-4">Standout Feature</label>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Icon Name</label>
              <input type="text" value={standoutFeature.icon} onChange={(e) => {
                updateModule('spaStandoutFeature', { ...standoutFeature, icon: e.target.value });
              }} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Title</label>
              <input type="text" value={standoutFeature.title} onChange={(e) => {
                updateModule('spaStandoutFeature', { ...standoutFeature, title: e.target.value });
              }} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
            </div>
          </div>
          <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Description (Rich Text)</label>
          <div className="bg-white rounded border border-neutral-300">
            <ReactQuill theme="snow" value={standoutFeature.description} onChange={(val) => {
              updateModule('spaStandoutFeature', { ...standoutFeature, description: val });
            }} />
          </div>
        </div>

        <div className="border border-neutral-200 rounded p-4">
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-4">Facilities Configuration (JSON format)</label>
          <div className="mb-2">
            <label className="block text-xs text-neutral-500 mb-1">Facilities Title</label>
            <input type="text" value={module.spaFacilitiesTitle || "FACILITIES & AMENITIES"} onChange={(e) => updateModule('spaFacilitiesTitle', e.target.value)} className="w-full md:w-1/2 border border-neutral-300 rounded px-2 py-1.5 text-sm" />
          </div>
          <textarea
            defaultValue={JSON.stringify(module.spaFacilities || defaultFacilities, null, 2)}
            onBlur={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                updateModule('spaFacilities', parsed);
              } catch (err) {
                alert("Invalid JSON format for Facilities");
              }
            }}
            className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono min-h-[200px]"
          />
        </div>

        <div className="border border-neutral-200 rounded p-4">
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-4">Booking Section</label>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Icon Name</label>
              <input type="text" value={booking.icon} onChange={(e) => {
                updateModule('spaBooking', { ...booking, icon: e.target.value });
              }} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Title</label>
              <input type="text" value={booking.title} onChange={(e) => {
                updateModule('spaBooking', { ...booking, title: e.target.value });
              }} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Button Text</label>
              <input type="text" value={booking.buttonText} onChange={(e) => {
                updateModule('spaBooking', { ...booking, buttonText: e.target.value });
              }} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Button URL</label>
              <input type="text" value={booking.buttonUrl} onChange={(e) => {
                updateModule('spaBooking', { ...booking, buttonUrl: e.target.value });
              }} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
            </div>
          </div>
          <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Description (Rich Text)</label>
          <div className="bg-white rounded border border-neutral-300">
            <ReactQuill theme="snow" value={booking.description} onChange={(val) => {
              updateModule('spaBooking', { ...booking, description: val });
            }} />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">Bottom Links Configuration (JSON format)</label>
          <textarea
            defaultValue={JSON.stringify(module.spaLinks || defaultLinks, null, 2)}
            onBlur={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                updateModule('spaLinks', parsed);
              } catch (err) {
                alert("Invalid JSON format for Links");
              }
            }}
            className="w-full border border-neutral-300 rounded px-3 py-2 text-xs font-mono min-h-[150px]"
          />
        </div>
      </div>
    </div>
  );
}
