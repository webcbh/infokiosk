import React, { useEffect } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function DirectoryOfServicesEditor({ module, editingHotel, editingMainModuleIdx, saveHotelContent, ImageUpload }: any) {
  const mod = module;
  
  useEffect(() => {
    // Initialize default data if it doesn't exist
    if (!mod.directoryConfig) {
      const defaultConfig = {
        fontFamily: 'Inter',
        primaryColor: '#0f3866',
        secondaryColor: '#d9b673',
        backgroundColor: '#f8fafc',
        textColor: '#334155',
        categories: [
          {
            id: 'cat-1',
            title: 'ALL SERVICES',
            description: 'Everything you need for a comfortable and memorable stay.',
            icon: 'ConciergeBell',
            items: [
              { name: 'Hotel Policies', icon: 'FileText' },
              { name: 'Airports', icon: 'Plane' },
              { name: 'Air-Conditioning / Heating', icon: 'Snowflake' },
              { name: 'Auto Reservation', icon: 'Car' },
              { name: 'Airport Transportation', icon: 'Bus' },
              { name: 'Attractions & Bridges', icon: 'Map' },
              { name: 'Baby Cot', icon: 'Baby' },
              { name: 'Banks', icon: 'Landmark' },
              { name: 'Beverages', icon: 'Coffee' },
              { name: 'Bills', icon: 'Receipt' },
              { name: 'Bus Service', icon: 'Bus' },
              { name: 'Car Rental', icon: 'Car' },
              { name: 'Check In / Out Time', icon: 'Clock' },
              { name: 'Children\'s High Chairs', icon: 'Baby' },
              { name: 'Coffee & Tea Making Facilities', icon: 'Coffee' },
              { name: 'Credit Card Acceptance', icon: 'CreditCard' },
              { name: 'Doctoring', icon: 'Stethoscope' },
              { name: 'Driving License', icon: 'IdCard' },
              { name: 'Doctor', icon: 'Stethoscope' },
              { name: 'Dress Code', icon: 'Shirt' },
              { name: 'Electricity', icon: 'Zap' },
              { name: 'Emergencies', icon: 'Siren' },
              { name: 'Emergency Calls', icon: 'Phone' },
              { name: 'Embassies & Consulates', icon: 'Landmark' },
              
              { name: 'Entertainment', icon: 'Music' },
              { name: 'Excursions', icon: 'Map' },
              { name: 'First Aid', icon: 'PlusSquare' },
              { name: 'Flowers', icon: 'Flower2' },
              { name: 'Foreign Exchange', icon: 'DollarSign' },
              { name: 'Games', icon: 'Gamepad2' },
              { name: 'Green Donkey', icon: 'Trees' },
              { name: 'Group Arrangements', icon: 'Users' },
              { name: 'Gym', icon: 'Dumbbell' },
              { name: 'Hair Dryer', icon: 'Wind' },
              { name: 'Hair Salon', icon: 'Scissors' },
              { name: 'Housekeeping', icon: 'Broom' },
              { name: 'Internet Corner', icon: 'Globe' },
              { name: 'Keys', icon: 'Key' },
              { name: 'Kids Club', icon: 'Baby' },
              { name: 'Laundry & Dry Cleaning Services', icon: 'Shirt' },
              { name: 'Library / Books', icon: 'Book' },
              { name: 'Lifts', icon: 'ArrowUpDown' },
              { name: 'Lost & Found', icon: 'Search' },
              { name: 'Luggage', icon: 'Briefcase' },
              { name: 'Mail & Messages', icon: 'Mail' },
              { name: 'Meeting & Conference Facilities', icon: 'Users' },
              { name: 'Men\'s', icon: 'User' },
              { name: 'Mini Bar', icon: 'Wine' },
              { name: 'Mini Market', icon: 'ShoppingCart' },
              { name: 'Mirrored Sockets', icon: 'Zap' },
              
              { name: 'Mobile', icon: 'Smartphone' },
              { name: 'Parking', icon: 'ParkingCircle' },
              { name: 'Pets', icon: 'PawPrint' },
              { name: 'Pharmacy', icon: 'Pill' },
              { name: 'Photocopier', icon: 'Printer' },
              { name: 'Pool Beach Towels', icon: 'Waves' },
              { name: 'Postage Stamps', icon: 'Mail' },
              { name: 'Premium Package (Lux. All Inclusive)', icon: 'Gift' },
              { name: 'Receptions', icon: 'Bell' },
              { name: 'Religious Services', icon: 'Church' },
              { name: 'Restaurants', icon: 'Utensils' },
              { name: 'Room Service', icon: 'ConciergeBell' },
              { name: 'Safety Deposit Box', icon: 'Lock' },
              { name: 'Sauna and Steam bath', icon: 'Droplets' },
              { name: 'Security', icon: 'ShieldCheck' },
              { name: 'Smoking', icon: 'Cigarette' },
              { name: 'Spa', icon: 'Flower2' },
              { name: 'Telephone', icon: 'Phone' },
              { name: 'Television', icon: 'Tv' },
              { name: 'Trouser Press', icon: 'AlignVerticalSpaceAround' },
              { name: 'Wake-up Service', icon: 'AlarmClock' },
              { name: 'Water', icon: 'Droplet' },
              { name: 'Water Sports', icon: 'Waves' },
              { name: 'Wi-Fi', icon: 'Wifi' },
              { name: 'Wine', icon: 'Wine' }
            ]
          }
        ],
        bottomItems: [
          {
            id: 'bot-1',
            title: 'WI-FI ACCESS',
            description: 'Complimentary high-speed internet throughout the hotel.',
            icon: 'Wifi'
          },
          {
            id: 'bot-2',
            title: 'PARKING',
            description: 'Complimentary self-parking for all in-house guests.',
            icon: 'Car'
          },
          {
            id: 'bot-3',
            title: 'SHUTTLE SERVICE',
            description: 'Scheduled shuttle service available to key locations. Please inquire at the front desk.',
            icon: 'Bus'
          },
          {
            id: 'bot-4',
            title: 'NON-SMOKING HOTEL',
            description: 'For the comfort of all guests, our hotel is 100% smoke-free.',
            icon: 'CigaretteOff'
          }
        ],
        footerLeft: 'Need anything? Dial "0" to contact our front desk.',
        footerRight: 'Thank you for choosing us. We wish you a pleasant stay!'
      };
      
      const newModules = [...editingHotel.content.modules];
      newModules[editingMainModuleIdx] = { ...mod, directoryConfig: defaultConfig };
      saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
    }
  }, [mod, editingHotel, editingMainModuleIdx, saveHotelContent]);

  const config = mod.directoryConfig || { categories: [
          {
            id: 'cat-1',
            title: 'ALL SERVICES',
            description: 'Everything you need for a comfortable and memorable stay.',
            icon: 'ConciergeBell',
            items: [
              { name: 'Hotel Policies', icon: 'FileText' },
              { name: 'Airports', icon: 'Plane' },
              { name: 'Air-Conditioning / Heating', icon: 'Snowflake' },
              { name: 'Auto Reservation', icon: 'Car' },
              { name: 'Airport Transportation', icon: 'Bus' },
              { name: 'Attractions & Bridges', icon: 'Map' },
              { name: 'Baby Cot', icon: 'Baby' },
              { name: 'Banks', icon: 'Landmark' },
              { name: 'Beverages', icon: 'Coffee' },
              { name: 'Bills', icon: 'Receipt' },
              { name: 'Bus Service', icon: 'Bus' },
              { name: 'Car Rental', icon: 'Car' },
              { name: 'Check In / Out Time', icon: 'Clock' },
              { name: 'Children\'s High Chairs', icon: 'Baby' },
              { name: 'Coffee & Tea Making Facilities', icon: 'Coffee' },
              { name: 'Credit Card Acceptance', icon: 'CreditCard' },
              { name: 'Doctoring', icon: 'Stethoscope' },
              { name: 'Driving License', icon: 'IdCard' },
              { name: 'Doctor', icon: 'Stethoscope' },
              { name: 'Dress Code', icon: 'Shirt' },
              { name: 'Electricity', icon: 'Zap' },
              { name: 'Emergencies', icon: 'Siren' },
              { name: 'Emergency Calls', icon: 'Phone' },
              { name: 'Embassies & Consulates', icon: 'Landmark' },
              
              { name: 'Entertainment', icon: 'Music' },
              { name: 'Excursions', icon: 'Map' },
              { name: 'First Aid', icon: 'PlusSquare' },
              { name: 'Flowers', icon: 'Flower2' },
              { name: 'Foreign Exchange', icon: 'DollarSign' },
              { name: 'Games', icon: 'Gamepad2' },
              { name: 'Green Donkey', icon: 'Trees' },
              { name: 'Group Arrangements', icon: 'Users' },
              { name: 'Gym', icon: 'Dumbbell' },
              { name: 'Hair Dryer', icon: 'Wind' },
              { name: 'Hair Salon', icon: 'Scissors' },
              { name: 'Housekeeping', icon: 'Broom' },
              { name: 'Internet Corner', icon: 'Globe' },
              { name: 'Keys', icon: 'Key' },
              { name: 'Kids Club', icon: 'Baby' },
              { name: 'Laundry & Dry Cleaning Services', icon: 'Shirt' },
              { name: 'Library / Books', icon: 'Book' },
              { name: 'Lifts', icon: 'ArrowUpDown' },
              { name: 'Lost & Found', icon: 'Search' },
              { name: 'Luggage', icon: 'Briefcase' },
              { name: 'Mail & Messages', icon: 'Mail' },
              { name: 'Meeting & Conference Facilities', icon: 'Users' },
              { name: 'Men\'s', icon: 'User' },
              { name: 'Mini Bar', icon: 'Wine' },
              { name: 'Mini Market', icon: 'ShoppingCart' },
              { name: 'Mirrored Sockets', icon: 'Zap' },
              
              { name: 'Mobile', icon: 'Smartphone' },
              { name: 'Parking', icon: 'ParkingCircle' },
              { name: 'Pets', icon: 'PawPrint' },
              { name: 'Pharmacy', icon: 'Pill' },
              { name: 'Photocopier', icon: 'Printer' },
              { name: 'Pool Beach Towels', icon: 'Waves' },
              { name: 'Postage Stamps', icon: 'Mail' },
              { name: 'Premium Package (Lux. All Inclusive)', icon: 'Gift' },
              { name: 'Receptions', icon: 'Bell' },
              { name: 'Religious Services', icon: 'Church' },
              { name: 'Restaurants', icon: 'Utensils' },
              { name: 'Room Service', icon: 'ConciergeBell' },
              { name: 'Safety Deposit Box', icon: 'Lock' },
              { name: 'Sauna and Steam bath', icon: 'Droplets' },
              { name: 'Security', icon: 'ShieldCheck' },
              { name: 'Smoking', icon: 'Cigarette' },
              { name: 'Spa', icon: 'Flower2' },
              { name: 'Telephone', icon: 'Phone' },
              { name: 'Television', icon: 'Tv' },
              { name: 'Trouser Press', icon: 'AlignVerticalSpaceAround' },
              { name: 'Wake-up Service', icon: 'AlarmClock' },
              { name: 'Water', icon: 'Droplet' },
              { name: 'Water Sports', icon: 'Waves' },
              { name: 'Wi-Fi', icon: 'Wifi' },
              { name: 'Wine', icon: 'Wine' }
            ]
          }
        ],
        bottomItems: [] };

  const updateConfig = (key: string, value: any) => {
    const newModules = [...editingHotel.content.modules];
    newModules[editingMainModuleIdx].directoryConfig = {
      ...newModules[editingMainModuleIdx].directoryConfig,
      [key]: value
    };
    saveHotelContent(editingHotel.id, { ...editingHotel.content, modules: newModules });
  };

  const addCategory = () => {
    const newCat = {
      id: `cat-${Date.now()}`,
      title: 'New Category',
      description: 'Category description...',
      icon: 'Star',
      items: []
    };
    updateConfig('categories', [...(config.categories || []), newCat]);
  };

  const updateCategory = (idx: number, key: string, value: any) => {
    const newCats = [...(config.categories || [])];
    newCats[idx] = { ...newCats[idx], [key]: value };
    updateConfig('categories', newCats);
  };

  const removeCategory = (idx: number) => {
    const newCats = [...(config.categories || [])];
    newCats.splice(idx, 1);
    updateConfig('categories', newCats);
  };

  const addItem = (catIdx: number) => {
    const newCats = [...(config.categories || [])];
    newCats[catIdx].items = [...(newCats[catIdx].items || []), { name: 'New Item', icon: 'Check' }];
    updateConfig('categories', newCats);
  };

  const updateItem = (catIdx: number, itemIdx: number, key: string, value: any) => {
    const newCats = [...(config.categories || [])];
    newCats[catIdx].items[itemIdx] = { ...newCats[catIdx].items[itemIdx], [key]: value };
    updateConfig('categories', newCats);
  };

  const removeItem = (catIdx: number, itemIdx: number) => {
    const newCats = [...(config.categories || [])];
    newCats[catIdx].items.splice(itemIdx, 1);
    updateConfig('categories', newCats);
  };

  const addBottomItem = () => {
    const newItem = {
      id: `bot-${Date.now()}`,
      title: 'New Item',
      description: 'Description...',
      icon: 'Info'
    };
    updateConfig('bottomItems', [...(config.bottomItems || []), newItem]);
  };

  const updateBottomItem = (idx: number, key: string, value: any) => {
    const newItems = [...(config.bottomItems || [])];
    newItems[idx] = { ...newItems[idx], [key]: value };
    updateConfig('bottomItems', newItems);
  };

  const removeBottomItem = (idx: number) => {
    const newItems = [...(config.bottomItems || [])];
    newItems.splice(idx, 1);
    updateConfig('bottomItems', newItems);
  };

  return (
    <div className="mt-8 border-t border-neutral-200 pt-8">
      <h3 className="text-lg font-bold mb-4">Directory of Services Design & Content</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-neutral-50 p-4 rounded-lg">
        <div>
          <label className="block text-xs uppercase text-neutral-500 mb-1">Primary Color</label>
          <div className="flex gap-2">
            <input 
              type="color" 
              value={config.primaryColor || '#0f172a'} 
              onChange={(e) => updateConfig('primaryColor', e.target.value)}
              className="h-8 w-8 rounded border-none cursor-pointer"
            />
            <input 
              type="text" 
              value={config.primaryColor || '#0f172a'} 
              onChange={(e) => updateConfig('primaryColor', e.target.value)}
              className="flex-1 bg-white border border-neutral-200 rounded px-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase text-neutral-500 mb-1">Secondary Color</label>
          <div className="flex gap-2">
            <input 
              type="color" 
              value={config.secondaryColor || '#d9b673'} 
              onChange={(e) => updateConfig('secondaryColor', e.target.value)}
              className="h-8 w-8 rounded border-none cursor-pointer"
            />
            <input 
              type="text" 
              value={config.secondaryColor || '#d9b673'} 
              onChange={(e) => updateConfig('secondaryColor', e.target.value)}
              className="flex-1 bg-white border border-neutral-200 rounded px-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase text-neutral-500 mb-1">Background Color</label>
          <div className="flex gap-2">
            <input 
              type="color" 
              value={config.backgroundColor || '#f8fafc'} 
              onChange={(e) => updateConfig('backgroundColor', e.target.value)}
              className="h-8 w-8 rounded border-none cursor-pointer"
            />
            <input 
              type="text" 
              value={config.backgroundColor || '#f8fafc'} 
              onChange={(e) => updateConfig('backgroundColor', e.target.value)}
              className="flex-1 bg-white border border-neutral-200 rounded px-2 text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase text-neutral-500 mb-1">Font Family</label>
          <select 
            value={config.fontFamily || 'Inter'} 
            onChange={(e) => updateConfig('fontFamily', e.target.value)}
            className="w-full bg-white border border-neutral-200 rounded px-2 py-1.5 text-sm"
          >
            <option value="Inter">Inter (Sans)</option>
            <option value="Playfair Display">Playfair Display (Serif)</option>
            <option value="Montserrat">Montserrat (Sans)</option>
            <option value="Lora">Lora (Serif)</option>
            <option value="system-ui">System Default</option>
          </select>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-bold mb-4 flex items-center justify-between">
          <span>Categories</span>
          <button onClick={addCategory} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
            <Plus size={14} /> Add Category
          </button>
        </h4>
        
        <div className="space-y-6">
          {(config.categories || []).map((cat: any, catIdx: number) => (
            <div key={cat.id} className="border border-neutral-200 rounded-lg p-4 bg-white relative">
              <button 
                onClick={() => removeCategory(catIdx)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Category Title</label>
                  <input 
                    type="text" 
                    value={cat.title || ''} 
                    onChange={(e) => updateCategory(catIdx, 'title', e.target.value)}
                    className="w-full border border-neutral-200 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 mb-1">Category Icon (Lucide)</label>
                  <input 
                    type="text" 
                    value={cat.icon || ''} 
                    onChange={(e) => updateCategory(catIdx, 'icon', e.target.value)}
                    className="w-full border border-neutral-200 rounded px-3 py-2 text-sm mb-2"
                  />
                  <ImageUpload 
                    label="Or Upload Category Image"
                    value={cat.image || ''}
                    onChange={(val: string) => updateCategory(catIdx, 'image', val)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-neutral-500 mb-1">Category Description</label>
                  <ReactQuill 
                    theme="snow"
                    value={cat.description || ''}
                    onChange={(val) => updateCategory(catIdx, 'description', val)}
                    className="bg-white rounded"
                  />
                </div>
              </div>

              <div className="mt-4 border-t border-neutral-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium">Items</h5>
                  <button onClick={() => addItem(catIdx)} className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                    <Plus size={12} /> Add Item
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {(cat.items || []).map((item: any, itemIdx: number) => (
                    <div key={itemIdx} className="flex flex-col gap-2 bg-neutral-50 p-3 rounded border border-neutral-100">
                      <div className="flex gap-2 items-center">
                        <GripVertical size={14} className="text-neutral-400 cursor-move" />
                        <input 
                          type="text" 
                          placeholder="Icon (e.g. Wifi)"
                          value={item.icon || ''} 
                          onChange={(e) => updateItem(catIdx, itemIdx, 'icon', e.target.value)}
                          className="w-24 border border-neutral-200 rounded px-2 py-1 text-xs"
                        />
                        <input 
                          type="text" 
                          placeholder="Item name"
                          value={item.name || ''} 
                          onChange={(e) => updateItem(catIdx, itemIdx, 'name', e.target.value)}
                          className="flex-1 border border-neutral-200 rounded px-2 py-1 text-xs"
                        />
                        <button onClick={() => removeItem(catIdx, itemIdx)} className="text-neutral-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="pl-6 pb-2 pr-2">
                        <label className="block text-xs text-neutral-500 mb-1">Item Modal Content (Optional)</label>
                        <ReactQuill 
                          theme="snow"
                          value={item.content || ''}
                          onChange={(val) => updateItem(catIdx, itemIdx, 'content', val)}
                          className="bg-white rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-bold mb-4 flex items-center justify-between">
          <span>Bottom Highlight Cards</span>
          <button onClick={addBottomItem} className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100">
            <Plus size={14} /> Add Card
          </button>
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(config.bottomItems || []).map((item: any, idx: number) => (
            <div key={item.id} className="border border-neutral-200 rounded-lg p-4 bg-white relative">
              <button 
                onClick={() => removeBottomItem(idx)}
                className="absolute top-2 right-2 text-neutral-400 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
              
              <div className="flex gap-2 mb-2 pr-6">
                <div className="w-1/2">
                  <label className="block text-xs text-neutral-500 mb-1">Icon (Lucide)</label>
                  <input 
                    type="text" 
                    value={item.icon || ''} 
                    onChange={(e) => updateBottomItem(idx, 'icon', e.target.value)}
                    className="w-full border border-neutral-200 rounded px-2 py-1 text-xs mb-2"
                  />
                  <ImageUpload 
                    label="Or Upload Image"
                    value={item.image || ''}
                    onChange={(val: string) => updateBottomItem(idx, 'image', val)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-neutral-500 mb-1">Title</label>
                  <input 
                    type="text" 
                    value={item.title || ''} 
                    onChange={(e) => updateBottomItem(idx, 'title', e.target.value)}
                    className="w-full border border-neutral-200 rounded px-2 py-1 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Description</label>
                <ReactQuill 
                  theme="snow"
                  value={item.description || ''}
                  onChange={(val) => updateBottomItem(idx, 'description', val)}
                  className="bg-white rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 border border-neutral-200 rounded-lg p-4 bg-white">
        <h4 className="font-bold mb-4">Footer Text</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Left Footer</label>
            <ReactQuill 
              theme="snow"
              value={config.footerLeft || ''}
              onChange={(val) => updateConfig('footerLeft', val)}
              className="bg-white rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Right Footer</label>
            <ReactQuill 
              theme="snow"
              value={config.footerRight || ''}
              onChange={(val) => updateConfig('footerRight', val)}
              className="bg-white rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
