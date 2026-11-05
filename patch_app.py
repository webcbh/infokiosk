import re

with open("src/App.tsx", "r") as f:
    content = f.read()

imports_to_lazy = [
    "AwardsLayout", "GolfLayout", "LoyaltyLayout", "SpaLayout", 
    "WeddingsLayout", "DirectoryOfServicesLayout", "GeneralInfoLayout", 
    "BusRoutesLayout", "AirportInfoLayout", "InteractiveMapLayout", 
    "SuitesGridLayout", "RestaurantsGridLayout", "DailyProgramLayout", 
    "LocalAttractionsLayout"
]

for imp in imports_to_lazy:
    content = re.sub(
        rf'import {imp} from "\./components/{imp}";\n',
        rf'const {imp} = React.lazy(() => import("./components/{imp}"));\n',
        content
    )

content = content.replace("import React, { useEffect, useState } from \"react\";", "import React, { useEffect, useState, Suspense } from \"react\";")

# Wrap the render block in Suspense
content = content.replace(
    "switch (activeModule.template) {",
    "const renderContent = () => {\n      switch (activeModule.template) {"
)

# And then we need to close it and wrap in Suspense where it was originally called
# Let's inspect where it's called
