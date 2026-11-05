import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# We want to replace onClick={goHome} with onClick={goBack} ONLY for the button inside activeSubmodule.
# Let's target the exact class string or surrounding code.
target = """              <button
                onClick={goHome}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all pointer-events-auto relative z-50 cursor-pointer ${activeSubmodule.layout === "restaurant" ? "text-white hover:bg-white/10" : activeSubmodule.layout === "suite" ? "bg-white/80 border border-gray-200 text-gray-700 hover:text-black hover:bg-gray-100 shadow-xl backdrop-blur-md" : "bg-black/40 border border-white/20 text-white/70 hover:text-white hover:bg-black/60 shadow-xl backdrop-blur-md"}`}
              >
                <X size={24} />
              </button>"""

replacement = """              <button
                onClick={goBack}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all pointer-events-auto relative z-50 cursor-pointer ${activeSubmodule.layout === "restaurant" ? "text-white hover:bg-white/10" : activeSubmodule.layout === "suite" ? "bg-white/80 border border-gray-200 text-gray-700 hover:text-black hover:bg-gray-100 shadow-xl backdrop-blur-md" : "bg-black/40 border border-white/20 text-white/70 hover:text-white hover:bg-black/60 shadow-xl backdrop-blur-md"}`}
              >
                <X size={24} />
              </button>"""

content = content.replace(target, replacement)

with open("src/App.tsx", "w") as f:
    f.write(content)
