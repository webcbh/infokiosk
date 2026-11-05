import re

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "      {/* Full Screen Image Lightbox */}",
    "      </React.Suspense>\n      {/* Full Screen Image Lightbox */}"
)

with open("src/App.tsx", "w") as f:
    f.write(content)
