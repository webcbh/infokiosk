import React from 'react';
import { ChevronLeft, User, Calendar, Info, Tag, Utensils, Scissors, Sparkles, Apple, Wine, Gift, DoorClosed, Star } from 'lucide-react';

export default function LoyaltyLayout({ module, onClose }: { module: any, onClose: () => void }) {
  const {
    loyaltyTopBarTitle = "GUESTS LOYALTY CLUB",
    loyaltyHeaderTitle = "GUESTS LOYALTY CLUB",
    loyaltyHeaderSubtitle = "The more you stay, the more you enjoy.\nJoin our loyalty club and unlock exclusive benefits on every stay.",
    loyaltyBgColor = "#f4f6f8",
    loyaltyPrimaryColor = "#0f274c",
    loyaltyAccentColor = "#d4af37",
    loyaltyFontFamily = "sans",
    loyaltyTextSize = "base",
    loyaltyTiers = [
      {
        id: "blue",
        name: "BLUE MEMBER",
        stays: "2-10 STAYS",
        description: "Become a Blue member after staying just once at any one of our hotels and receive the following benefits on your second visit:",
        color: "#0f274c",
        benefits: [
          { icon: "tag", title: "15% DISCOUNT", subtitle: "on the accommodation rate.", description: "The reward will be valid from the 2nd stay onwards. Only for repeat customers of the hotels." },
          { icon: "utensils", title: "15% DISCOUNT", subtitle: "on all extra food and beverages taken in any of the hotel restaurants and bars during your stay *" },
          { icon: "scissors", title: "15% DISCOUNT", subtitle: "in the hotel hairdressing salon *" },
          { icon: "sparkles", title: "15% DISCOUNT", subtitle: "in the hotel's Elixir Spa *" },
          { icon: "apple", title: "FRUIT", subtitle: "on arrival" },
          { icon: "wine", title: "WINE", subtitle: "on arrival" },
          { icon: "gift", title: "SPECIAL GIFT", subtitle: "on departure" },
          { icon: "door", title: "COMPLIMENTARY COURTESY ROOM", subtitle: "after check out for a couple of hours (subject to availability)" }
        ]
      },
      {
        id: "silver",
        name: "SILVER MEMBER",
        stays: "11+ STAYS",
        description: "Become a Silver member from your 11th visit to any one of our hotels and receive the following benefits:",
        color: "#6c7a89",
        benefits: [
          { icon: "tag", title: "15% DISCOUNT", subtitle: "on the accommodation rate.", description: "The reward will be valid from the 2nd stay onwards. Only for repeat customers of the hotels." },
          { icon: "utensils", title: "20% DISCOUNT", subtitle: "on all extra food and beverages taken in any of the hotel restaurants and bars during your stay *" },
          { icon: "scissors", title: "20% DISCOUNT", subtitle: "in the hotel hairdressing salon *" },
          { icon: "sparkles", title: "20% DISCOUNT", subtitle: "in the hotel's Elixir Spa *" },
          { icon: "apple", title: "FRUIT", subtitle: "on arrival" },
          { icon: "wine", title: "WINE", subtitle: "on arrival" },
          { icon: "gift", title: "SPECIAL GIFT", subtitle: "on departure" },
          { icon: "door", title: "COMPLIMENTARY COURTESY ROOM", subtitle: "after check out until departure time (subject to availability)" }
        ]
      }
    ],
    loyaltyLinks = [
      { icon: "user", title: "VIEW MY LOYALTY STATUS", url: "#" },
      { icon: "calendar", title: "MY BOOKINGS", url: "#" },
      { icon: "info", title: "LOYALTY PROGRAM TERMS & CONDITIONS", url: "#" }
    ]
  } = module;

  const renderIcon = (name: string, props: any) => {
    switch (name) {
      case 'tag': return <Tag {...props} />;
      case 'utensils': return <Utensils {...props} />;
      case 'scissors': return <Scissors {...props} />;
      case 'sparkles': return <Sparkles {...props} />;
      case 'apple': return <Apple {...props} />;
      case 'wine': return <Wine {...props} />;
      case 'gift': return <Gift {...props} />;
      case 'door': return <DoorClosed {...props} />;
      case 'user': return <User {...props} />;
      case 'calendar': return <Calendar {...props} />;
      case 'info': return <Info {...props} />;
      default: return <Star {...props} />;
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
    <div className={`w-full min-h-screen ${loyaltyFontFamily === 'serif' ? 'font-serif' : 'font-sans'}`} style={{ backgroundColor: loyaltyBgColor }}>

      <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-4">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center shrink-0 border-2"
            style={{ backgroundColor: loyaltyPrimaryColor, borderColor: loyaltyPrimaryColor }}
          >
            <div className="relative">
              <User size={48} style={{ color: loyaltyAccentColor }} />
              <Star size={24} className="absolute -bottom-2 -right-2 bg-[#0f274c] rounded-full p-0.5" style={{ color: loyaltyAccentColor }} />
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className={`${titleSizeMap[loyaltyTextSize as string] || titleSizeMap['base']} font-bold mb-4`} style={{ color: loyaltyPrimaryColor }}>
              {loyaltyHeaderTitle}
            </h1>
            <div className="w-16 h-0.5 mb-4 mx-auto md:mx-0" style={{ backgroundColor: loyaltyAccentColor }}></div>
            <p className={`${bodySizeMap[loyaltyTextSize as string] || bodySizeMap['base']} text-gray-700 whitespace-pre-line leading-relaxed font-medium`}>
              {loyaltyHeaderSubtitle}
            </p>
          </div>
        </div>

        {/* Tiers */}
        <div className="flex flex-col gap-8">
          {loyaltyTiers.map((tier: any, tierIdx: number) => (
            <div key={tierIdx} className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-md bg-white">
              {/* Tier Sidebar */}
              <div 
                className="w-full md:w-1/3 p-8 flex flex-col items-center justify-center text-center text-white relative shrink-0"
                style={{ backgroundColor: tier.color }}
              >
                <div className="mb-4">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ color: loyaltyAccentColor }}>
                    <path d="M2 4h20M4 4l3 8h10l3-8M12 22V12"/>
                    <path d="M2 20h20"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold tracking-widest mb-4">{tier.name}</h2>
                <div className="w-12 h-px bg-white/30 mb-4"></div>
                <div className="text-sm font-bold tracking-widest mb-6" style={{ color: loyaltyAccentColor }}>{tier.stays}</div>
                <p className="text-sm opacity-90 leading-relaxed font-light">{tier.description}</p>
              </div>

              {/* Tier Benefits */}
              <div className="w-full md:w-2/3 p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {tier.benefits.map((benefit: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-orange-50 shrink-0 border border-orange-100">
                      {renderIcon(benefit.icon, { size: 24, style: { color: loyaltyAccentColor } })}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 mb-1">{benefit.title}</h4>
                      <p className="text-xs text-gray-700 font-medium mb-1">{benefit.subtitle}</p>
                      {benefit.description && (
                        <p className="text-xs text-gray-500">{benefit.description}</p>
                      )}
                    </div>
                  </div>
                ))}
                <div className="col-span-1 sm:col-span-2 mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-orange-200 flex items-center justify-center text-[8px] font-bold text-orange-400">*</div>
                  <p className="text-xs text-gray-500">Discount not valid if other special offers and packages apply.</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3 mt-4 mb-12">
          {loyaltyLinks.map((link: any, idx: number) => (
            <a 
              key={idx}
              href={link.url}
              className="w-full flex items-center justify-between p-4 rounded-lg text-white font-semibold text-sm tracking-widest uppercase transition-opacity hover:opacity-90"
              style={{ backgroundColor: loyaltyPrimaryColor }}
            >
              <div className="flex items-center gap-4">
                {renderIcon(link.icon, { size: 20, style: { color: loyaltyAccentColor } })}
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
