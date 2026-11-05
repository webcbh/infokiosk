import React from 'react';
import { ChevronLeft, ChevronRight, MapPin, Flag, HelpCircle, Phone, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GolfLayout({ module, onBack, onOpenSubmodule }: { module: any, onBack?: () => void, onOpenSubmodule: (sub: any, options?: any) => void }) {
  const contentHtml = module.content || '<p>Discover world-class golf experiences in stunning locations.</p>';
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = contentHtml;
  const description = tempDiv.textContent || tempDiv.innerText || 'Discover world-class golf experiences in stunning locations.';

  const brandBlue = "#0b2545";
  const brandGold = "#d9a05b";

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#fcfcfc] overflow-y-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top Nav Bar */}
      {onBack && (
        <div className="flex items-center px-4 py-4 sticky top-0 z-20 shadow-sm" style={{ backgroundColor: brandBlue }}>
          <button onClick={onBack} className="flex items-center text-white hover:opacity-80 transition-opacity font-semibold">
            <ChevronLeft size={24} className="mr-2" />
            <span className="tracking-wide uppercase text-sm md:text-base lg:text-lg">GOLF HOLIDAYS</span>
          </button>
        </div>
      )}

      <div className="flex-1 max-w-[1000px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-10">
          <div className="flex-shrink-0">
            <div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[3px] flex items-center justify-center bg-[#0b2545]" 
              style={{ borderColor: brandBlue, color: brandGold }}
            >
              {/* Custom SVG for Flag/Hole */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-16 md:h-16">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 uppercase tracking-tight" style={{ color: brandBlue }}>
              {module.title || "GOLF HOLIDAYS"}
            </h1>
            <div className="w-16 h-1 mb-4" style={{ backgroundColor: brandGold }}></div>
            <p className="text-sm md:text-lg lg:text-xl leading-relaxed max-w-2xl" style={{ color: brandBlue }}>
              {description}
            </p>
          </div>
        </div>

        {/* Courses Section */}
        <div className="flex flex-col gap-6 mb-12">
          {(module.submodules || []).map((sub: any, idx: number) => {
            return (
              <motion.div
                key={sub.id}
                onClick={() => onOpenSubmodule({ ...sub, layout: sub.layout || 'golfDetails' })}
                className="bg-white rounded-2xl shadow-sm border border-neutral-100 flex flex-col md:flex-row overflow-hidden cursor-pointer hover:shadow-md transition-shadow group p-3 md:p-5 gap-5 items-center relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
              >
                {/* Image */}
                <div className="w-full md:w-1/3 aspect-[3/2] rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={sub.image || 'https://images.unsplash.com/photo-1535144883408-01186716093d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={sub.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col py-2 w-full pr-8">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: brandBlue, color: brandGold }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-6 md:h-6">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                        <line x1="4" y1="22" x2="4" y2="15"></line>
                      </svg>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: brandBlue }}>
                      {sub.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm md:text-base text-gray-600 mb-6 max-w-xl">
                    {sub.subtitle || 'A stunning championship course set in a breathtaking natural landscape.'}
                  </p>

                  <div>
                    <button 
                      className="px-6 py-2 rounded-full text-sm font-semibold border transition-colors inline-flex items-center gap-2"
                      style={{ borderColor: brandBlue, color: brandBlue }}
                    >
                      VIEW DETAILS
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Right Arrow */}
                <div className="hidden md:flex absolute right-6 text-opacity-50 group-hover:text-opacity-100 transition-opacity" style={{ color: brandGold }}>
                  <ChevronRight size={32} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 rounded-xl text-white shadow-md" style={{ backgroundColor: brandBlue }}>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0" style={{ borderColor: 'white', color: brandGold }}>
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-10 md:h-10">
                 <circle cx="12" cy="4" r="2"></circle>
                 <path d="M11 6v6l-2 3"></path>
                 <path d="M11 6l3 2"></path>
                 <path d="M11 12l2 4"></path>
                 <path d="M12 21h-2"></path>
                 <path d="M15 21h-2"></path>
                 <path d="M9 15v6"></path>
                 <path d="M13 16v5"></path>
                 <path d="M22 20h-2"></path>
                 <path d="M20 20c-1.5 0-3-1-3-3s1.5-3 3-3"></path>
               </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl lg:text-2xl uppercase tracking-wider mb-1 md:mb-2">
                NEED HELP PLANNING YOUR GOLF HOLIDAY?
              </h3>
              <p className="text-sm md:text-base opacity-90 leading-relaxed max-w-md">
                Our team is here to assist you with tee times, packages and special requests.
              </p>
            </div>
          </div>
          <button 
            className="font-bold text-sm md:text-base px-6 py-3 md:px-8 md:py-4 rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: brandGold, color: brandBlue }}
          >
            CONTACT CONCIERGE
            <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}