with open("src/AdminDashboard.tsx", "r") as f:
    content = f.read()

replacement = """                  <div>
                    <h4 className="font-medium text-neutral-800 mb-4">
                      Hero Texts (Front Page)
                    </h4>
                    <div className="space-y-4">
                      <HeroTextEditor
                        label="Title Top"
                        textKey="titleTop"
                        defaultText="Awarded"
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                      <HeroTextEditor
                        label="Title Middle"
                        textKey="titleMiddle"
                        defaultText="WORLD CLASS"
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                      <HeroTextEditor
                        label="Title Bottom"
                        textKey="titleBottom"
                        defaultText="HOSPITALITY"
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                      <HeroTextEditor
                        label="Subtitle"
                        textKey="subtitle"
                        defaultText="Travel Weekly Globe Travel Awards 2025"
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                      <HeroTextEditor
                        label="Award Category"
                        textKey="awardCategory"
                        defaultText="Best Hotel Chain"
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                      <HeroTextEditor
                        label="Award Winner"
                        textKey="awardWinner"
                        defaultText="Constantinou Bros"
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                      <HeroTextEditor
                        label="Award Div Box"
                        textKey="awardDiv"
                        defaultText=""
                        heroTexts={editingHotel.content?.heroTexts}
                        onChange={(heroTexts) => saveHotelContent(editingHotel.id, { ...editingHotel.content, heroTexts })}
                      />
                    </div>
                  </div>"""

import re
# Find the start of <div> <h4 className="font-medium text-neutral-800 mb-4"> Hero Texts (Front Page) </h4>
start_idx = content.find('                    <h4 className="font-medium text-neutral-800 mb-4">\n                      Hero Texts (Front Page)')
if start_idx != -1:
    div_start = content.rfind('<div>', 0, start_idx)
    end_idx = content.find('                  <div>\n                    <div className="flex justify-between items-center mb-4">\n                      <h4 className="font-medium text-neutral-800">\n                        Hero Banners', start_idx)
    if end_idx != -1:
        content = content[:div_start] + replacement + "\n" + content[end_idx:]
        with open("src/AdminDashboard.tsx", "w") as f:
            f.write(content)
        print("Success")
    else:
        print("End index not found")
else:
    print("Start index not found")
