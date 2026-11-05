original_hero_start = """        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="w-full lg:w-[45%] shrink-0 relative z-20 p-8 lg:p-14 flex flex-col justify-center"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" },
              },
            }}
            className="flex items-center gap-5 mb-14 lg:mb-20"
          >
            <div className="w-14 h-14 bg-transparent border border-[#D9B673] flex items-center justify-center text-[#D9B673] rounded-sm">
              <span className="font-serif text-3xl font-medium tracking-tighter">
                CB
              </span>
            </div>
            <div className="h-12 w-[1px] bg-[#D9B673] opacity-50"></div>
            <div className="text-left font-serif tracking-widest text-white uppercase flex flex-col justify-center relative">
              <button 
                onClick={(e) => {
                  if (config?.settings?.enableHotelSelector !== true) return;
                  e.stopPropagation();
                  setShowHotelDropdown(!showHotelDropdown);
                }}
                className={`flex items-center gap-1.5 text-sm tracking-[0.2em] text-left transition-colors outline-none font-semibold ${config?.settings?.enableHotelSelector === true ? 'hover:text-[#D9B673] cursor-pointer' : 'cursor-default'}`}
              >
                <span>{currentHotel?.name || "Constantinou Bros"}</span>
                {config?.settings?.enableHotelSelector === true && (
                  <LucideIcons.ChevronDown size={14} className={`text-[#D9B673] transition-transform shrink-0 ${showHotelDropdown ? 'rotate-180' : ''}`} />
                )}
              </button>
              <div className="text-sm tracking-[0.2em] mb-1">Hotels</div>
              <div className="text-[9px] tracking-[0.3em] text-white/50">
                Pafos Cyprus
              </div>
              {showHotelDropdown && config?.settings?.enableHotelSelector === true && (
                <div className="absolute top-full left-0 mt-3 bg-[#0B132B]/95 backdrop-blur-md border border-[#B5925A]/30 rounded-lg py-1.5 w-72 shadow-2xl z-50 overflow-hidden">
                  {config?.hotels?.filter((h: any) => h.active).map((h: any) => (
                    <button
                      key={h.id}
                      onClick={() => {
                        setSelectedHotelId(h.id);
                        localStorage.setItem("kiosk_hotel_id", h.id);
                        setShowHotelDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[10px] font-sans font-bold tracking-wider uppercase transition-colors hover:bg-[#B5925A]/15 hover:text-[#D9B673] border-b border-[#B5925A]/5 last:border-0 ${
                        h.id === currentHotel?.id ? "text-[#D9B673] bg-[#B5925A]/10" : "text-white/80"
                      }`}
                    >
                      {h.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
          {currentHotel?.content?.heroTexts?.titleTopEnabled !== false && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
              }}
              className={`mb-2 italic tracking-wide ${currentHotel?.content?.heroTexts?.titleTopSize ?? "text-2xl sm:text-3xl"} ${currentHotel?.content?.heroTexts?.titleTopFontFamily ?? "font-serif"}`}
              style={currentHotel?.content?.heroTexts?.titleTopColor ? { color: currentHotel.content.heroTexts.titleTopColor } : { color: "#D9B673" }}
            >
              {currentHotel?.content?.heroTexts?.titleTop ?? "Awarded"}
            </motion.div>
          )}
          {currentHotel?.content?.heroTexts?.titleMiddleEnabled !== false && (
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
              }}
              className={`tracking-widest leading-tight mb-2 ${currentHotel?.content?.heroTexts?.titleMiddleSize ?? "text-3xl sm:text-4xl lg:text-[54px]"} ${currentHotel?.content?.heroTexts?.titleMiddleFontFamily ?? "font-serif"}`}
              style={currentHotel?.content?.heroTexts?.titleMiddleColor ? { color: currentHotel.content.heroTexts.titleMiddleColor } : { color: "white" }}
            >
              {currentHotel?.content?.heroTexts?.titleMiddle ?? "WORLD CLASS"}
            </motion.h1>
          )}
          {currentHotel?.content?.heroTexts?.titleBottomEnabled !== false && (
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
              }}
              className={`tracking-[0.15em] sm:tracking-[0.2em] mb-4 ${currentHotel?.content?.heroTexts?.titleBottomSize ?? "text-2xl sm:text-3xl lg:text-[40px]"} ${currentHotel?.content?.heroTexts?.titleBottomFontFamily ?? "font-serif"}`}
              style={currentHotel?.content?.heroTexts?.titleBottomColor ? { color: currentHotel.content.heroTexts.titleBottomColor } : { color: "#D9B673" }}
            >
              {currentHotel?.content?.heroTexts?.titleBottom ?? "HOSPITALITY"}
            </motion.h2>
          )}
          {currentHotel?.content?.heroTexts?.subtitleEnabled !== false && (
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
              }}
              className={`tracking-widest uppercase mb-12 w-full lg:w-[120%] z-10 relative ${currentHotel?.content?.heroTexts?.subtitleSize ?? "text-xs"} ${currentHotel?.content?.heroTexts?.subtitleFontFamily ?? "font-sans"}`}
              style={currentHotel?.content?.heroTexts?.subtitleColor ? { color: currentHotel.content.heroTexts.subtitleColor } : { color: "rgba(255,255,255,0.6)" }}
            >
              {currentHotel?.content?.heroTexts?.subtitle ?? "Travel Weekly Globe Travel Awards 2025"}
            </motion.p>
          )}
          {currentHotel?.content?.heroTexts?.awardDivEnabled !== false && (
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: "easeOut" },
                },
              }}
              className="flex flex-col relative z-10"
            >
              <div 
                className={`flex items-center gap-2 mb-1.5 ${currentHotel?.content?.heroTexts?.awardDivSize ?? "text-xl"} ${currentHotel?.content?.heroTexts?.awardDivFontFamily ?? "font-serif"}`}
                style={currentHotel?.content?.heroTexts?.awardDivColor ? { color: currentHotel.content.heroTexts.awardDivColor } : { color: "#D9B673" }}
              >
                <LucideIcons.Award className="w-6 h-6 mr-1" />
                <span className="tracking-wider">WINNER</span>
              </div>
              <div className="font-sans text-sm tracking-wide pl-2 border-l border-[#D9B673]/30">
                <p 
                  style={currentHotel?.content?.heroTexts?.awardCategoryColor ? { color: currentHotel.content.heroTexts.awardCategoryColor } : { color: "white" }}
                  className={`font-medium ${currentHotel?.content?.heroTexts?.awardCategorySize ?? ""} ${currentHotel?.content?.heroTexts?.awardCategoryFontFamily ?? ""}`}
                >
                  {currentHotel?.content?.heroTexts?.awardCategory ?? "Best Hotel Chain"}
                </p>
                <p 
                  style={currentHotel?.content?.heroTexts?.awardWinnerColor ? { color: currentHotel.content.heroTexts.awardWinnerColor } : { color: "rgba(255,255,255,0.7)" }}
                  className={`${currentHotel?.content?.heroTexts?.awardWinnerSize ?? ""} ${currentHotel?.content?.heroTexts?.awardWinnerFontFamily ?? ""}`}
                >
                  {currentHotel?.content?.heroTexts?.awardWinner ?? "Constantinou Bros"}
                </p>
              </div>
            </motion.div>
          )}"""

with open("src/App.tsx", "r") as f:
    content = f.read()

# Locate the bad replacement in App.tsx
import re
pattern = re.compile(r'          \{currentHotel\?\.content\?\.heroTexts\?\.awardDivEnabled !== false && \(\n            <motion\.div\n              variants=\{\{[\s\S]*?            </motion\.div>\n          \)\}', re.MULTILINE)

content = pattern.sub(original_hero_start, content, count=1)

with open("src/App.tsx", "w") as f:
    f.write(content)
