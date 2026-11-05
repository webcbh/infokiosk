with open("src/App.tsx", "r") as f:
    content = f.read()

replacement = '''          {currentHotel?.content?.heroTexts?.awardDivEnabled !== false && (
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
          )}'''

import re
pattern = re.compile(r'<\s*motion\.div[^>]*variants=\{\{[\s\S]*?className="flex flex-col relative z-10"\s*>[\s\S]*?<\s*/\s*motion\.div\s*>', re.MULTILINE)

content = pattern.sub(replacement, content, count=1)

with open("src/App.tsx", "w") as f:
    f.write(content)
