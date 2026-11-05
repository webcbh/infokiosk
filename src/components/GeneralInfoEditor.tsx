import React, { useEffect, useState } from 'react';
import { Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';

import BusRoutesEditor from "./BusRoutesEditor";

function DynamicIcon({ name, ...props }: { name: string; [key: string]: any }) {
  const [IconComp, setIconComp] = useState<any>(null);
  
  useEffect(() => {
    import('lucide-react').then((LucideIcons: any) => {
      setIconComp(() => LucideIcons[name] || LucideIcons.Info);
    });
  }, [name]);

  if (!IconComp) return <span className="w-4 h-4 inline-block bg-gray-200 animate-pulse rounded"></span>;
  return <IconComp {...props} />;
}

export default function GeneralInfoEditor({ module, editingHotel, editingMainModuleIdx, saveHotelContent, ImageUpload }: any) {
  const mod = module;
  
  useEffect(() => {
    if (!mod.generalInfoConfig) {
      const defaultConfig = {
        fontFamily: 'Inter',
        primaryColor: '#0f3866',
        secondaryColor: '#d9b673',
        backgroundColor: '#f8fafc',
        textColor: '#334155',
        header: {
          title: "GENERAL INFORMATION",
          subtitle: "Find essential information to help you plan your travel and explore with ease.",
          icon: "Info"
        },
        items: [
          {
            id: "item-1",
            image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=600",
            icon: "Bus",
            title: "BUS ROUTES",
            description: "Explore nearby destinations with ease. View bus routes, stops, and schedules."
          },
          {
            id: "item-2",
            image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=600",
            icon: "Plane",
            title: "AIRPORT INFORMATION",
            description: "Everything you need for a smooth journey. Check flights, terminals, services, and more."
          },
          {
            id: "item-3",
            image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600",
            icon: "Car",
            title: "CAR RENTALS / BIKE HIRE",
            description: "Rent a car or hire a bike and explore at your own pace."
          }
        ],
        footer: {
          icon: "MapPin",
          title: "Need assistance?",
          description: "Our concierge team is here to help you with travel, bookings, and more.",
          buttonText: "CONTACT CONCIERGE",
          buttonIcon: "Headphones"
        }
      };

      const newModules = [...editingHotel.content.modules];
      newModules[editingMainModuleIdx] = { ...mod, generalInfoConfig: defaultConfig };
      saveHotelContent({ modules: newModules });
    }
  }, [mod, editingHotel, editingMainModuleIdx, saveHotelContent]);

  const config = mod.generalInfoConfig || { items: [] };

  const updateConfig = (key: string, value: any) => {
    const newModules = [...editingHotel.content.modules];
    newModules[editingMainModuleIdx].generalInfoConfig = {
      ...newModules[editingMainModuleIdx].generalInfoConfig,
      [key]: value
    };
    saveHotelContent({ modules: newModules });
  };

  const updateHeader = (key: string, value: any) => {
    const newModules = [...editingHotel.content.modules];
    newModules[editingMainModuleIdx].generalInfoConfig = {
      ...newModules[editingMainModuleIdx].generalInfoConfig,
      header: {
        ...(newModules[editingMainModuleIdx].generalInfoConfig.header || {}),
        [key]: value
      }
    };
    saveHotelContent({ modules: newModules });
  };

  const updateFooter = (key: string, value: any) => {
    const newModules = [...editingHotel.content.modules];
    newModules[editingMainModuleIdx].generalInfoConfig = {
      ...newModules[editingMainModuleIdx].generalInfoConfig,
      footer: {
        ...(newModules[editingMainModuleIdx].generalInfoConfig.footer || {}),
        [key]: value
      }
    };
    saveHotelContent({ modules: newModules });
  };

  const addItem = () => {
    const newModules = [...editingHotel.content.modules];
    const items = newModules[editingMainModuleIdx].generalInfoConfig.items || [];
    items.push({
      id: `item-${Date.now()}`,
      title: "NEW ITEM",
      description: "Description",
      icon: "Star",
      image: ""
    });
    newModules[editingMainModuleIdx].generalInfoConfig.items = items;
    saveHotelContent({ modules: newModules });
  };

  const updateItem = (idx: number, key: string, value: any) => {
    const newModules = [...editingHotel.content.modules];
    newModules[editingMainModuleIdx].generalInfoConfig.items[idx][key] = value;
    saveHotelContent({ modules: newModules });
  };

  const removeItem = (idx: number) => {
    const newModules = [...editingHotel.content.modules];
    newModules[editingMainModuleIdx].generalInfoConfig.items.splice(idx, 1);
    saveHotelContent({ modules: newModules });
  };

  const moveItem = (idx: number, dir: number) => {
    const newModules = [...editingHotel.content.modules];
    const items = newModules[editingMainModuleIdx].generalInfoConfig.items;
    if (idx + dir < 0 || idx + dir >= items.length) return;
    const temp = items[idx];
    items[idx] = items[idx + dir];
    items[idx + dir] = temp;
    saveHotelContent({ modules: newModules });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-lg text-gray-800">General Information Settings</h3>

      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Primary Color</label>
          <div className="flex gap-2">
            <input type="color" value={config.primaryColor} onChange={(e) => updateConfig('primaryColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
            <input type="text" value={config.primaryColor} onChange={(e) => updateConfig('primaryColor', e.target.value)} className="w-full p-2 border rounded font-mono text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Secondary Color</label>
          <div className="flex gap-2">
            <input type="color" value={config.secondaryColor} onChange={(e) => updateConfig('secondaryColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
            <input type="text" value={config.secondaryColor} onChange={(e) => updateConfig('secondaryColor', e.target.value)} className="w-full p-2 border rounded font-mono text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Background Color</label>
          <div className="flex gap-2">
            <input type="color" value={config.backgroundColor} onChange={(e) => updateConfig('backgroundColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
            <input type="text" value={config.backgroundColor} onChange={(e) => updateConfig('backgroundColor', e.target.value)} className="w-full p-2 border rounded font-mono text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Text Color</label>
          <div className="flex gap-2">
            <input type="color" value={config.textColor} onChange={(e) => updateConfig('textColor', e.target.value)} className="w-10 h-10 rounded cursor-pointer" />
            <input type="text" value={config.textColor} onChange={(e) => updateConfig('textColor', e.target.value)} className="w-full p-2 border rounded font-mono text-sm" />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h4 className="font-medium text-sm text-gray-700">Header</h4>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Header Title</label>
            <input type="text" value={config.header?.title || ""} onChange={(e) => updateHeader('title', e.target.value)} className="w-full p-2 border rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Header Subtitle</label>
            <textarea value={config.header?.subtitle || ""} onChange={(e) => updateHeader('subtitle', e.target.value)} className="w-full p-2 border rounded text-sm" rows={2} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Header Icon</label>
            <input type="text" value={config.header?.icon || ""} onChange={(e) => updateHeader('icon', e.target.value)} className="w-full p-2 border rounded text-sm" />
            <p className="text-[10px] text-gray-400 mt-1">Uses lucide-react icon names (e.g. Info, MapPin)</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-medium text-sm text-gray-700">Information Cards</h4>
          <button onClick={addItem} className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm">
            <Plus size={16} /> Add Card
          </button>
        </div>

        <div className="space-y-4">
          {(config.items || []).map((item: any, idx: number) => (
            <div key={item.id || idx} className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
              <div className="flex items-center justify-between bg-gray-50 p-2 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">↑</button>
                  <button onClick={() => moveItem(idx, 1)} disabled={idx === config.items.length - 1} className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30">↓</button>
                  <span className="font-medium text-sm text-gray-700">Card {idx + 1}</span>
                </div>
                <button onClick={() => removeItem(idx)} className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                    <input type="text" value={item.title || ""} onChange={(e) => updateItem(idx, 'title', e.target.value)} className="w-full p-2 border rounded text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Icon (Lucide name)</label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
                        <DynamicIcon name={item.icon || "Star"} size={18} />
                      </div>
                      <input type="text" value={item.icon || ""} onChange={(e) => updateItem(idx, 'icon', e.target.value)} className="w-full p-2 border rounded text-sm" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <textarea value={item.description || ""} onChange={(e) => updateItem(idx, 'description', e.target.value)} className="w-full p-2 border rounded text-sm" rows={2} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Image URL</label>
                  <div className="flex gap-2 items-start">
                    {item.image && (
                      <img src={item.image} alt="" className="w-16 h-16 object-cover rounded border border-gray-200" />
                    )}
                    <div className="flex-1 space-y-2">
                      <input type="text" value={item.image || ""} onChange={(e) => updateItem(idx, 'image', e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="https://..." />
                      <div className="flex gap-2">
                        <ImageUpload 
                          onUpload={(url: string) => updateItem(idx, 'image', url)}
                          title="Upload Image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {config.items?.length === 0 && (
            <div className="text-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-gray-500 text-sm">
              No cards added yet.
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h4 className="font-medium text-sm text-gray-700">Footer Banner</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input type="text" value={config.footer?.title || ""} onChange={(e) => updateFooter('title', e.target.value)} className="w-full p-2 border rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Banner Icon</label>
            <input type="text" value={config.footer?.icon || ""} onChange={(e) => updateFooter('icon', e.target.value)} className="w-full p-2 border rounded text-sm" />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <input type="text" value={config.footer?.description || ""} onChange={(e) => updateFooter('description', e.target.value)} className="w-full p-2 border rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Button Text</label>
            <input type="text" value={config.footer?.buttonText || ""} onChange={(e) => updateFooter('buttonText', e.target.value)} className="w-full p-2 border rounded text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Button Icon</label>
            <input type="text" value={config.footer?.buttonIcon || ""} onChange={(e) => updateFooter('buttonIcon', e.target.value)} className="w-full p-2 border rounded text-sm" />
          </div>
        </div>
      </div>

      {(config.items || []).some((item: any) => item.title === "BUS ROUTES") && (
        <BusRoutesEditor config={config} updateConfig={updateConfig} />
      )}
    </div>
  );
}
