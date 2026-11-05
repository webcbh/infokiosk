import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from "lucide-react";

const SafeHTML = ({ html, className }: { html: string, className?: string }) => {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};

function DynamicIcon({ name, ...props }: { name: string; [key: string]: any }) {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Check;
  return <Icon {...props} />;
}

export default function DirectoryOfServicesLayout({ module, onClose }: { module: any, onClose: () => void }) {
  const [localConfig, setLocalConfig] = React.useState(module.directoryConfig);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);

  React.useEffect(() => {
    setLocalConfig(module.directoryConfig);
  }, [module.directoryConfig]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      for (const hotel of data.hotels || []) {
        if (hotel.content?.modules) {
          const mod = hotel.content.modules.find((m: any) => m.id === module.id || m.title === module.title);
          if (mod && mod.directoryConfig) {
            setLocalConfig(mod.directoryConfig);
            break;
          }
        }
      }
    } catch (e) {
      console.error("Failed to refresh config", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const config = localConfig || {
    categories: []
  };

  // Flatten all items from categories just in case the db structure has multiple categories
  const allItems = useMemo(() => {
    const items: any[] = [];
    (config.categories || []).forEach((cat: any) => {
      if (cat.items) {
        cat.items.forEach((item: any) => {
          items.push(item);
        });
      }
    });
    // Sort alphabetically by name
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [config.categories]);

  const brandBlue = "#0b2545";
  const brandGold = "#d9a05b";
  const bgLight = "#fdfdfd";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col bg-[#fcfcfc] overflow-y-auto"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Top Nav Bar */}
      <div className="flex items-center px-4 py-4 sticky top-0 z-20 shadow-sm" style={{ backgroundColor: brandBlue }}>
        <button onClick={onClose} className="flex items-center text-white hover:opacity-80 transition-opacity font-semibold">
          <DynamicIcon name="ChevronLeft" size={24} className="mr-2" />
          <span className="tracking-wide uppercase text-sm md:text-base lg:text-lg">DIRECTORY OF SERVICES</span>
        </button>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-8 mb-10">
          <div className="flex-shrink-0">
            <div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[3px] flex items-center justify-center bg-white" 
              style={{ borderColor: brandGold, backgroundColor: brandBlue, color: brandGold }}
            >
              <DynamicIcon name="ConciergeBell" size={48} className="md:w-16 md:h-16" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 uppercase tracking-tight" style={{ color: brandBlue }}>
              DIRECTORY OF SERVICES
            </h1>
            <div className="w-16 h-1 mb-4" style={{ backgroundColor: brandGold }}></div>
            <p className="text-sm md:text-lg lg:text-xl mb-6 leading-relaxed max-w-2xl" style={{ color: brandBlue }}>
              Everything you need for a comfortable and memorable stay.
              <br className="hidden md:block" />
              Browse our directory to find the services available to you.
            </p>
            
            {/* Info Box */}
            <div 
              className="flex items-start md:items-center gap-4 p-4 md:p-5 rounded-lg border bg-[#fffaf0]"
              style={{ borderColor: brandGold, color: brandBlue }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center" style={{ borderColor: brandGold, color: brandGold }}>
                <DynamicIcon name="Info" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base lg:text-lg uppercase tracking-wider mb-1">HERE TO HELP</h3>
                <p className="text-xs md:text-base lg:text-lg opacity-90 leading-relaxed">
                  Our team is dedicated to your comfort and convenience.<br className="hidden lg:block"/>
                  Please contact Reception or Concierge for any assistance or information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* All Services Section */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-1 h-6" style={{ backgroundColor: brandGold }}></div>
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold uppercase tracking-widest" style={{ color: brandBlue }}>
            ALL SERVICES
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-12">
          {allItems.map((item: any, idx: number) => (
            <div 
              key={idx} 
              onClick={() => {
                if (item.content) {
                  setSelectedItem(item);
                }
              }}
              className={`flex items-center justify-between p-4 rounded-lg bg-white border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] transition-shadow ${item.content ? 'cursor-pointer hover:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.15)] group' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div style={{ color: brandGold }}>
                  <DynamicIcon name={item.icon || 'Check'} size={24} strokeWidth={1.5} />
                </div>
                <span className={`font-medium text-sm md:text-base lg:text-lg ${item.content ? 'group-hover:opacity-80 transition-opacity' : ''}`} style={{ color: brandBlue }}>
                  {item.name}
                </span>
              </div>
              {item.content && (
                <div style={{ color: brandBlue }} className="opacity-50 group-hover:opacity-100 transition-opacity">
                  <DynamicIcon name="ChevronRight" size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Banners */}
        <div className="mt-8 flex flex-col gap-6 max-w-5xl mx-auto w-full">
          {/* Need Assistance Box */}
          <div 
            className="flex items-start md:items-center justify-between gap-4 p-4 md:p-6 rounded-lg border bg-[#fffaf0]"
            style={{ borderColor: brandGold, color: brandBlue }}
          >
            <div className="flex items-start md:items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center" style={{ borderColor: brandGold, color: brandGold }}>
                <DynamicIcon name="Info" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base lg:text-lg uppercase tracking-wider mb-1">NEED ASSISTANCE?</h3>
                <p className="text-xs md:text-sm lg:text-base opacity-90 leading-relaxed">
                  Our Concierge team is at your service.<br className="hidden md:block" />
                  Please contact Reception for any information or requests.
                </p>
              </div>
            </div>
            <div className="hidden md:block opacity-20" style={{ color: brandGold }}>
               <DynamicIcon name="ConciergeBell" size={64} />
            </div>
          </div>

          {/* Contact Concierge Box */}
          <div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 rounded-lg text-white"
            style={{ backgroundColor: brandBlue }}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <DynamicIcon name="Headset" size={48} className="opacity-80" />
              </div>
              <div>
                <h3 className="font-bold text-base md:text-lg lg:text-xl uppercase tracking-wider mb-1">
                  WE ARE AT YOUR SERVICE
                </h3>
                <p className="text-xs md:text-sm lg:text-base opacity-90 leading-relaxed max-w-md">
                  If you need anything during your stay, our team is always happy to help.
                </p>
              </div>
            </div>
            <button 
              className="font-bold text-sm md:text-base px-6 py-3 md:px-8 md:py-4 rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ backgroundColor: brandGold, color: brandBlue }}
            >
              CONTACT CONCIERGE
              <DynamicIcon name="ChevronRight" size={20} />
            </button>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
              style={{ borderTop: `4px solid ${brandGold}` }}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div style={{ color: brandGold }}>
                    <DynamicIcon name={selectedItem.icon || 'Check'} size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-wider" style={{ color: brandBlue }}>
                    {selectedItem.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                >
                  <DynamicIcon name="X" size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 py-6 prose prose-sm md:prose-base lg:prose-lg max-w-none break-words" style={{ color: brandBlue, wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                <SafeHTML html={selectedItem.content || ''} className="w-full max-w-full overflow-hidden [&_*]:max-w-full [&_*]:break-words" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
