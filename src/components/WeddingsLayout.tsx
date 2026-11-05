import React from 'react';
import { ChevronLeft, ChevronRight, Heart, Home, Wine, Gift, Flower2, Info, User, Calendar, MapPin, Camera } from 'lucide-react';

export default function WeddingsLayout({ module, onClose }: { module: any, onClose: () => void }) {
  const {
    weddingsTopBarTitle = "WEDDINGS",
    weddingsHeaderTitle = "WEDDINGS",
    weddingsHeaderSubtitle = "Let us make your special day truly unforgettable.<br/>Explore our wedding services and create memories that last a lifetime.",
    weddingsBgColor = "#ffffff",
    weddingsPrimaryColor = "#0f274c",
    weddingsAccentColor = "#d4af37",
    weddingsFontFamily = "sans",
    weddingsTextSize = "base",
    weddingsServices = [
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
    ],
    weddingsNoteTitle = "PLEASE NOTE",
    weddingsNoteDescription = "Availability is subject to the date and venue.<br/>Contact our wedding specialist for a personalized consultation and to start planning your dream day.",
    weddingsLinks = [
      { icon: "user", title: "MEET OUR WEDDING SPECIALIST", url: "#" },
      { icon: "calendar", title: "WEDDING SHOWCASE & EVENTS", url: "#" },
      { icon: "map-pin", title: "HOTEL INFORMATION", url: "#" }
    ]
  } = module;

  const renderIcon = (name: string, props: any) => {
    switch (name) {
      case 'heart': return <Heart {...props} />;
      case 'home': return <Home {...props} />;
      case 'wine': return <Wine {...props} />;
      case 'gift': return <Gift {...props} />;
      case 'flower': return <Flower2 {...props} />;
      case 'info': return <Info {...props} />;
      case 'user': return <User {...props} />;
      case 'calendar': return <Calendar {...props} />;
      case 'map-pin': return <MapPin {...props} />;
      case 'camera': return <Camera {...props} />;
      default: return <Heart {...props} />;
    }
  };

  const titleSizeMap: Record<string, string> = {
    sm: "text-xl md:text-2xl",
    base: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl"
  };

  const bodySizeMap: Record<string, string> = {
    sm: "text-xs md:text-sm",
    base: "text-sm md:text-base",
    lg: "text-base md:text-lg"
  };

  return (
    <div className={`w-full min-h-screen ${weddingsFontFamily === 'serif' ? 'font-serif' : 'font-sans'}`} style={{ backgroundColor: weddingsBgColor }}>
      <style>{`
        .weddings-rich-text p { margin-bottom: 0.5em; }
        .weddings-rich-text p:last-child { margin-bottom: 0; }
        .weddings-rich-text strong { font-weight: 700; }
        .weddings-rich-text em { font-style: italic; }
        .weddings-rich-text ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 0.5em; }
        .weddings-rich-text ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 0.5em; }
        .weddings-rich-text h1, .weddings-rich-text h2, .weddings-rich-text h3 { margin-top: 0.5em; margin-bottom: 0.5em; font-weight: bold; }
      `}</style>
      

      <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-4">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center shrink-0 border-[3px]"
            style={{ backgroundColor: weddingsPrimaryColor, borderColor: weddingsPrimaryColor }}
          >
            {renderIcon("heart", { size: 48, strokeWidth: 1.5, style: { color: weddingsAccentColor } })}
          </div>
          <div className="text-center md:text-left flex flex-col justify-center min-h-[6rem]">
            <h1 className={`${titleSizeMap[weddingsTextSize as string] || titleSizeMap['base']} font-bold mb-2 uppercase`} style={{ color: weddingsPrimaryColor }}>
              {weddingsHeaderTitle}
            </h1>
            <div className="w-16 h-0.5 mb-4 mx-auto md:mx-0" style={{ backgroundColor: weddingsAccentColor }}></div>
            <div 
              className={`weddings-rich-text ${bodySizeMap[weddingsTextSize as string] || bodySizeMap['base']} font-medium`} 
              style={{ color: weddingsPrimaryColor }}
              dangerouslySetInnerHTML={{ __html: weddingsHeaderSubtitle }}
            />
          </div>
        </div>

        {/* Services List */}
        <div className="flex flex-col gap-4">
          {weddingsServices.map((service: any, idx: number) => (
            <div key={idx} className="bg-[#fafafa] rounded-r-2xl rounded-l-lg md:rounded-l-2xl flex flex-col md:flex-row items-center gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden pl-0">
              <div className="w-full md:w-1/3 h-48 md:h-full shrink-0 relative overflow-visible flex items-center">
                <div className="w-full h-full md:h-40 rounded-l-lg md:rounded-2xl overflow-hidden md:ml-2 z-0">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                </div>
                {/* Icon Circle that overlaps */}
                <div className="absolute right-4 md:-right-8 top-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-sm" style={{ backgroundColor: weddingsPrimaryColor, borderColor: "white" }}>
                  {renderIcon(service.icon, { size: 28, strokeWidth: 1.5, style: { color: weddingsAccentColor } })}
                </div>
              </div>
              <div className="flex-1 p-6 md:pl-12 py-8 flex flex-col justify-center">
                <h3 className="font-bold text-lg mb-2 uppercase" style={{ color: weddingsPrimaryColor }}>{service.title}</h3>
                <div className="w-8 h-px mb-3" style={{ backgroundColor: weddingsAccentColor }}></div>
                <div 
                  className="text-sm text-gray-600 leading-relaxed weddings-rich-text" 
                  style={{ color: weddingsPrimaryColor }}
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              </div>
              <div className="px-6 py-4 flex items-center justify-end w-full md:w-auto">
                <ChevronRight size={32} style={{ color: weddingsAccentColor }} className="opacity-80" />
              </div>
            </div>
          ))}
        </div>

        {/* Note Box */}
        <div className="bg-[#fafafa] rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-4 border border-gray-200 mt-4 shadow-sm">
          <div className="shrink-0 mt-1">
            {renderIcon("info", { size: 32, style: { color: weddingsAccentColor } })}
          </div>
          <div className="text-center md:text-left w-full">
            <h3 className="font-bold text-base mb-1 uppercase" style={{ color: weddingsPrimaryColor }}>{weddingsNoteTitle}</h3>
            <div 
              className="text-sm text-gray-700 leading-relaxed weddings-rich-text"
              dangerouslySetInnerHTML={{ __html: weddingsNoteDescription }}
            />
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2 mt-2 mb-12">
          {weddingsLinks.map((link: any, idx: number) => (
            <a 
              key={idx}
              href={link.url}
              className="w-full flex items-center justify-between p-4 rounded text-white font-medium text-sm tracking-wider uppercase transition-opacity hover:opacity-90"
              style={{ backgroundColor: weddingsPrimaryColor }}
            >
              <div className="flex items-center gap-4">
                {renderIcon(link.icon, { size: 20, style: { color: weddingsAccentColor } })}
                <span>{link.title}</span>
              </div>
              <ChevronRight size={20} className="text-white" />
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
