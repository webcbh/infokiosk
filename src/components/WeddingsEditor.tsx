import React, { useState } from 'react';
import { Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function WeddingsEditor({ 
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
  const [expandedService, setExpandedService] = useState<number | null>(null);

  const updateModule = (key: string, value: any) => {
    const newModules = [...editingHotel.content.modules];
    newModules[editingMainModuleIdx][key] = value;
    saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
  };

  const defaultServices = [
    {
      id: "ceremony",
      title: "WEDDING CEREMONY",
      description: "From your initial enquiry we are here to help with choosing the perfect setting, the theme for your wedding.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: "heart"
    },
    {
      id: "venues",
      title: "WEDDING VENUES",
      description: "Discover a variety of stunning venues, from beachfront locations to elegant indoor spaces.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: "home"
    },
    {
      id: "reception",
      title: "WEDDING RECEPTION",
      description: "Celebrate with exquisite dining, entertainment, and unforgettable moments.",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: "wine"
    },
    {
      id: "package",
      title: "WEDDING PACKAGE",
      description: "Choose from our thoughtfully curated packages designed to make your day seamless and memorable.",
      image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: "gift"
    },
    {
      id: "extras",
      title: "WEDDING EXTRAS",
      description: "Add those special touches that make your wedding uniquely yours.",
      image: "https://images.unsplash.com/photo-1522030995166-5e5d31405e32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: "flower"
    }
  ];

  const defaultLinks = [
    { icon: "user", title: "MEET OUR WEDDING SPECIALIST", url: "#" },
    { icon: "calendar", title: "WEDDING SHOWCASE & EVENTS", url: "#" },
    { icon: "map-pin", title: "HOTEL INFORMATION", url: "#" }
  ];

  const services = module.weddingsServices || defaultServices;
  const links = module.weddingsLinks || defaultLinks;

  const updateService = (idx: number, field: string, value: any) => {
    const newServices = [...services];
    newServices[idx][field] = value;
    updateModule('weddingsServices', newServices);
  };

  const addService = () => {
    updateModule('weddingsServices', [...services, {
      id: `service_${Date.now()}`,
      title: "NEW SERVICE",
      description: "Description here",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: "heart"
    }]);
    setExpandedService(services.length);
  };

  const removeService = (idx: number) => {
    if(confirm("Remove this service?")) {
      const newServices = [...services];
      newServices.splice(idx, 1);
      updateModule('weddingsServices', newServices);
      setExpandedService(null);
    }
  };

  const updateLink = (idx: number, field: string, value: any) => {
    const newLinks = [...links];
    newLinks[idx][field] = value;
    updateModule('weddingsLinks', newLinks);
  };

  const addLink = () => {
    updateModule('weddingsLinks', [...links, { icon: "info", title: "New Link", url: "#" }]);
  };

  const removeLink = (idx: number) => {
    const newLinks = [...links];
    newLinks.splice(idx, 1);
    updateModule('weddingsLinks', newLinks);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-neutral-100 mb-8">
      <div className="col-span-1 md:col-span-2">
        <label className="block text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-4 text-left">
          Weddings Layout Configuration
        </label>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Top Bar Title</label>
          <input type="text" value={module.weddingsTopBarTitle || "WEDDINGS"} onChange={(e) => updateModule('weddingsTopBarTitle', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Header Title</label>
          <input type="text" value={module.weddingsHeaderTitle || "WEDDINGS"} onChange={(e) => updateModule('weddingsHeaderTitle', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Header Subtitle (Rich Text)</label>
          <div className="bg-white rounded border border-neutral-300">
            <ReactQuill theme="snow" value={module.weddingsHeaderSubtitle || "Let us make your special day truly unforgettable.<br/>Explore our wedding services and create memories that last a lifetime."} onChange={(val) => updateModule('weddingsHeaderSubtitle', val)} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 bg-neutral-50 p-2 rounded border border-neutral-200">
          <label className="block text-xs text-neutral-600 font-medium">Background Color</label>
          <input type="color" value={module.weddingsBgColor || "#ffffff"} onChange={(e) => updateModule('weddingsBgColor', e.target.value)} className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
        </div>
        <div className="flex items-center justify-between gap-4 bg-neutral-50 p-2 rounded border border-neutral-200">
          <label className="block text-xs text-neutral-600 font-medium">Primary Color</label>
          <input type="color" value={module.weddingsPrimaryColor || "#0f274c"} onChange={(e) => updateModule('weddingsPrimaryColor', e.target.value)} className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
        </div>
        <div className="flex items-center justify-between gap-4 bg-neutral-50 p-2 rounded border border-neutral-200">
          <label className="block text-xs text-neutral-600 font-medium">Accent Color</label>
          <input type="color" value={module.weddingsAccentColor || "#d4af37"} onChange={(e) => updateModule('weddingsAccentColor', e.target.value)} className="w-10 h-10 p-0 border-0 rounded cursor-pointer" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Font Family</label>
             <select value={module.weddingsFontFamily || "sans"} onChange={(e) => updateModule('weddingsFontFamily', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm">
                <option value="sans">Sans Serif</option>
                <option value="serif">Serif</option>
             </select>
          </div>
          <div>
             <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Base Text Size</label>
             <select value={module.weddingsTextSize || "base"} onChange={(e) => updateModule('weddingsTextSize', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm">
                <option value="sm">Small</option>
                <option value="base">Medium</option>
                <option value="lg">Large</option>
             </select>
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 mt-4 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
           <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide">Services List</label>
           <button onClick={addService} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800">
             <Plus size={14} /> Add Service
           </button>
        </div>
        <div className="space-y-4">
          {services.map((service: any, idx: number) => (
            <div key={idx} className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
              <div 
                className="flex items-center justify-between p-3 bg-neutral-50 cursor-pointer hover:bg-neutral-100"
                onClick={() => setExpandedService(expandedService === idx ? null : idx)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-neutral-700">{service.title || 'Unnamed Service'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); removeService(idx); }} className="text-red-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                  {expandedService === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {expandedService === idx && (
                <div className="p-4 border-t border-neutral-200 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-1 uppercase">Title</label>
                      <input type="text" value={service.title} onChange={(e) => updateService(idx, 'title', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-1 uppercase">Icon Name</label>
                      <select value={service.icon} onChange={(e) => updateService(idx, 'icon', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm">
                        <option value="heart">Heart</option>
                        <option value="home">Home (Venues)</option>
                        <option value="wine">Wine (Reception)</option>
                        <option value="gift">Gift (Package)</option>
                        <option value="flower">Flower (Extras)</option>
                        <option value="camera">Camera</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <ImageUpload
                      label="Service Image"
                      value={service.image}
                      onChange={(val: string) => updateService(idx, 'image', val)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-1 uppercase">Description (Rich Text)</label>
                    <div className="bg-white rounded border border-neutral-300">
                      <ReactQuill theme="snow" value={service.description} onChange={(val) => updateService(idx, 'description', val)} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border border-neutral-200 rounded p-4">
          <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide mb-4">Note Box</label>
          <div className="mb-4">
            <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Title</label>
            <input type="text" value={module.weddingsNoteTitle || "PLEASE NOTE"} onChange={(e) => updateModule('weddingsNoteTitle', e.target.value)} className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1 font-bold uppercase tracking-wide">Description (Rich Text)</label>
            <div className="bg-white rounded border border-neutral-300">
              <ReactQuill theme="snow" value={module.weddingsNoteDescription || "Availability is subject to the date and venue.<br/>Contact our wedding specialist for a personalized consultation and to start planning your dream day."} onChange={(val) => updateModule('weddingsNoteDescription', val)} />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between border-b pb-2 mb-4">
             <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wide">Bottom Links</label>
             <button onClick={addLink} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800">
               <Plus size={14} /> Add Link
             </button>
          </div>
          <div className="space-y-3">
             {links.map((link: any, idx: number) => (
                <div key={idx} className="flex flex-col md:flex-row items-center gap-3 p-3 bg-neutral-50 rounded border border-neutral-200">
                   <select value={link.icon} onChange={(e) => updateLink(idx, 'icon', e.target.value)} className="w-full md:w-32 border border-neutral-300 rounded px-2 py-1.5 text-xs">
                      <option value="user">User</option>
                      <option value="calendar">Calendar</option>
                      <option value="map-pin">Map Pin</option>
                      <option value="info">Info</option>
                   </select>
                   <input type="text" placeholder="Title" value={link.title} onChange={(e) => updateLink(idx, 'title', e.target.value)} className="flex-1 w-full border border-neutral-300 rounded px-2 py-1.5 text-sm" />
                   <input type="text" placeholder="URL" value={link.url} onChange={(e) => updateLink(idx, 'url', e.target.value)} className="flex-1 w-full border border-neutral-300 rounded px-2 py-1.5 text-sm font-mono text-blue-600" />
                   <button onClick={() => removeLink(idx)} className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50">
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
