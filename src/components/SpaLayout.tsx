import React, { useState, useEffect } from 'react';
import { ChevronLeft, Flower2, Droplet, Box, DoorOpen, Hand, Users, SprayCan, Waves, Dumbbell, Heart, BedDouble, Wind, Sparkles, Sofa, Gift, Scissors, Activity, Phone, Calendar, Info, ChevronRight } from 'lucide-react';

export default function SpaLayout({ module, onClose }: { module: any, onClose: () => void }) {
  const {
    spaTopBarTitle = "ELIXIR SPA",
    spaHeaderTitle = "ELIXIR SPA",
    spaHeaderSubtitle = "A sanctuary of relaxation and rejuvenation",
    spaHeroImages = module.spaHeroImage ? [module.spaHeroImage] : ["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"],
    spaBgColor = "#ffffff",
    spaPrimaryColor = "#0f274c",
    spaAccentColor = "#d4af37",
    spaFontFamily = "sans",
    spaTextSize = "base",
    spaFeatures = [
      { icon: "flower", title: "UNPARALLELED TREATMENTS", description: "Our spa treatments are unparalleled, offering you the luxury of a private space and creating a sense of eternal calm." },
      { icon: "droplet", title: "RELIEVE & REJUVENATE", description: "Pamper yourself to satisfy your senses, relieve your body of any tension, and rejuvenate your mind." },
      { icon: "box", title: "ULTIMATE RELAXATION", description: "With a total area of 800 square meters, the renovated Elixir Spa will offer the ultimate atmosphere and relaxation to all its guests." }
    ],
    spaStandoutFeature = {
      icon: "door",
      title: "A STANDOUT FEATURE",
      description: "With relaxation rooms, including 2 suites for couples, 2 saunas, 2 steam baths, a spacious and modern gym, and an indoor pool, to name just a few, the Elixir Spa will prove to be one of the hotel's standout features."
    },
    spaFacilitiesTitle = "FACILITIES & AMENITIES",
    spaFacilities = [
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
    ],
    spaBooking = {
      icon: "phone",
      title: "FOR BOOKINGS",
      description: "Please contact Elixir Spa or Reception.",
      buttonText: "CONTACT NOW",
      buttonUrl: "#"
    },
    spaLinks = [
      { icon: "calendar", title: "DAILY PROGRAM & ACTIVITIES", url: "#" },
      { icon: "flower", title: "WELLNESS & FITNESS", url: "#" },
      { icon: "info", title: "IMPORTANT INFORMATION", url: "#" }
    ]
  } = module;

  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    if (spaHeroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIdx((prev) => (prev + 1) % spaHeroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [spaHeroImages]);

  const renderIcon = (name: string, props: any) => {
    switch (name) {
      case 'flower': return <Flower2 {...props} />;
      case 'droplet': return <Droplet {...props} />;
      case 'box': return <Box {...props} />;
      case 'door': return <DoorOpen {...props} />;
      case 'hand': return <Hand {...props} />;
      case 'users': return <Users {...props} />;
      case 'spray': return <SprayCan {...props} />;
      case 'waves': return <Waves {...props} />;
      case 'dumbbell': return <Dumbbell {...props} />;
      case 'heart': return <Heart {...props} />;
      case 'bed': return <BedDouble {...props} />;
      case 'wind': return <Wind {...props} />;
      case 'sparkles': return <Sparkles {...props} />;
      case 'sofa': return <Sofa {...props} />;
      case 'gift': return <Gift {...props} />;
      case 'scissors': return <Scissors {...props} />;
      case 'activity': return <Activity {...props} />;
      case 'phone': return <Phone {...props} />;
      case 'calendar': return <Calendar {...props} />;
      case 'info': return <Info {...props} />;
      default: return <Flower2 {...props} />;
    }
  };

  const titleSizeMap: Record<string, string> = {
    sm: "text-xl md:text-3xl",
    base: "text-2xl md:text-4xl",
    lg: "text-3xl md:text-5xl"
  };

  const bodySizeMap: Record<string, string> = {
    sm: "text-xs md:text-sm",
    base: "text-sm md:text-base",
    lg: "text-base md:text-lg"
  };

  return (
    <div className={`w-full min-h-screen ${spaFontFamily === 'serif' ? 'font-serif' : 'font-sans'}`} style={{ backgroundColor: spaBgColor }}>
      <style>{`
        .spa-rich-text p { margin-bottom: 0.5em; }
        .spa-rich-text p:last-child { margin-bottom: 0; }
        .spa-rich-text strong { font-weight: 700; }
        .spa-rich-text em { font-style: italic; }
        .spa-rich-text ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.5em; }
        .spa-rich-text ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 0.5em; }
        .spa-rich-text h1, .spa-rich-text h2, .spa-rich-text h3 { margin-top: 0.5em; margin-bottom: 0.5em; font-weight: bold; }
      `}</style>

      <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-2">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: spaPrimaryColor }}
          >
            <Flower2 size={48} style={{ color: spaAccentColor }} />
          </div>
          <div className="text-center md:text-left flex flex-col justify-center min-h-[6rem]">
            <h1 className={`${titleSizeMap[spaTextSize as string] || titleSizeMap['base']} font-bold mb-2`} style={{ color: spaPrimaryColor }}>
              {spaHeaderTitle}
            </h1>
            <div 
              className={`spa-rich-text ${bodySizeMap[spaTextSize as string] || bodySizeMap['base']} font-medium`} 
              style={{ color: spaPrimaryColor }}
              dangerouslySetInnerHTML={{ __html: spaHeaderSubtitle }}
            />
          </div>
        </div>

        {/* Hero Images Gallery */}
        {spaHeroImages && spaHeroImages.length > 0 && (
          <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg relative group">
            <img 
              src={spaHeroImages[currentImageIdx]} 
              alt={spaHeaderTitle} 
              className="w-full h-full object-cover transition-opacity duration-500" 
            />
            
            {spaHeroImages.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentImageIdx((prev) => (prev - 1 + spaHeroImages.length) % spaHeroImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={() => setCurrentImageIdx((prev) => (prev + 1) % spaHeroImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/30 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/50"
                >
                  <ChevronRight size={24} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {spaHeroImages.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIdx(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIdx ? 'bg-white scale-125' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* 3 Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {spaFeatures.map((feature: any, idx: number) => (
            <div key={idx} className="bg-[#fafafa] rounded-2xl p-8 flex flex-col items-center text-center border border-gray-100 shadow-sm">
              <div className="mb-6">
                {renderIcon(feature.icon, { size: 48, strokeWidth: 1, style: { color: spaAccentColor } })}
              </div>
              <h3 className="font-bold text-sm tracking-wide mb-4" style={{ color: spaPrimaryColor }}>{feature.title}</h3>
              <div 
                className="text-sm text-gray-600 leading-relaxed spa-rich-text" 
                style={{ color: spaPrimaryColor }}
                dangerouslySetInnerHTML={{ __html: feature.description }}
              />
            </div>
          ))}
        </div>

        {/* Standout Feature */}
        <div className="bg-[#fafafa] rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-100 shadow-sm">
          <div className="shrink-0">
            {renderIcon(spaStandoutFeature.icon, { size: 64, strokeWidth: 1, style: { color: spaAccentColor } })}
          </div>
          <div className="text-center md:text-left w-full">
            <h3 className="font-bold text-sm tracking-wide mb-2" style={{ color: spaPrimaryColor }}>{spaStandoutFeature.title}</h3>
            <div 
              className="text-sm text-gray-600 leading-relaxed spa-rich-text" 
              style={{ color: spaPrimaryColor }}
              dangerouslySetInnerHTML={{ __html: spaStandoutFeature.description }}
            />
          </div>
        </div>

        {/* Facilities Grid */}
        <div className="mt-4">
          <h2 className="font-bold text-lg mb-6" style={{ color: spaPrimaryColor }}>{spaFacilitiesTitle}</h2>
          <div className="bg-[#fafafa] rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {spaFacilities.map((facility: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: spaPrimaryColor }}>
                    {renderIcon(facility.icon, { size: 24, strokeWidth: 1.5, style: { color: spaAccentColor } })}
                  </div>
                  <span className="text-sm font-medium" style={{ color: spaPrimaryColor }}>{facility.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking */}
        <div className="bg-[#fafafa] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100 shadow-sm mt-4">
          <div className="flex flex-col md:flex-row items-center gap-6 flex-1 w-full">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 bg-white shadow-sm border border-gray-100">
              {renderIcon(spaBooking.icon, { size: 32, strokeWidth: 1.5, style: { color: spaAccentColor } })}
            </div>
            <div className="text-center md:text-left w-full">
              <h3 className="font-bold text-base mb-1" style={{ color: spaPrimaryColor }}>{spaBooking.title}</h3>
              <div 
                className="text-sm spa-rich-text" 
                style={{ color: spaPrimaryColor }}
                dangerouslySetInnerHTML={{ __html: spaBooking.description }}
              />
            </div>
          </div>
          <a 
            href={spaBooking.buttonUrl}
            onClick={(e) => {
              if (module?.button?.moduleId) {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('openModule', { detail: module.button.moduleId }));
              }
            }}
            className="px-8 py-3 rounded text-sm font-bold tracking-wider transition-opacity hover:opacity-90 whitespace-nowrap"
            style={{ backgroundColor: spaPrimaryColor, color: "white" }}
          >
            {module?.button?.label || spaBooking.buttonText}
          </a>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3 mt-4 mb-12">
          {spaLinks.map((link: any, idx: number) => (
            <a 
              key={idx}
              href={link.url}
              className="w-full flex items-center justify-between p-4 rounded-lg text-white font-semibold text-sm tracking-widest uppercase transition-opacity hover:opacity-90"
              style={{ backgroundColor: spaPrimaryColor }}
            >
              <div className="flex items-center gap-4">
                {renderIcon(link.icon, { size: 20, style: { color: spaAccentColor } })}
                <span>{link.title}</span>
              </div>
              <ChevronLeft size={20} className="rotate-180" />
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
