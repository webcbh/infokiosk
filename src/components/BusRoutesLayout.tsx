import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from "lucide-react";

function DynamicIcon({ name, ...props }: { name: string; [key: string]: any }) {
  const [IconComp, setIconComp] = useState<any>(null);
  
  useEffect(() => {
    import('lucide-react').then((LucideIcons: any) => {
      setIconComp(() => LucideIcons[name] || LucideIcons.Info);
    });
  }, [name]);

  if (!IconComp) return <span className="w-4 h-4 inline-block bg-transparent"></span>;
  return <IconComp {...props} />;
}

export default function BusRoutesLayout({ module, onClose }: { module: any, onClose: () => void }) {
  // Use the busRoutesConfig from the general information module's generalInfoConfig,
  // or module.busRoutesConfig directly if it's passed that way.
  const config = module.generalInfoConfig?.busRoutesConfig || module.busRoutesConfig || {
    header: {
      title: "BUS ROUTES",
      subtitle: "Easy connections to key destinations.\nPlan your journey with our convenient bus services.",
      icon: "Bus"
    },
    routes: [
      {
        id: "route-1",
        number: "611",
        title: "BUS ROUTE 611",
        subtitle: "Harbour - Geroskipou Beach (Waterpark)",
        stops: "Geroskipou Beach (Waterpark), Poseidonos Av., Danaes Av., Poseidonos, Artemidos, Ledas, Harbour (Main Station)",
        sections: [
          {
            title: "FROM HARBOUR",
            icon: "Ship",
            schedules: [
              {
                title: "MONDAY - FRIDAY",
                subtitle: "(Valid From September to May)",
                times: "6:25, 6:50, 7:20, 7:50, 8:05 - 10:35\n(every 10 minutes), 10:50, 11:05, 11:20, 11:35,\n11:50, 12:15, 12:25, 12:35, 12:45, 13:00,\n13:20, 13:35, 13:50, 14:05 - 16:55\n(every 10 minutes), 17:10, 17:25, 17:40, 17:55."
              },
              {
                title: "MONDAY - FRIDAY",
                subtitle: "(Valid From June to August)\n+ SATURDAYS + SUNDAYS + SCHOOL HOLIDAYS",
                times: "6:25, 6:50, 7:20, 7:50, 8:05 - 10:45\n(every 10 minutes), 11:00 - 14:20\n(every 10-15 minutes), 14:35 - 16:45\n(every 10 minutes), 17:00, 17:15,\n17:30, 17:50."
              }
            ]
          },
          {
            title: "FROM GEROSKIPOU BEACH (WATERPARK)",
            icon: "Umbrella",
            schedules: [
              {
                title: "MONDAY - FRIDAY",
                subtitle: "(Valid From September to May)",
                times: "6:40, 7:05, 7:35, 8:05, 8:20 - 11:35\n(every 10-15 minutes), 11:55, 12:15, 12:30,\n12:45, 12:55, 13:05 - 14:05 (every 15 minutes),\n13:20 - 17:10 (every 10 minutes),\n17:25 - 18:10 (every 15 minutes)."
              },
              {
                title: "MONDAY - FRIDAY",
                subtitle: "(Valid From June to August)\n+ SATURDAYS + SUNDAYS + SCHOOL HOLIDAYS",
                times: "6:40, 7:05, 7:35, 8:00, 8:20 - 12:55\n(every 10-15 minutes), 13:15, 13:30, 13:45,\n13:55, 14:10, 14:25, 14:35, 14:50,\n15:05 - 16:05 (every 10 minutes),\n16:10 - 16:50 (every 10 minutes),\n17:05, 17:20, 17:30, 17:45, 18:05."
              }
            ]
          },
          {
            title: "NIGHT ROUTES FROM APRIL - NOVEMBER",
            icon: "Moon",
            schedules: [
              {
                title: "FROM HARBOUR",
                subtitle: "MONDAY - SUNDAY",
                times: "18:05 - 21:20 (every 15 minutes),\n21:50, 22:20, 22:50 - 01:05\n(every 15 minutes)"
              },
              {
                title: "FROM GEROSKIPOU MUNICIPAL BEACH",
                subtitle: "MONDAY - SUNDAY",
                times: "18:20 - 21:35 (every 15 minutes),\n22:05, 22:35, 23:05 - 01:20\n(every 15 minutes)"
              }
            ]
          },
          {
            title: "NIGHT ROUTES FROM DECEMBER - MARCH",
            icon: "Moon",
            schedules: [
              {
                title: "FROM HARBOUR",
                subtitle: "MONDAY - SUNDAY",
                times: "18:05 - 20:35 (every 30 minutes),\n21:50 - 00:20 (every 30 minutes)"
              },
              {
                title: "FROM GEROSKIPOU MUNICIPAL BEACH",
                subtitle: "MONDAY - SUNDAY",
                times: "18:20 - 20:50 (every 30 minutes),\n22:05 - 00:35 (every 30 minutes)"
              }
            ]
          }
        ]
      }
    ],
    note: {
      title: "PLEASE NOTE",
      description: "Schedules may be subject to change on public holidays and special occasions.\nPlease check at the main station or with our concierge for the latest updates."
    },
    footer: {
      title: "NEED HELP PLANNING YOUR JOURNEY?",
      subtitle: "Our team is here to assist you.",
      icon: "Bus"
    }
  };

  const primaryColor = module.generalInfoConfig?.primaryColor || '#0f3866';
  const secondaryColor = module.generalInfoConfig?.secondaryColor || '#d9b673';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="absolute inset-0 z-50 overflow-y-auto bg-[#faf9f6]"
    >
      <div className="w-full bg-[#102442] text-white px-4 py-4 flex items-center sticky top-0 z-50 shadow-sm">
        <button onClick={onClose} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <LucideIcons.ChevronLeft size={24} />
          <span className="text-sm font-semibold tracking-widest uppercase">BUS ROUTES</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-6 font-sans">
        
        {/* Main Header */}
        <div className="flex items-start gap-6 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-neutral-100 mb-2">
          <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-full flex items-center justify-center bg-[#102442] border-[3px] border-[#D9B673]">
            <DynamicIcon name={config.header?.icon || "Bus"} size={40} className="text-[#D9B673]" />
          </div>
          <div className="flex-1 pt-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase text-[#102442] mb-3">
              {config.header?.title || "BUS ROUTES"}
            </h1>
            <p className="text-neutral-600 leading-relaxed whitespace-pre-line text-sm md:text-base">
              {config.header?.subtitle}
            </p>
          </div>
        </div>

        {/* Routes */}
        {(config.routes || []).map((route: any, idx: number) => (
          <div key={idx} className="flex flex-col gap-6 mb-8">
            {/* Route Header */}
            <div className="bg-[#102442] rounded-xl p-5 md:p-6 text-white flex items-center gap-5 shadow-md">
              <div className="w-16 h-16 rounded-full border-2 border-[#D9B673] flex items-center justify-center font-bold text-xl md:text-2xl text-[#D9B673] shrink-0">
                {route.number || (idx + 1).toString()}
              </div>
              <div className="flex-1">
                <h2 className="text-lg md:text-xl font-bold uppercase mb-1 tracking-wider">{route.title}</h2>
                {route.subtitle && <p className="text-[#D9B673] font-medium text-sm md:text-base mb-2">{route.subtitle}</p>}
                {route.stops && (
                  <div className="flex items-start gap-2 text-white/80 text-xs md:text-sm leading-relaxed">
                    <LucideIcons.MapPin size={16} className="shrink-0 mt-0.5" />
                    <p>{route.stops}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sections */}
            {(route.sections || []).map((section: any, sIdx: number) => (
              <div key={sIdx} className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
                <div className="bg-[#F8F9FA] px-6 py-4 flex items-center gap-3 border-b border-neutral-200">
                  <div className="w-10 h-10 rounded-full bg-[#102442]/5 flex items-center justify-center text-[#102442]">
                    <DynamicIcon name={section.icon || "Clock"} size={20} />
                  </div>
                  <h3 className="font-bold text-[#102442] tracking-wide">{section.title}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                  {(section.schedules || []).map((schedule: any, schIdx: number) => (
                    <div key={schIdx} className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <LucideIcons.Calendar className="text-[#D9B673] shrink-0 mt-0.5" size={20} />
                        <div>
                          <h4 className="font-bold text-[#102442] text-sm leading-tight">{schedule.title}</h4>
                          {schedule.subtitle && (
                            <p className="text-[#D9B673] text-[11px] font-medium uppercase mt-1 whitespace-pre-line leading-tight">
                              {schedule.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 pl-1">
                        <LucideIcons.Clock className="text-[#D9B673] shrink-0 mt-1" size={18} />
                        <p className="text-[#102442] text-sm whitespace-pre-line leading-relaxed font-medium">
                          {schedule.times}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Note */}
        {config.note && (
          <div className="bg-[#F8F9FA] rounded-xl p-5 border border-neutral-200 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full border border-[#D9B673] text-[#D9B673] flex items-center justify-center shrink-0">
              <span className="font-serif italic font-bold">i</span>
            </div>
            <div>
              <h4 className="font-bold text-[#102442] mb-1 text-sm tracking-wide">{config.note.title}</h4>
              <p className="text-neutral-600 text-sm whitespace-pre-line leading-relaxed">{config.note.description}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        {config.footer && (
          <div className="bg-[#102442] rounded-xl p-6 flex items-center justify-between text-white shadow-md mt-4 cursor-pointer hover:bg-[#1a3359] transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[#D9B673] text-[#D9B673] flex items-center justify-center shrink-0">
                <DynamicIcon name={config.footer.icon || "HelpCircle"} size={24} />
              </div>
              <div>
                <h4 className="font-medium text-sm md:text-base tracking-wide">{config.footer.title}</h4>
                <p className="text-white/70 text-sm mt-0.5">{config.footer.subtitle}</p>
              </div>
            </div>
            <LucideIcons.ChevronRight className="text-white" size={24} />
          </div>
        )}

      </div>
    </motion.div>
  );
}
