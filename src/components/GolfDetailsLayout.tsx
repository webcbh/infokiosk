import React from 'react';
import { ChevronLeft, Phone, MapPin, Flag, User, Info, Crosshair, ArrowRight } from 'lucide-react';

export function GolfDetailsLayout({ module, onClose }: { module: any; onClose: () => void }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0A1B3F] font-sans w-full overflow-x-hidden break-words">
      {/* Top Header */}
      <div className="bg-[#0A1B3F] text-white px-6 py-4 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold tracking-wide uppercase break-words flex-1">{module.parentModuleTitle || 'GOLF HOLIDAYS'}</h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Content Section */}
        <div className="flex flex-col lg:flex-row gap-10 mb-12">
          {/* Image */}
          <div className="w-full lg:w-[45%] flex-shrink-0">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm bg-gray-100">
              <img 
                src={module.image || 'https://images.unsplash.com/photo-1593111663630-f47055745749?auto=format&fit=crop&w=1000&q=80'} 
                alt={module.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Title and Description */}
          <div className="w-full lg:w-[55%] flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-[#0A1B3F] text-[#D4AF37] flex items-center justify-center border-2 border-[#0A1B3F] shrink-0">
                <Flag size={28} />
              </div>
              <h2 className="text-4xl font-bold text-[#0A1B3F] break-words flex-1 min-w-0">{module.title}</h2>
            </div>
            <div className="w-12 h-0.5 bg-[#D4AF37] mb-8"></div>
            
            <div className="prose prose-lg text-[#334155] prose-p:leading-relaxed break-words max-w-full">
              {module.content ? (
                <div dangerouslySetInnerHTML={{ __html: module.content }} />
              ) : (
                <>
                  <p className="mb-6">
                    A beautiful and demanding golf course that winds its way past a 12th-century monastery with breath-taking views of the Troodos Mountains and beyond, golf at {module.title} is a unique and characterful experience.
                  </p>
                  <p>
                    Designed by legendary golf architect Donald Steel in 1994 and renovated by renowned course designers Mackenzie & Ebert, the course is situated approx. 20 km from the hotel.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 relative">
            {/* Desktop Divider */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-neutral-200 transform -translate-x-1/2"></div>
            {/* Horizontal Divider */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-neutral-200 transform -translate-y-1/2"></div>

            {/* Holes */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#0A1B3F] text-[#D4AF37] flex items-center justify-center shrink-0">
                <Flag size={28} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0A1B3F] tracking-widest uppercase mb-1 break-words">Holes</p>
                <p className="text-4xl font-semibold text-[#0A1B3F] break-words">{module.holes || '18'}</p>
              </div>
            </div>

            {/* Par */}
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#0A1B3F] text-[#D4AF37] flex items-center justify-center shrink-0">
                <Crosshair size={28} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0A1B3F] tracking-widest uppercase mb-1 break-words">Par</p>
                <p className="text-4xl font-semibold text-[#0A1B3F] break-words">{module.par || '72'}</p>
              </div>
            </div>

            {/* Men Handicap */}
            <div className="flex items-center gap-6 pt-0 md:pt-4">
              <div className="w-16 h-16 rounded-full bg-[#0A1B3F] text-[#D4AF37] flex items-center justify-center shrink-0">
                <User size={28} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0A1B3F] tracking-widest uppercase mb-1 break-words">Men Handicap</p>
                <p className="text-4xl font-semibold text-[#0A1B3F] break-words">{module.menHandicap || '36'}</p>
              </div>
            </div>

            {/* Women Handicap */}
            <div className="flex items-center gap-6 pt-0 md:pt-4">
              <div className="w-16 h-16 rounded-full bg-[#0A1B3F] text-[#D4AF37] flex items-center justify-center shrink-0">
                <User size={28} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0A1B3F] tracking-widest uppercase mb-1 break-words">Women Handicap</p>
                <p className="text-4xl font-semibold text-[#0A1B3F] break-words">{module.womenHandicap || '36'}</p>
              </div>
            </div>

            {/* Length */}
            <div className="flex items-center gap-6 pt-0 md:pt-4">
              <div className="w-16 h-16 rounded-full bg-[#0A1B3F] text-[#D4AF37] flex items-center justify-center shrink-0">
                <ArrowRight size={28} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0A1B3F] tracking-widest uppercase mb-1 break-words">Length</p>
                <p className="text-4xl font-semibold text-[#0A1B3F] break-words">
                  {module.length || '5902 m'}
                </p>
              </div>
            </div>

            {/* Distance */}
            <div className="flex items-center gap-6 pt-0 md:pt-4">
              <div className="w-16 h-16 rounded-full bg-[#0A1B3F] text-[#D4AF37] flex items-center justify-center shrink-0">
                <MapPin size={28} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#0A1B3F] tracking-widest uppercase mb-1 break-words">Distance From Hotel</p>
                <p className="text-xl font-semibold text-[#0A1B3F] break-words">{module.distance || 'Approx. 18 km'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Good to Know */}
        <div className="bg-[#FFFDF9] border border-[#F2E5CD] rounded-2xl p-8 mb-8 relative overflow-hidden flex items-start gap-6">
          <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center shrink-0">
            <Info size={24} />
          </div>
          <div className="flex-1 relative z-10">
            <h3 className="text-sm font-bold text-[#0A1B3F] tracking-widest uppercase mb-3">Good to Know</h3>
            <ul className="space-y-2 break-words">
              {module.goodToKnow ? (
                module.goodToKnow.split('\n').filter(Boolean).map((line: string, i: number) => (
                  <li key={i} className="text-[#334155]">{line}</li>
                ))
              ) : (
                <>
                  <li className="text-[#334155]">Tee times can be arranged upon request.</li>
                  <li className="text-[#334155]">Transportation available. Please contact Concierge.</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="bg-[#0A1B3F] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="flex items-center gap-6 text-white">
            <div className="w-14 h-14 rounded-full border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center shrink-0">
              <Phone size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold uppercase mb-1 break-words">Need help planning your golf holiday?</h3>
              <p className="text-white/80 max-w-md break-words">Our team is here to assist you with tee times, packages and special requests.</p>
            </div>
          </div>
          <button className="bg-[#D4AF37] hover:bg-[#C5A030] text-[#0A1B3F] font-bold uppercase tracking-wider text-sm px-8 py-4 rounded transition-colors flex items-center gap-2 shrink-0">
            Contact Concierge
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}
