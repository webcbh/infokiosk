import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Shirt,
  CalendarDays,
  Info,
  ChevronRight,
  X,
} from "lucide-react";
import { LazyImage } from "./LazyImage";
import { DynamicIcon } from "../App";

export default function RestaurantSubmodule({
  submodule,
  onClose,
  onOpenIframe,
}: {
  submodule: any;
  onClose: () => void;
  onOpenIframe?: (url: string) => void;
}) {
  const [activeMenu, setActiveMenu] = useState<any>(null);

  // Fallback data if not provided in submodule
  const hours = submodule.hours || "6:30 PM - 11:00 PM";
  const dressCode = submodule.dressCode || "Smart Casual";
  const reservations = submodule.reservations || "Required for dinner.";
  const info =
    submodule.information ||
    "Kindly be informed that for reservations of 5 people or more, please see the hotel's maître d'hôtel to assist you.";

  // Example menus structure if not provided
  const menus = submodule.menus || [
    {
      title: "À LA CARTE MENU",
      icon: "UtensilsCrossed",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "DESSERTS & DRINKS MENU",
      icon: "Cake",
      image:
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: "WINE LIST",
      icon: "Wine",
      image:
        "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  if (activeMenu) {
    return (
      <div className="fixed inset-0 z-[70] bg-[#faf9f6] overflow-y-auto">
        <div className="sticky top-0 left-0 w-full z-40 p-6 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={() => setActiveMenu(null)}
              className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all font-sans text-xs tracking-widest uppercase w-max relative z-50 shadow-xl cursor-pointer bg-white/80 border border-gray-200 text-gray-700 hover:text-black hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Restaurant
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12 pb-32">
          <h2 className="text-3xl font-serif text-[#0F203C] mb-8 text-center uppercase tracking-wider">
            {activeMenu.title}
          </h2>

          {activeMenu.images && activeMenu.images.length > 0 ? (
            <div className="flex flex-col gap-8">
              {activeMenu.images.map((img: string, i: number) => (
                <div
                  key={i}
                  className="w-full rounded-2xl overflow-hidden shadow-lg border border-black/5 bg-white"
                >
                  <LazyImage
                    src={img}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>
          ) : activeMenu.image ? (
            <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-black/5 bg-white">
              <LazyImage
                src={activeMenu.image}
                className="w-full h-auto object-contain"
              />
            </div>
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-white rounded-2xl border border-black/5">
              <p className="text-neutral-500 font-sans">
                Menu image not available.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-32 bg-[#faf9f6] min-h-screen font-sans">
      {/* Header / Hero Image */}
      <div className="w-full px-4 md:px-8 pt-6 pb-8 max-w-7xl mx-auto">
        <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-lg relative bg-neutral-100">
          <LazyImage
            src={
              submodule.image ||
              "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2000&auto=format&fit=crop"
            }
            alt={submodule.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6">
        {/* Title & Description section */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start mb-16">
          <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full bg-[#1A2E4D] flex items-center justify-center shadow-md">
            {/* Custom icon or default restaurant icon */}
            <DynamicIcon
              name={submodule.icon || "Utensils"}
              size={48}
              className="text-[#B08955] opacity-90"
              strokeWidth={1}
            />
          </div>

          <div className="flex flex-col pt-2 md:pt-4">
            <h1 className="text-3xl md:text-4xl font-serif text-[#1A2E4D] uppercase font-bold mb-2 tracking-wide leading-tight">
              {submodule.title}
            </h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[#B08955] uppercase tracking-widest font-medium text-sm md:text-base">
                {submodule.subtitle || "A LA CARTE"}
              </span>
              <div className="h-px bg-[#B08955]/30 flex-1 max-w-[100px]"></div>
            </div>

            <div
              className="text-[#3A4E6B] leading-relaxed text-[16px] md:text-[17px] font-normal"
              dangerouslySetInnerHTML={{
                __html:
                  submodule.content ||
                  submodule.description ||
                  "Experience culinary excellence in a refined atmosphere. Our chefs use the finest ingredients to create unforgettable dishes.",
              }}
            />
          </div>
        </div>

        {/* Info Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16 border-t border-b border-black/10 py-10">
          <div className="flex flex-col items-center text-center px-4">
            <div className="w-16 h-16 rounded-full border border-[#B08955] flex items-center justify-center mb-4 text-[#B08955]">
              <Clock size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-[#1A2E4D] font-bold text-sm tracking-widest uppercase mb-3">
              Restaurant Hours
            </h3>
            <p className="text-[#3A4E6B] text-[15px]">{hours}</p>
          </div>

          <div className="flex flex-col items-center text-center px-4 border-t md:border-t-0 md:border-l border-black/10 pt-8 md:pt-0">
            <div className="w-16 h-16 rounded-full border border-[#B08955] flex items-center justify-center mb-4 text-[#B08955]">
              <Shirt size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-[#1A2E4D] font-bold text-sm tracking-widest uppercase mb-3">
              Dress Code
            </h3>
            <p className="text-[#3A4E6B] text-[15px] whitespace-pre-line">
              {dressCode}
            </p>
          </div>

          <div className="flex flex-col items-center text-center px-4 border-t md:border-t-0 md:border-l border-black/10 pt-8 md:pt-0">
            <div className="w-16 h-16 rounded-full border border-[#B08955] flex items-center justify-center mb-4 text-[#B08955]">
              <CalendarDays size={28} strokeWidth={1.5} />
            </div>
            <h3 className="text-[#1A2E4D] font-bold text-sm tracking-widest uppercase mb-3">
              Reservations
            </h3>
            <p className="text-[#3A4E6B] text-[15px] whitespace-pre-line">
              {reservations}
            </p>
          </div>
        </div>

        {/* Important Information */}
        {info && (
          <div className="w-full rounded-2xl border border-[#B08955]/30 bg-[#FDFCFA] p-6 md:p-8 flex items-start gap-5 mb-16 shadow-sm">
            <div className="w-10 h-10 shrink-0 rounded-full border border-[#B08955] text-[#B08955] flex items-center justify-center mt-1">
              <Info size={20} strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-[#1A2E4D] font-bold text-[15px] tracking-widest uppercase mb-2">
                Important Information
              </h3>
              <p className="text-[#3A4E6B] text-[15px] leading-relaxed">
                {info}
              </p>
            </div>
          </div>
        )}

        {/* Book Button */}
        {submodule.button?.label && (
          <div className="flex justify-center mb-16">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (submodule.button.url) {
                  if (onOpenIframe) {
                    onOpenIframe(submodule.button.url);
                  } else {
                    window.open(submodule.button.url, "_blank");
                  }
                }
              }}
              className="bg-[#1A2E4D] hover:bg-[#2A4165] text-white px-10 py-4 rounded-lg font-medium text-[15px] tracking-wider uppercase transition-colors shadow-md"
            >
              {submodule.button.label || "Book Dinner"}
            </button>
          </div>
        )}

        {/* Menus List */}
        {menus && menus.length > 0 && (
          <div className="flex flex-col gap-3 max-w-4xl mx-auto">
            {menus.map((menu: any, index: number) => (
              <button
                key={index}
                onClick={() => setActiveMenu(menu)}
                className="w-full bg-[#1A2E4D] hover:bg-[#2A4165] text-white rounded-xl p-5 md:p-6 flex items-center gap-5 transition-colors group text-left shadow-sm"
              >
                <div className="text-[#B08955]">
                  <DynamicIcon
                    name={menu.icon || "FileText"}
                    size={28}
                    strokeWidth={1.5}
                  />
                </div>
                <span className="flex-1 font-medium text-[15px] md:text-[16px] tracking-wider uppercase">
                  {menu.title}
                </span>
                <ChevronRight
                  size={24}
                  className="text-white/60 group-hover:text-white transition-colors"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
