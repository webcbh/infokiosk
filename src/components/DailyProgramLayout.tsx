import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MapPin, Clock, Calendar, ChevronRight, Info, Music, Droplets, Dumbbell, Users, Star, Wine, Footprints, Flame } from 'lucide-react';
import { format, parseISO, isValid, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, eachDayOfInterval, isToday } from 'date-fns';
import { X, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';

const brandBlue = "#0b2545";
const brandGold = "#d9a05b";

export default function DailyProgramLayout({ currentHotel, onBack }: { currentHotel: any, onBack?: () => void }) {
  const [dailyProgram, setDailyProgram] = useState<any[]>(currentHotel?.content?.dailyProgram || []);
  const customCategories = currentHotel?.content?.dailyProgramCategories || [];
  
  useEffect(() => {
    setDailyProgram(currentHotel?.content?.dailyProgram || []);
  }, [currentHotel?.content?.dailyProgram]);
  
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getCatDetails = (catName: string) => {
    const custom = customCategories.find((c: any) => c.name?.toLowerCase() === catName?.toLowerCase());
    if (custom) return custom;
    return null;
  };

  const getCategoryIcon = (category: string, className: string = "") => {
    const c = (category || "").toLowerCase();
    if (c.includes("sport") || c.includes("game") || c.includes("activities")) return <Footprints className={className} />;
    if (c.includes("water")) return <Droplets className={className} />;
    if (c.includes("fitness") || c.includes("wellness")) return <Dumbbell className={className} />;
    if (c.includes("entertainment") || c.includes("show")) return <Music className={className} />;
    if (c.includes("kids") || c.includes("family")) return <Users className={className} />;
    if (c.includes("bar") || c.includes("lounge")) return <Wine className={className} />;
    if (c.includes("evening")) return <Star className={className} />;
    return <Flame className={className} />;
  };

  const getCategoryColorClass = (category: string) => {
    const c = (category || "").toLowerCase();
    if (c.includes("water")) return "text-[#00a8e8] border-[#00a8e8]";
    if (c.includes("entertainment")) return "text-[#ff4d4f] border-[#ff4d4f]";
    if (c.includes("fitness")) return "text-[#9c27b0] border-[#9c27b0]";
    if (c.includes("sport")) return "text-[#52c41a] border-[#52c41a]";
    if (c.includes("bar") || c.includes("evening")) return "text-[#fa8c16] border-[#fa8c16]";
    if (c.includes("kids")) return "text-[#00bcd4] border-[#00bcd4]";
    return "text-[#fa8c16] border-[#fa8c16]";
  };

  if (!dailyProgram || dailyProgram.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAFAFA]">
        <Calendar size={64} className="text-neutral-300 mb-4" />
        <h2 className="text-2xl font-bold text-neutral-600">No Program Available</h2>
        <p className="text-neutral-500 mt-2">The daily program has not been published yet.</p>
        {onBack && (
          <button onClick={onBack} className="mt-6 px-6 py-2 bg-[#0b2545] text-white font-medium rounded-lg transition-colors">Go Back</button>
        )}
      </div>
    );
  }

  // Categories for Sidebar
  const sidebarCategories = [
    { id: "all", label: "ALL ACTIVITIES" },
    { id: "sport", label: "SPORT & GAMES" },
    { id: "water", label: "WATER ACTIVITIES" },
    { id: "fitness", label: "FITNESS & WELLNESS" },
    { id: "entertainment", label: "ENTERTAINMENT" },
    { id: "kids", label: "KIDS & FAMILY" },
    { id: "evening", label: "EVENING SHOWS" },
    { id: "bars", label: "BARS & LOUNGES" }
  ];

  const safeIdx = Math.max(0, Math.min(activeDayIdx, dailyProgram.length - 1));
  const currentDay = dailyProgram[safeIdx] || {};
  let allEvents = currentDay.events || [];
  
  const filteredEvents = activeCategory === "all" 
    ? allEvents 
    : allEvents.filter((ev: any) => {
        const cat = (ev.category || "").toLowerCase();
        return cat.includes(activeCategory);
      });

  const parseTimeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    const period = match[3] ? match[3].toUpperCase() : null;
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + mins;
  };

  const sortedEvents = [...filteredEvents].sort((a: any, b: any) => {
    return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
  });

  const upcomingDays = dailyProgram.slice(safeIdx + 1, safeIdx + 6);

  return (
    <>
    <div className="w-full h-full bg-[#fcfcfc] font-sans text-neutral-800 overflow-y-auto">
      {/* Top Banner */}
      <div className="px-4 py-4 flex items-center sticky top-0 z-50 shadow-sm" style={{ backgroundColor: brandBlue, color: "white" }}>
        {onBack && (
          <button onClick={onBack} className="flex items-center hover:opacity-80 transition-opacity font-semibold">
            <ChevronLeft size={24} className="mr-2" />
            <span className="tracking-wide uppercase text-sm md:text-base lg:text-lg">DAILY PROGRAM</span>
          </button>
        )}
      </div>

      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 mb-10">
          <div className="flex-shrink-0">
            <div 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[3px] flex items-center justify-center bg-white" 
              style={{ borderColor: brandGold, backgroundColor: brandBlue, color: brandGold }}
            >
              <Calendar size={48} className="md:w-16 md:h-16" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 uppercase tracking-tight" style={{ color: brandBlue }}>
              DAILY PROGRAM
            </h1>
            <div className="w-16 h-1 mb-4" style={{ backgroundColor: brandGold }}></div>
            <p className="text-sm md:text-lg lg:text-xl leading-relaxed max-w-2xl" style={{ color: brandBlue }}>
              Explore our exciting activities and entertainment<br className="hidden md:block" />
              for a fun-filled stay every day.
            </p>
          </div>
        </div>

        {/* Days of the Week Selector */}
        <div className="flex items-center gap-2 overflow-x-auto mb-8 scrollbar-hide pb-2 border-b border-gray-200">
          {dailyProgram.map((day: any, idx: number) => {
            const isActive = idx === safeIdx;
            let parsedDate = null;
            try {
              if (day.date) parsedDate = parseISO(day.date);
            } catch(e) {}
            
            let dayOfWeek = "DAY";
            let dateNum = "";
            if (parsedDate && isValid(parsedDate)) {
              dayOfWeek = format(parsedDate, "EEE").toUpperCase();
              dateNum = format(parsedDate, "dd.MM");
            } else if (day.title) {
              const parts = day.title.split(" ");
              dayOfWeek = parts[0]?.toUpperCase() || "DAY";
              dateNum = parts[1] || "";
            }

            return (
              <button
                key={day.id || idx}
                onClick={() => { setActiveDayIdx(idx); setActiveCategory("all"); }}
                className={`flex items-center justify-center gap-2 min-w-[120px] px-4 py-3 border-b-[3px] transition-all ${
                  isActive 
                    ? "bg-[#0b2545] text-white rounded-t-lg border-[#0b2545]" 
                    : "bg-white text-gray-500 border-transparent hover:bg-gray-50 rounded-t-lg"
                }`}
                style={isActive ? { backgroundColor: brandBlue, borderColor: brandBlue } : {}}
              >
                <Calendar size={18} className={isActive ? "text-[#d9a05b]" : "text-gray-400"} />
                <div className="flex flex-col items-start leading-tight">
                  <span className={`text-xs font-bold ${isActive ? "text-[#d9a05b]" : ""}`}>{dayOfWeek}</span>
                  <span className="text-sm font-semibold">{dateNum}</span>
                </div>
              </button>
            );
          })}
          <div className="ml-auto pl-4 flex-shrink-0 cursor-pointer text-gray-400 hover:text-gray-600">
             <ChevronRight size={24} />
          </div>
        </div>

        {/* Main Content Split */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-4">
            <div className="rounded-xl overflow-hidden flex flex-col shadow-sm" style={{ backgroundColor: brandBlue }}>
              {sidebarCategories.map((cat, idx) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                      isActive ? "bg-white/10" : "hover:bg-white/5"
                    } ${idx !== sidebarCategories.length - 1 ? 'border-b border-white/10' : ''}`}
                  >
                    {getCategoryIcon(cat.label, `w-6 h-6 ${isActive ? "text-[#d9a05b]" : getCategoryColorClass(cat.label).split(' ')[0]}`)}
                    <span className={`font-bold tracking-wide text-sm ${isActive ? "text-[#d9a05b]" : "text-white"}`}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
              
              {/* Please Note Box */}
              <div className="m-4 mt-6 p-5 rounded-lg border border-white/20 bg-white/5 text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border border-[#d9a05b] flex items-center justify-center mb-3">
                  <Info size={20} className="text-[#d9a05b]" />
                </div>
                <h4 className="text-white font-bold text-sm tracking-wider mb-3">PLEASE NOTE</h4>
                <p className="text-white/80 text-xs leading-relaxed">
                  Program is subject to<br/>change without prior<br/>notice.<br/><br/>
                  Please check the<br/>information boards or<br/>ask at Guest Services<br/>for the latest updates.
                </p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 min-w-0">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[100px_1fr_120px_60px] gap-4 px-4 py-3 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              <div>TIME</div>
              <div>ACTIVITY</div>
              <div>LOCATION</div>
              <div className="text-center">TYPE</div>
            </div>

            {/* Event List */}
            <div className="space-y-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={safeIdx + activeCategory}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col border border-gray-100 rounded-lg overflow-hidden bg-white shadow-sm"
                >
                  {allEvents.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      No events scheduled for this day.
                    </div>
                  ) : sortedEvents.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      No activities in this category.
                    </div>
                  ) : (
                    sortedEvents.map((ev: any, idx: number) => (
                      <div 
                        key={ev.id || idx} 
                        className={`grid grid-cols-1 md:grid-cols-[100px_1fr_120px_60px] gap-4 items-center p-4 transition-colors hover:bg-gray-50 ${
                          idx !== sortedEvents.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        {/* Time */}
                        <div className="flex items-center gap-2 text-[#0b2545] font-semibold text-lg md:text-base">
                          <Clock size={16} className="text-gray-400" />
                          {ev.startTime}
                        </div>
                        
                        {/* Activity */}
                        <div className="flex items-center gap-4 min-w-0">
                          {ev.image ? (
                            <img src={ev.image} alt={ev.title} className="w-16 h-12 md:w-20 md:h-14 rounded-md object-cover flex-shrink-0 bg-gray-100" />
                          ) : (
                            <div className="w-16 h-12 md:w-20 md:h-14 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <Calendar size={20} className="text-gray-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3 className="font-bold text-[#0b2545] text-base md:text-lg truncate">{ev.title}</h3>
                            <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-0.5">
                              <MapPin size={14} />
                              <span className="truncate">{ev.location || "TBA"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Desktop: Empty space or secondary location (handled above) - the location column from header */}
                        <div className="hidden md:block"></div>

                        {/* Type Icon */}
                        <div className="hidden md:flex items-center justify-center">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getCategoryColorClass(ev.category)}`}>
                            {getCategoryIcon(ev.category, "w-5 h-5")}
                          </div>
                        </div>
                        
                        {/* Mobile: Type Icon absolutely positioned or below */}
                        <div className="md:hidden flex justify-end">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${getCategoryColorClass(ev.category)}`}>
                            {getCategoryIcon(ev.category, "w-4 h-4")}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Upcoming Days Preview */}
            {upcomingDays.length > 0 && (
              <div className="mt-12">
                <h3 className="font-bold text-[#0b2545] uppercase tracking-wider mb-4">UPCOMING DAYS PREVIEW</h3>
                <div className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden flex flex-col">
                  {upcomingDays.map((day: any, idx: number) => {
                    let parsedDate = null;
                    try {
                      if (day.date) parsedDate = parseISO(day.date);
                    } catch(e) {}
                    
                    let dayStr = "DAY";
                    if (parsedDate && isValid(parsedDate)) {
                      dayStr = format(parsedDate, "EEE dd.MM").toUpperCase();
                    } else if (day.title) {
                      dayStr = day.title.toUpperCase();
                    }

                    const numActivities = (day.events || []).length;

                    return (
                      <button 
                        key={idx}
                        onClick={() => { setActiveDayIdx(safeIdx + 1 + idx); setActiveCategory("all"); }}
                        className={`flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                          idx !== upcomingDays.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 text-[#0b2545] font-bold">
                          <Calendar size={18} className="text-gray-400" />
                          {dayStr}
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                          <span className="text-sm">{numActivities} Activities</span>
                          <ChevronRight size={18} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Banner */}
        <div 
          className="mt-12 flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 md:p-8 rounded-xl text-white shadow-lg"
          style={{ backgroundColor: brandBlue }}
        >
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: brandGold, color: brandGold }}>
              <div className="relative">
                <Calendar size={32} className="md:w-10 md:h-10" />
                <Star size={12} className="absolute bottom-1 right-1 fill-current" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl lg:text-2xl uppercase tracking-wider mb-1 md:mb-2">
                DON'T MISS OUT!
              </h3>
              <p className="text-sm md:text-base opacity-90 leading-relaxed">
                Join in the fun and create unforgettable memories.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowCalendar(true)}
            className="font-bold text-sm md:text-base px-6 py-3 md:px-8 md:py-4 rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: brandGold, color: brandBlue }}
          >
            VIEW FULL CALENDAR
            <ChevronRight size={20} />
          </button>
        </div>

      </div>
    </div>

      {/* Calendar Modal */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60"
            onClick={() => setShowCalendar(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: brandBlue, color: 'white' }}>
                <h3 className="font-bold text-lg">Full Calendar</h3>
                <button onClick={() => setShowCalendar(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <button 
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#0b2545]"
                  >
                    <ChevronLeftIcon size={20} />
                  </button>
                  <h4 className="font-bold text-lg text-[#0b2545]">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h4>
                  <button 
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-[#0b2545]"
                  >
                    <ChevronRightIcon size={20} />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs font-bold text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    const monthStart = startOfMonth(currentMonth);
                    const monthEnd = endOfMonth(monthStart);
                    const startDate = startOfWeek(monthStart);
                    const endDate = endOfWeek(monthEnd);
                    
                    const dateFormat = "d";
                    const rows = [];
                    
                    let days = [];
                    let day = startDate;
                    let formattedDate = "";
                    
                    while (day <= endDate) {
                      for (let i = 0; i < 7; i++) {
                        formattedDate = format(day, dateFormat);
                        const cloneDay = day;
                        
                        // Check if we have events on this day
                        const dayIndex = dailyProgram.findIndex((dp: any) => {
                          if (!dp.date) return false;
                          try {
                            const dpDate = parseISO(dp.date);
                            return isSameDay(dpDate, cloneDay);
                          } catch(e) {
                            return false;
                          }
                        });
                        
                        const hasEvents = dayIndex !== -1;
                        const isSelectedDay = hasEvents && dayIndex === safeIdx;
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        
                        days.push(
                          <button
                            key={day.toString()}
                            onClick={() => {
                              if (hasEvents) {
                                setActiveDayIdx(dayIndex);
                                setActiveCategory("all");
                                setShowCalendar(false);
                              }
                            }}
                            disabled={!hasEvents}
                            className={`
                              h-10 w-full rounded-full flex items-center justify-center text-sm transition-colors relative
                              ${!isCurrentMonth ? "text-gray-300" : ""}
                              ${hasEvents && !isSelectedDay ? "hover:bg-blue-50 text-[#0b2545] font-semibold cursor-pointer" : ""}
                              ${isSelectedDay ? "bg-[#0b2545] text-white font-bold" : ""}
                              ${!hasEvents ? "text-gray-400 cursor-not-allowed opacity-50" : ""}
                            `}
                          >
                            {formattedDate}
                            {hasEvents && !isSelectedDay && (
                              <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#d9a05b]"></div>
                            )}
                          </button>
                        );
                        day = addDays(day, 1);
                      }
                      rows.push(
                        <React.Fragment key={day.toString()}>
                          {days}
                        </React.Fragment>
                      );
                      days = [];
                    }
                    return rows;
                  })()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
