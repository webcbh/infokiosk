import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Trophy, PenLine, ExternalLink, Headset } from 'lucide-react';

export default function AwardsLayout({ module, onClose }: { module: any, onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  let gallery = [];
  if (module.awardsBanners && module.awardsBanners.length > 0) {
    gallery = module.awardsBanners;
  } else if (module.awardsBanner) {
    gallery = [module.awardsBanner];
  } else if (module.gallery && module.gallery.length > 0) {
    gallery = module.gallery;
  } else {
    gallery = ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop'];
  }
  const galleryTimer = module.awardsGalleryTimer ? (parseInt(module.awardsGalleryTimer) * 1000) : 5000;
  
  useEffect(() => {
    if (gallery.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % gallery.length);
      }, galleryTimer);
      return () => clearInterval(timer);
    }
  }, [gallery.length, galleryTimer]);

  const brandBlue = "#0b2545";
  const brandGold = "#d9a05b";

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-[#fcfcfc] overflow-y-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top Nav Bar */}
      <div className="flex items-center px-4 py-4 sticky top-0 z-20 shadow-sm" style={{ backgroundColor: brandBlue }}>
        <button onClick={onClose} className="flex items-center text-white hover:opacity-80 transition-opacity font-semibold">
          <ChevronLeft size={24} className="mr-2" />
          <span className="tracking-wide uppercase text-sm md:text-base lg:text-lg">AWARDS</span>
        </button>
      </div>

      <div className="flex-1 max-w-[1000px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-10">
          <div className="flex-shrink-0">
            <div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[3px] flex items-center justify-center bg-[#0b2545]" 
              style={{ borderColor: brandGold, color: brandGold }}
            >
              <Trophy size={48} className="md:w-16 md:h-16" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 uppercase tracking-tight" style={{ color: brandBlue }}>
              OUR AWARDS
            </h1>
            <div className="w-16 h-1 mb-4" style={{ backgroundColor: brandGold }}></div>
            <p className="text-sm md:text-lg lg:text-xl leading-relaxed max-w-2xl" style={{ color: brandBlue }}>
              We are proud to be recognised for our commitment<br className="hidden md:block" /> to excellence and genuine hospitality.
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative mb-12 flex justify-center">
           <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-neutral-100 group flex items-center justify-center">
             <AnimatePresence mode="wait">
                <motion.img 
                  key={currentSlide}
                  src={gallery[currentSlide]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
             </AnimatePresence>
             {gallery.length > 1 && (
               <>
                 <button 
                   onClick={() => setCurrentSlide((prev) => (prev - 1 + gallery.length) % gallery.length)}
                   className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded flex items-center justify-center transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
                   style={{ backgroundColor: brandBlue, color: "white" }}
                 >
                   <ChevronLeft size={24} />
                 </button>
                 <button 
                   onClick={() => setCurrentSlide((prev) => (prev + 1) % gallery.length)}
                   className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded flex items-center justify-center transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
                   style={{ backgroundColor: brandBlue, color: "white" }}
                 >
                   <ChevronRight size={24} />
                 </button>
               </>
             )}
           </div>
           
           {/* Pagination Dots */}
           {gallery.length > 1 && (
             <div className="flex justify-center gap-3 mt-6">
               {gallery.map((_: any, idx: number) => (
                 <button
                   key={idx}
                   onClick={() => setCurrentSlide(idx)}
                   className={`w-3 h-3 rounded-full transition-colors ${idx === currentSlide ? 'bg-[#0b2545]' : 'bg-gray-300'}`}
                 />
               ))}
             </div>
           )}
        </div>

        {/* Text Section */}
        <div className="mb-10 text-sm md:text-base lg:text-lg leading-relaxed max-w-4xl" style={{ color: brandBlue }}>
           <p className="mb-6 font-medium">
             Athena Beach Hotel has received numerous awards over the years, <br className="hidden md:block" />
             which is a great honour for us. Here is a summary of the most recent awards.
           </p>
           <p className="font-medium">
             We appreciate your support. Please share your experiences <br className="hidden md:block" />
             on the Tripadvisor website.
           </p>
        </div>

        {/* TripAdvisor Widget */}
        <div className="w-full mb-12">
          <div className="bg-[#fdfdfd] border border-[#00aa6c]/40 shadow-sm p-6 md:p-8 rounded-xl flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-[#00aa6c] flex items-center justify-center shrink-0 p-1.5 shadow-sm">
                   <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
                    <path d="M21.944 6.784a9.92 9.92 0 0 0-2.316-3.32A9.914 9.914 0 0 0 16.308 1.15a11.196 11.196 0 0 0-8.618 0 9.91 9.91 0 0 0-3.32 2.315 9.916 9.916 0 0 0-2.316 3.32A11.196 11.196 0 0 0 1.05 15.35c.026.062.062.12.09.18l3.153-2.1c.15-.1.35-.15.55-.15a1.11 1.11 0 0 1 1.11 1.11c0 .2-.05.4-.15.55l-2.1 3.15c.06.03.118.066.18.092 1.343.605 2.81 1.006 4.347 1.006a11.166 11.166 0 0 0 4.348-1.006l.18-.09-2.1-3.153a1.11 1.11 0 0 1-.15-.55c0-.613.497-1.11 1.11-1.11.2 0 .4.05.55.15l3.15 2.1c.028-.06.064-.118.09-.18a11.196 11.196 0 0 0 .914-15.012h-.001zm-5.753 10.456a1.11 1.11 0 0 1-1.11-1.11c0-.2.05-.4.15-.55l2.1-3.15a9.01 9.01 0 0 1 4.577 6.47c-.203.226-.425.438-.663.634l-3.154-2.1a1.085 1.085 0 0 1-.55-.154h-.001a1.096 1.096 0 0 1-1.35-.04zm5.093-6.07a9.006 9.006 0 0 1-2.923-3.666 8.995 8.995 0 0 1 2.923 3.666zM7.228 15.42l-3.153 2.1a9.018 9.018 0 0 1-.663-.635 9.01 9.01 0 0 1 4.577-6.47l2.1 3.153c.1.15.15.35.15.55a1.11 1.11 0 0 1-1.11 1.11 1.087 1.087 0 0 1-.55-.15l-1.35.042zm-2.17-9.736a8.996 8.996 0 0 1 2.923-3.666 8.996 8.996 0 0 1-2.923 3.666zm5.83-3.32a9.003 9.003 0 0 1 2.223 0 9.004 9.004 0 0 1 2.924 3.666 9.004 9.004 0 0 1-5.147 0A9.004 9.004 0 0 1 10.89 2.364zM12 18.06a8.99 8.99 0 0 1-2.223 0l2.223 3.334 2.223-3.334A8.99 8.99 0 0 1 12 18.06zM7.747 9.873a2.637 2.637 0 1 0 0-5.274 2.637 2.637 0 0 0 0 5.274zm0-3.957a1.32 1.32 0 1 1 0 2.64 1.32 1.32 0 0 1 0-2.64zm8.506 3.957a2.637 2.637 0 1 0 0-5.274 2.637 2.637 0 0 0 0 5.274zm0-3.957a1.32 1.32 0 1 1 0 2.64 1.32 1.32 0 0 1 0-2.64zm-4.253 1.978c-.728 0-1.32.592-1.32 1.32s.592 1.32 1.32 1.32c.728 0 1.32-.592 1.32-1.32s-.592-1.32-1.32-1.32z"/>
                  </svg>
                </div>
                <span className="font-bold text-xl md:text-2xl tracking-tight" style={{ color: "black" }}>Tripadvisor</span>
              </div>
              <a href="#" className="inline-block font-bold text-sm md:text-base underline hover:no-underline mb-5 tracking-tight" style={{ color: "#007a53" }}>
                Review Constantinou Bros<br />Athena Beach Hotel
              </a>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((circle) => (
                    <div key={circle} className="w-[18px] h-[18px] rounded-full border-[2.5px] border-[#00aa6c]" style={{ backgroundColor: "transparent" }}></div>
                  ))}
                </div>
                <span className="text-gray-500 text-sm">(Click to rate)</span>
              </div>
              <button className="bg-[#004d36] hover:bg-[#003d2b] text-white font-semibold py-2.5 px-8 rounded transition-colors text-sm tracking-wide">
                Continue
              </button>
            </div>
            <div className="flex-[1.2] flex flex-col justify-center">
              <div className="bg-white border border-gray-200 rounded-lg p-5 relative shadow-sm h-full flex flex-col justify-between min-h-[140px]">
                 <div className="flex gap-3">
                   <div className="font-serif text-[#00aa6c] text-3xl leading-none font-bold mt-1">"</div>
                   <p className="text-gray-500 text-sm md:text-base pt-1 font-medium leading-relaxed">
                     Title your review - Describe your<br />stay in one sentence or less.
                   </p>
                 </div>
                 <div className="absolute bottom-4 right-4 text-gray-400">
                   <PenLine size={18} />
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 rounded-xl text-white shadow-md" style={{ backgroundColor: brandBlue }}>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[1.5px] border-[#d9a05b] flex items-center justify-center flex-shrink-0" style={{ color: brandGold }}>
              <Headset size={32} className="md:w-10 md:h-10" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl lg:text-2xl uppercase tracking-wider mb-1 md:mb-2">
                WE VALUE YOUR FEEDBACK
              </h3>
              <p className="text-sm md:text-base opacity-90 leading-relaxed max-w-sm">
                Your reviews help us grow and continue creating memorable experiences.
              </p>
            </div>
          </div>
          <button 
            className="font-bold text-sm md:text-base px-6 py-3 md:px-8 md:py-4 rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: brandGold, color: brandBlue }}
          >
            REVIEW US ON TRIPADVISOR
            <ExternalLink size={20} />
          </button>
        </div>

      </div>
    </div>
  );
}
