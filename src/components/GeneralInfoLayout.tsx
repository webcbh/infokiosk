import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from "lucide-react";

// Safe wrapper to render HTML safely from ReactQuill
const SafeHTML = ({ html, className }: { html: string, className?: string }) => {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};

function DynamicIcon({ name, ...props }: { name: string; [key: string]: any }) {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Info;
  return <Icon {...props} />;
}

export default function GeneralInfoLayout({ module, onClose, onOpenSubmodule }: { module: any, onClose: () => void, onOpenSubmodule?: (sub: any) => void }) {
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

  const config = module.generalInfoConfig || defaultConfig;

  const styleObj = {
    fontFamily: config.fontFamily,
    backgroundColor: config.backgroundColor,
    color: config.textColor,
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="absolute inset-0 z-50 overflow-y-auto"
      style={styleObj}
    >

      <div className="min-h-full max-w-5xl mx-auto px-4 py-12 md:py-20 flex flex-col pt-20">
        
        {/* Header section matching the design */}
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-8 mb-16">
          <div 
            className="w-28 h-28 shrink-0 rounded-full flex items-center justify-center shadow-lg"
            style={{ backgroundColor: config.primaryColor }}
          >
            <div className="w-24 h-24 rounded-full border-2 flex items-center justify-center" style={{ borderColor: config.secondaryColor, color: config.secondaryColor }}>
              <DynamicIcon name={config.header?.icon || "Info"} size={48} strokeWidth={1.5} />
            </div>
          </div>
          <div className="flex flex-col justify-center h-full pt-2">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight uppercase break-words" style={{ color: config.primaryColor }}>
              {config.header?.title || "GENERAL INFORMATION"}
            </h1>
            <div className="h-1 w-12 mt-4 mb-4" style={{ backgroundColor: config.secondaryColor }}></div>
            <p className="text-lg md:text-xl max-w-xl" style={{ color: config.primaryColor }}>
              {config.header?.subtitle || "Find essential information to help you plan your travel and explore with ease."}
            </p>
          </div>
        </div>

        {/* List of cards */}
        <div className="flex flex-col gap-6 mb-12">
          {(config.items || []).map((item: any, idx: number) => (
            <div 
              key={item.id || idx} 
              className="flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden bg-white border border-neutral-100 items-stretch cursor-pointer"
              onClick={() => onOpenSubmodule && onOpenSubmodule(item)}
            >
              <div className="md:w-1/3 shrink-0 relative h-48 md:h-auto">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                    <DynamicIcon name="Image" size={48} className="text-neutral-300" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 flex items-center p-6 md:p-8 gap-6 md:gap-8">
                <div 
                  className="w-20 h-20 shrink-0 rounded-full flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: `${config.secondaryColor}15` }}
                >
                  <div style={{ color: config.secondaryColor }}>
                    <DynamicIcon name={item.icon || "Info"} size={36} strokeWidth={1.5} />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 uppercase tracking-wide" style={{ color: config.primaryColor }}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm md:text-base leading-relaxed opacity-80" style={{ color: config.primaryColor }}>
                      {item.description}
                    </p>
                  )}
                </div>
                
                <div className="hidden sm:flex w-12 h-12 shrink-0 items-center justify-center rounded-full border-2 hover:bg-neutral-50 transition-colors" style={{ borderColor: config.primaryColor, color: config.primaryColor }}>
                  <DynamicIcon name="ChevronRight" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Banner */}
        {(config.footer?.title || config.footer?.description) && (
          <div className="bg-[#f5f8fc] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between border border-blue-100/50 mt-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 md:gap-6">
              {config.footer?.icon && (
                <div style={{ color: config.primaryColor }}>
                  <DynamicIcon name={config.footer.icon} size={40} strokeWidth={1.5} />
                </div>
              )}
              <div>
                <h4 className="text-lg font-bold mb-1" style={{ color: config.primaryColor }}>{config.footer?.title}</h4>
                <p className="text-sm md:text-base opacity-80" style={{ color: config.primaryColor }}>{config.footer?.description}</p>
              </div>
            </div>
            {config.footer?.buttonText && (
              <button 
                className="shrink-0 px-8 py-4 rounded-full flex items-center gap-3 text-white font-bold text-sm tracking-wide shadow hover:opacity-90 transition-opacity"
                onClick={() => {
                  if (module?.button?.moduleId) {
                    window.dispatchEvent(new CustomEvent('openModule', { detail: module.button.moduleId }));
                  } else if (module?.button?.url) {
                    window.open(module.button.url, '_blank');
                  }
                }}
                style={{ backgroundColor: config.primaryColor }}
              >
                {config.footer.buttonIcon && <DynamicIcon name={config.footer.buttonIcon} size={20} />}
                {module?.button?.label || config.footer.buttonText}
              </button>
            )}
          </div>
        )}

      </div>
      
    </motion.div>
  );
}
