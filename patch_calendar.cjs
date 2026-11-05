const fs = require('fs');
let code = fs.readFileSync('src/components/DailyProgramLayout.tsx', 'utf8');

const importsTarget = `import { format, parseISO, isValid, addDays } from 'date-fns';`;
const importsReplacement = `import { format, parseISO, isValid, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, eachDayOfInterval, isToday } from 'date-fns';
import { X, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'lucide-react';`;

code = code.replace(importsTarget, importsReplacement);

const stateTarget = `  const [activeCategory, setActiveCategory] = useState("all");`;
const stateReplacement = `  const [activeCategory, setActiveCategory] = useState("all");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());`;

code = code.replace(stateTarget, stateReplacement);

const buttonTarget = `          <button 
            className="font-bold text-sm md:text-base px-6 py-3 md:px-8 md:py-4 rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: brandGold, color: brandBlue }}
          >
            VIEW FULL CALENDAR
            <ChevronRight size={20} />
          </button>`;

const buttonReplacement = `          <button 
            onClick={() => setShowCalendar(true)}
            className="font-bold text-sm md:text-base px-6 py-3 md:px-8 md:py-4 rounded flex items-center justify-center gap-2 transition-opacity hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: brandGold, color: brandBlue }}
          >
            VIEW FULL CALENDAR
            <ChevronRight size={20} />
          </button>`;

code = code.replace(buttonTarget, buttonReplacement);

const endTarget = `    </div>
  );
}`;

const endReplacement = `    </div>

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
                            className={\`
                              h-10 w-full rounded-full flex items-center justify-center text-sm transition-colors relative
                              \${!isCurrentMonth ? "text-gray-300" : ""}
                              \${hasEvents && !isSelectedDay ? "hover:bg-blue-50 text-[#0b2545] font-semibold cursor-pointer" : ""}
                              \${isSelectedDay ? "bg-[#0b2545] text-white font-bold" : ""}
                              \${!hasEvents ? "text-gray-400 cursor-not-allowed opacity-50" : ""}
                            \`}
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
  );
}`;

code = code.replace(endTarget, endReplacement);
fs.writeFileSync('src/components/DailyProgramLayout.tsx', code);
